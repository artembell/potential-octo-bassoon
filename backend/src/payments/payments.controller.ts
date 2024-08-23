import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { PAYMENT_EVENTS_PATTERN } from 'src/constants';

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService
    ) { }

    @EventPattern(PAYMENT_EVENTS_PATTERN)
    async listenUserEvents(@Payload() event: any) {
        this.paymentsService.handleEvent(event);
    }
}
