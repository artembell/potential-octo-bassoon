import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { INVOICE_EVENTS_PATTERN } from 'src/constants';
import Stripe from 'stripe';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
    constructor(
        private readonly invoiceService: InvoiceService
    ) { }

    @EventPattern(INVOICE_EVENTS_PATTERN)
    async listenUserEvents(@Payload() event: Stripe.Event) {

        this.invoiceService.handleEvent(event);
    }
}
