import { Injectable } from '@nestjs/common';
import { PersistenceService } from 'src/persistence/persistence.service';

@Injectable()
export class InvoiceRepository {
    constructor(
        private readonly persistenceService: PersistenceService
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
