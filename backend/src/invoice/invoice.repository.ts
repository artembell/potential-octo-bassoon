import { Injectable } from '@nestjs/common';
import { InvoicePaidStatus } from '@prisma/client';
import { link } from 'fs';
import { PersistenceService } from 'src/persistence/persistence.service';

@Injectable()
export class InvoiceRepository {
    constructor(
        private readonly persistenceService: PersistenceService
    ) { }

    async getInvoicesBySubscriptionId({
        subId
    }: {
        subId: number;
    }) {
        try {
            const invoices = this.persistenceService.invoice.findMany({
                where: {
                    subscription: {
                        id: subId
                    }
                }
            });

            return invoices;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async createInvoice({
        metadata,
        subscriptionId,
        createdDate,
        paidStatus,
        amount,
        link
    }: {
        createdDate: Date;
        subscriptionId: number;
        metadata: any;
        paidStatus: InvoicePaidStatus;
        amount: number;
        link: string;
    }) {
        try {
            const invoice = await this.persistenceService.invoice.create({
                data: {
                    amount,
                    invoicePdf: link,
                    createdDate,
                    paidStatus,
                    subscription: {
                        connect: {
                            id: subscriptionId
                        }
                    },
                    metadata
                }
            });

            return invoice;
        } catch (e: unknown) {
            console.error(e);
        }
    }
}
