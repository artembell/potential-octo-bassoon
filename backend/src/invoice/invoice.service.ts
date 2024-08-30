import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from './invoice.repository';
import Stripe from 'stripe';
import { StripeService } from 'src/stripe/stripe.service';
import { InvoicePaidStatus } from '@prisma/client';

@Injectable()
export class InvoiceService {

    constructor(
        private readonly invoiceRepo: InvoiceRepository,
        private readonly stripeService: StripeService
    ) { }

    async getInvoicesOfSubscription({
        subId
    }: {
        subId: number;
    }) {
        try {
            const invoices = this.invoiceRepo.getInvoicesBySubscriptionId({
                subId
            });

            return invoices;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    /** Make idempotent */
    async createInvoice({
        stripeInvoiceId,
        stripeSubscriptionId,
        subId,
        createdDate,
        metadata,
        paidStatus,
        amount,
        link
    }: {
        stripeSubscriptionId: string;
        stripeInvoiceId: string;
        subId: number;
        createdDate: Date;
        paidStatus: InvoicePaidStatus;
        metadata: any;
        link: string;
        amount: number;

    }) {
        try {
            const invoice = await this.invoiceRepo.createInvoice({
                subscriptionId: subId,
                amount,
                link,
                createdDate,
                paidStatus,
                metadata: {
                    stripeInvoiceId
                }
            });

            const stripeInvoice = await this.stripeService.getInvoice({ invoiceId: stripeInvoiceId });

            return { stripeInvoice, invoice };
        } catch (e: unknown) {
            console.error(e);
        }
    }

    private async handleInvoiceCreatedEvent(event: Stripe.InvoiceCreatedEvent) {
        try {
            const data = event.data.object;

            const stripeInvoiceId = data.id;

            const lines = data.lines;
            const createdDate = new Date(data.created * 1000);
            const status = data.status;
            const amountDue = data.amount_due;
            const link = data.hosted_invoice_url

            /** We dont set `failed` status here */
            let invoiceStatus: InvoicePaidStatus;
            if (status === 'paid') {
                invoiceStatus = 'paid';
            } else if (status === 'open') {
                invoiceStatus = 'pending';
            }

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

            const stripeSubscriptionId = subscription.id;
            /** TODO: remove parsing here -> put number from start. */
            const subId = parseInt(subscription.metadata['subscriptionId']);

            /** TODO update stripe invoice metadata ??? */

            const { stripeInvoice, invoice } = await this.createInvoice({
                amount: amountDue,
                link,
                subId,
                stripeInvoiceId,
                stripeSubscriptionId,
                createdDate,
                paidStatus: invoiceStatus,
                metadata: {
                    stripeInvoiceId
                }
            });

            return null;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async handleEvent(event: Stripe.Event) {
        switch (event.type) {
            case 'invoice.created': {
                await this.handleInvoiceCreatedEvent(event);
                break;
            }
            case 'invoice.finalized': {
                const data = event.data.object;

                break;
            }
            default: {
                break;
            }
        }
    }

}
