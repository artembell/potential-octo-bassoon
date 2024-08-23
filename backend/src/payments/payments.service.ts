import { Injectable } from '@nestjs/common';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class PaymentsService {
    constructor(
        private readonly stripeService: StripeService
    ) {}

    handlePaymentSucceeded() {
        /** Make this schedule on payment succeeed! */
        
    }

    handleEvent(event: any) {
        switch (event.type) {
            case 'payment_intent.created': {
                const data = event.data.object;

                break;
            }
            case 'payment_intent.succeeded': {
                break
            }
            default: {
                break;
            }
        }
    }
}
