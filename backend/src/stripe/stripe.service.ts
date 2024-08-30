import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    CUSTOMER_EVENTS_PATTERN, INVOICE_EVENTS_PATTERN,
    PAYMENT_EVENTS_PATTERN, SUBSCRIPTION_EVENTS_PATTERN
} from 'src/constants';
import Stripe from 'stripe';

export type TStripeCreateSubscription = {
    customerId: string;
    priceId: string;
    idempotencyKey: string;
    subscriptionId: number;
};

@Injectable()
export class StripeService {
    private stripeClient: Stripe;

    constructor(
        @Inject('WEBHOOK_SERVICE') private broker: ClientProxy,
    ) {
        this.stripeClient = new Stripe(process.env.STRIPE_TEST_KEY);
        this.broker.connect();
    }

    async createPrice({
        productId,
        amount,
        period,
        priceId
    }: {
        productId: string;
        amount: number;
        period: any;
        priceId: number;
    }) {
        try {
            const stripePrice = await this.stripeClient.prices.create({
                product: productId,
                currency: 'usd',
                unit_amount: amount,
                recurring: {
                    interval: period as Stripe.PriceCreateParams.Recurring.Interval,
                },
                metadata: {
                    priceId
                }
            });

            return stripePrice;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async createProduct({
        productId,
        title
    }: {
        title: string;
        productId: number;
    }) {
        try {
            const stripeProduct = await this.stripeClient.products.create({
                name: title,
                metadata: {
                    productId
                }
            });

            return stripeProduct;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    constructEvent({
        signature,
        payload
    }: {
        payload: Buffer;
        signature: string | string[];
    }) {
        return this.stripeClient.webhooks.constructEvent(
            payload,
            signature,
            process.env.ENDPOINT_SECRET
        );
    }

    async getCustomerInvoices({
        customerId
    }: {
        customerId: string;
    }) {
        try {
            const invoices = await this.stripeClient.invoices.list({
                customer: customerId
            });

            return invoices;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async getInvoice({
        invoiceId
    }: {
        invoiceId: string;
    }) {
        try {
            const invoice = await this.stripeClient.invoices.retrieve(invoiceId);

            return invoice;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async confirm(customerId: string, p: Stripe.PaymentIntent) {
        try {
            /** Get customer payment methods */
            const paymentMethods = await this.stripeClient.customers.listPaymentMethods(
                customerId,
                {
                    limit: 3,
                }
            );

            const pmid = paymentMethods.data[0].id;

            const paymentIntent = await this.stripeClient.paymentIntents.confirm(
                p.id,
                {
                    payment_method: pmid,
                }
            );

            return paymentIntent;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    /** Idempotent */
    async createSubscription({
        customerId,
        priceId,
        idempotencyKey,
        subscriptionId
    }: TStripeCreateSubscription) {
        try {
            // Create the subscription. Note we're expanding the Subscription's
            // latest invoice and that invoice's payment_intent
            // so we can pass it to the front end to confirm the payment
            const subscription = await this.stripeClient.subscriptions.create({
                customer: customerId,
                items: [{
                    price: priceId,
                }],
                payment_behavior: 'default_incomplete',
                payment_settings: {
                    payment_method_types: ['card'],
                    save_default_payment_method: 'on_subscription'
                },
                expand: ['latest_invoice.payment_intent'],
                metadata: {
                    subscriptionId
                },
            }, {
                idempotencyKey
            });

            return subscription;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async startSubscriptionWhenCharged({
        customerId,
        subscriptionId,
        priceId,
        iterations
    }: {
        customerId: string;
        subscriptionId: string;
        priceId: string;
        iterations: number;
    }) {
        try {
            const subscriptionSchedule = await this.stripeClient.subscriptionSchedules.create({
                from_subscription: subscriptionId,
                start_date: 'now',
                customer: customerId,
                end_behavior: 'cancel',
                phases: [{
                    items: [{
                        price: priceId
                    }],
                    iterations
                }]
            });

            return subscriptionSchedule;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async findCustomerByEmail(email: string) {
        try {

            const customersList = await this.stripeClient.customers.list({
                email: email
            });

            if (customersList.data.length === 0) {
                return null;
            }

            const customer = customersList.data.find((customer) => customer.email === email);
            if (customer === undefined) {
                return null;
            }

            return customer;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async createCustomerIfNotExists(email: string, metadata: { [key: string]: any; }) {
        try {
            const customers = await this.stripeClient.customers.list({
                email: email,
                limit: 1,
            });

            if (customers.data.length === 0) {
                const customer = await this.stripeClient.customers.create({
                    email: email,
                    metadata
                });

                return customer;
            }

            return customers.data[0];
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async getAllSubscriptions({
        userId
    }: {
        userId: string;
    }) {
        try {
            const subscriptions = await this.stripeClient.subscriptions.list({
                customer: userId
            });

            return subscriptions;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async cancelSubscription({
        subscriptionId
    }: {
        subscriptionId: string;
    }) {
        try {
            const subscriptions = await this.stripeClient.subscriptions.cancel(
                subscriptionId,
                {
                    invoice_now: true,
                    prorate: false
                }
            );

            return subscriptions;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async pauseSubscription({
        subscriptionId,
        customerId,
        productId
    }: {
        subscriptionId: string;
        customerId: string;
        productId: string;
    }) {
        try {
            const subscription = await this.stripeClient.subscriptions.retrieve(subscriptionId);

            const proration_date = Math.floor(Date.now() / 1000);

            const cancelledSubscription = await this.stripeClient.subscriptions.cancel(
                subscription.id,
                {
                    prorate: true,
                    invoice_now: true
                }
            );

            return cancelledSubscription;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async unpauseSubscription({
        subscriptionId,
        customerId
    }: {
        subscriptionId: string;
        customerId: string;
    }) {
        try {
            const subscription = await this.stripeClient.subscriptions.retrieve(subscriptionId);
            const proration_date = Math.floor(Date.now() / 1000);

            const s = await this.stripeClient.subscriptionSchedules.create({
                customer: 'cus_GBHHxuvBvO26Ea',
                start_date: 'now',
                end_behavior: 'release',
                phases: [
                    {
                        items: [
                            {
                                price: 'price_1GqNdGAJVYItwOKqEHb',
                                quantity: 1,
                            },
                        ],
                    },
                ],
            });

            return subscription;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    handleEvent(event: Stripe.Event) {
        console.log(event);
        switch (event.type) {
            case 'customer.created':
            case 'customer.deleted':
            case 'customer.updated': {
                this.broker.emit(CUSTOMER_EVENTS_PATTERN, event);
                break;
            }
            case "payment_method.attached":
            case "payment_intent.created":
            case "payment_intent.succeeded": {
                this.broker.emit(PAYMENT_EVENTS_PATTERN, event);
                break;
            }
            case "customer.subscription.updated":
            case "customer.subscription.created": {
                this.broker.emit(SUBSCRIPTION_EVENTS_PATTERN, event);
                break;
            }
            case "invoice.upcoming":
            case "invoice.updated":
            case "invoice.paid":
            case "invoice.payment_succeeded":
            case "invoice.finalized":
            case "invoice.created": {
                this.broker.emit(INVOICE_EVENTS_PATTERN, event);
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
}
