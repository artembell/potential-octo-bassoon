import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
import { PriceService } from 'src/price/price.service';
import { StripeService } from 'src/stripe/stripe.service';
import { UserService } from 'src/user/user.service';
import Stripe from 'stripe';
import { SubscriptionRepository } from './subscription.repository';
import { InvoiceService } from 'src/invoice/invoice.service';
import { ContentService } from 'src/content/content.service';

type TSubscriptionServiceCreateSubscription = {
    userId: number;
    priceId: number;
};

type TSubscriptionServiceSubscribe = {
    priceId: number;
    userId: number;
    cycles: number;
};

@Injectable()
export class SubscriptionService {
    constructor(
        private readonly subscriptionRepo: SubscriptionRepository,
        private readonly priceService: PriceService,

        // @Inject(forwardRef(() => SubscriptionService))
        private readonly invoiceService: InvoiceService,

        private readonly userService: UserService,
        private readonly stripeService: StripeService,
        private readonly contentService: ContentService
    ) { }

    async activateAccess({
        subId
    }: {
        subId: number;
    }) {
        try {
            const subscription = await this.subscriptionRepo.findSubscriptionById(subId);
            const userId = subscription.user.id;
            const contentId = subscription.price.product.content.id;

            /** Give user access to content  */
            const result = await this.contentService.grantAccess({
                contentId,
                userId
            });

            return result;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async removeAll() {
        try {
            await this.subscriptionRepo.removeAll();
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async getCustomerInvoices({
        customerId
    }: {
        customerId: number;
    }) {
        try {
            const customer = await this.userService.findUserById(customerId);
            if (customer === null) {
                throw new Error(`No user with id ${customerId}`);
            }
            const stripeCustomerId = customer.metadata['stripeId'];

            const invoices = await this.stripeService.getCustomerInvoices({
                customerId: stripeCustomerId
            });

            return invoices;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async subscribe({
        priceId,
        userId,
    }: TSubscriptionServiceSubscribe) {
        try {
            console.log(`- create subscription.`);
            const customer = await this.userService.findUserById(userId);
            if (customer === null) {
                throw new Error(`No user with id ${userId}`);
            }
            const stripeCustomerId = customer.metadata['stripeId'];


            const price = await this.priceService.findPriceById(priceId);
            const stripePriceId = price.metadata['stripeId'];

            /** Need to process idempotency correctly */
            const subscription = await this.createSubscriptionIfNotExists({
                userId,
                priceId,
            });

            const idempotencyKey = stripeCustomerId + stripePriceId + subscription.id;
            console.log(`idempotencyKey: ${idempotencyKey}`);

            const stripeSubscription = await this.stripeService.createSubscription({
                customerId: stripeCustomerId,
                priceId: stripePriceId,
                idempotencyKey: idempotencyKey,
                subscriptionId: subscription.id
            });

            let clientSecret: string | null = null;
            if (
                typeof stripeSubscription.latest_invoice === 'object' &&
                typeof stripeSubscription.latest_invoice.payment_intent === 'object'
            ) {
                clientSecret = stripeSubscription.latest_invoice.payment_intent.client_secret;
            } else {
                throw new Error(`App: cannot fetch client secret from latest payment intent.`);
            }

            return {
                stripeSubscriptionId: stripeSubscription.id,
                clientSecret
            };
        } catch (e: unknown) {
            console.error(e);
        }
    }

    /** Idempotent */
    async createSubscriptionIfNotExists({
        userId,
        priceId,
    }: TSubscriptionServiceCreateSubscription) {
        try {
            const subscription =
                await this.subscriptionRepo.findSubscriptionByPriceAndUser(priceId, userId);

            if (subscription === null) {
                const createdSubscription = await this.subscriptionRepo.createSubscription({
                    priceId,
                    userId,
                });

                await this.subscriptionRepo.createSubscriptionPart({
                    subscriptionId: createdSubscription.id,
                    endDate: null,
                    startDate: new Date()
                });

                return createdSubscription;
            }

            return subscription;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async getSubscriptionInvoices({
        subId
    }: {
        subId: number;
    }) {
        try {
            const invoices = await this.invoiceService.getInvoicesOfSubscription({
                subId
            });

            return invoices;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async getSubscriptionWithInvoices({
        subId
    }: {
        subId: number;
    }) {
        try {
            const invoices = await this.getSubscriptionById({
                subId
            });

            return invoices;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async getSubscriptionById({
        subId
    }: {
        subId: number;
    }) {
        try {
            const subscriptions = await this.subscriptionRepo.findSubscriptionById(subId);

            return subscriptions;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async getAllSubscriptions({
        userId
    }: {
        userId: number;
    }) {
        try {
            const userSaved = await this.userService.findUserById(userId);
            const stripeUserId = userSaved.metadata['stripeId'];

            const subs = await this.subscriptionRepo.getAllSubscriptions({
                userId
            });

            const stripeSubs = await this.stripeService.getAllSubscriptions({ userId: stripeUserId });

            return {
                stripeSubs, subs
            };
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async cancelSubscription({
        subscriptionId
    }: {
        subscriptionId: number;
    }) {
        try {
            const subscription = await this.subscriptionRepo.findSubscriptionById(subscriptionId);
            const stripeSubscriptionId = subscription.metadata['stripeId'];

            const cancelledSubscription = await this.stripeService.cancelSubscription({
                subscriptionId: stripeSubscriptionId
            });

            const canceledAt = cancelledSubscription.canceled_at;
            const periodEnd = new Date(cancelledSubscription.current_period_end * 1000);
            const periodStart = new Date(cancelledSubscription.current_period_start * 1000);

            /** User can use this subscription till the end of the period */
            const finallyCancelledSub = await this.markSubscriptionAsCancelled({
                subscriptionId: subscriptionId,
                endDate: periodEnd,
                startDate: periodStart
            });

            return finallyCancelledSub;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    private async markSubscriptionAsCancelled({
        endDate,
        startDate,
        subscriptionId
    }: {
        startDate: Date;
        endDate: Date;
        subscriptionId: number;
    }) {
        try {
            const sub = await this.subscriptionRepo.updateSubscription({
                subscriptionId: subscriptionId,
                status: 'cancelled',
                priceId: undefined,
                userId: undefined
            });

            const f = await this.subscriptionRepo.changeSubscriptionEndDate({
                subscriptionId: subscriptionId,
                endDate: endDate
            });

            const cancelledSub = await this.subscriptionRepo.findSubscriptionById(subscriptionId);

            return cancelledSub;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    /** Make idempotent */
    async pauseSubscription({
        subscriptionId,
        customerId
    }: {
        subscriptionId: number;
        customerId: number;
    }) {
        try {
            const userSaved = await this.userService.findUserById(customerId);
            const subscription = await this.subscriptionRepo.changeSubscriptionEndDate({
                subscriptionId: subscriptionId,
                endDate: new Date()
            });

            const updatedSubscription = await this.updateSubscription({
                subscriptionId,
                status: 'suspended'
            });

            updatedSubscription.price.product.metadata['stripeId'];

            const subs = await this.stripeService.pauseSubscription({
                subscriptionId: subscription.metadata['stripeId'],
                customerId: userSaved.metadata['stripeId'],
                productId: updatedSubscription.price.product.metadata['stripeId']
            });

            return updatedSubscription;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async unpauseSubscription({
        subscriptionId,
        customerId
    }: {
        subscriptionId: number;
        customerId: number;
    }) {
        try {
            const userSaved = await this.userService.findUserById(customerId);
            const stripeCustomerId = userSaved.metadata['stripeId'];

            const sb = await this.subscriptionRepo.findSubscriptionById(subscriptionId);
            const stripePriceId = sb.price.metadata['stripeId'];

            const parts = sb.subscriptionParts.length;

            await this.subscriptionRepo.changeSubscriptionEndDate({
                subscriptionId: subscriptionId,
                endDate: new Date()
            });

            const idempotencyKey = stripeCustomerId + stripePriceId + subscriptionId + parts;

            const stripeSubscription = await this.stripeService.createSubscription({
                customerId: stripeCustomerId,
                priceId: stripePriceId,
                idempotencyKey: idempotencyKey,
                subscriptionId: subscriptionId,
            });

            const updatedSubscription = await this.updateSubscription({
                subscriptionId,
                status: 'active',
                metadata: {
                    stripeId: stripeSubscription.id
                }
            });

            await this.subscriptionRepo.createSubscriptionPart({
                subscriptionId: updatedSubscription.id,
                endDate: null,
                startDate: new Date()
            });

            let pi: Stripe.PaymentIntent;
            if (
                typeof stripeSubscription.latest_invoice === 'object' &&
                typeof stripeSubscription.latest_invoice.payment_intent === 'object'
            ) {
                pi = stripeSubscription.latest_invoice.payment_intent;
            } else {
                throw new Error(`App: cannot fetch client secret from latest payment intent.`);
            }

            await this.stripeService.confirm(stripeCustomerId, pi);

            return null;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    private async updateSubscription({
        subscriptionId,
        metadata,
        status
    }: {
        subscriptionId: number;
        metadata?: any;
        status?: SubscriptionStatus;
    }) {
        try {
            const subsctiptionUpdated =
                await this.subscriptionRepo.updateSubscription({
                    subscriptionId,
                    metadata,
                    status,
                    priceId: undefined,
                    userId: undefined,
                });

            return subsctiptionUpdated;
        } catch (e: unknown) {
            console.error();
        }
    }


    private async handleInvoicePaymentSucceededEvent(event: Stripe.InvoicePaymentSucceededEvent) {
        try {
            // set subscription active
            // set access to courses
            const data = event.data.object;
            const stripeInvoiceId = data.id;
            const lines = data.lines;

            /** Find subscription that invoice belongs to */
            let subscription: Stripe.Subscription;
            for (const item of lines.data) {
                if (item.type === 'subscription') {
                    subscription = item as unknown as Stripe.Subscription;
                }
            }

            /** If this invoice doesnt belong to any subscription */
            if (subscription === undefined) {
                console.error(`No subscription associated found to this invoice.`);
                return;
            }

            const subId = parseInt(subscription.metadata['subscriptionId']);
            const result = this.activateAccess({
                subId
            });
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async handleEvent(event: Stripe.Event) {
        try {
            switch (event.type) {
                case 'customer.subscription.created': {
                    const data = event.data.object;

                    const stripeSubscriptionId = data.id;
                    const savedSubscriptionId = parseInt(data.metadata['subscriptionId']);
                    await this.updateSubscription({
                        subscriptionId: savedSubscriptionId,
                        metadata: {
                            stripeId: stripeSubscriptionId
                        }
                    });

                    break;
                }
                case 'customer.subscription.updated': {
                    const data = event.data.object;

                    const status = data.status;

                    const stripeSubscriptionId = data.id;
                    const savedSubscriptionId = parseInt(data.metadata['subscriptionId']);

                    /** Check if subscription activated */
                    const upd = await this.updateSubscription({
                        subscriptionId: savedSubscriptionId,
                        metadata: {
                            stripeId: stripeSubscriptionId
                        },
                        status: status === 'active' ? 'active' : undefined
                    });
                    break;
                }
                case 'invoice.payment_succeeded': {
                    await this.handleInvoicePaymentSucceededEvent(event);
                    break;
                }
                case 'customer.subscription.deleted': {
                    const data = event.data.object;

                    console.log(data);
                }
                default: {
                    break;
                }
            }
        } catch (e: unknown) {
            console.error(e);
        }
    }
}
