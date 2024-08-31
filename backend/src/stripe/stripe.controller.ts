import {
    Body,
    Controller,
    Post,
    RawBodyRequest,
    Req,
    Res
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { Public } from 'src/decorators/public';

type TWebhookEvent = any;

@Controller('stripe')
export class StripeController {
    constructor(
        private readonly stripeService: StripeService
    ) { }

    /** Secure this endpoint from unwanted requests */
    @Public()
    @Post('webhook')
    receiveWebhooks(
        @Body() webhookEvent: TWebhookEvent,
        @Res() response: Response,
        @Req() request: RawBodyRequest<Request>
    ) {

        const sig = request.headers['stripe-signature'];

        let event;
        try {
            event = this.stripeService.constructEvent({
                signature: sig,
                payload: request.rawBody
            });
        } catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
        }

        this.stripeService.handleEvent(event);

        // Return a response to acknowledge receipt of the event
        response.json({ received: true });
    }
}
