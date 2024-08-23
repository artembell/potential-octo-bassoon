import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from './invoice.repository';

@Injectable()
export class InvoiceService {

    constructor(
        private readonly invoiceRepo: InvoiceRepository
    ) { }

    handleInvoiceCreatedEvent(event: any) {

    }

    handleEvent(event: any) {
        switch (event.type) {
            case 'invoice.created': {
                this.handleInvoiceCreatedEvent(event);
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
