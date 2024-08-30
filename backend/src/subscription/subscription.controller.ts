import {
    Body, Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Res
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PricePeriod } from '@prisma/client';
import { Response } from 'express';
import { APP_USER_ID_COOKIE, SUBSCRIPTION_EVENTS_PATTERN } from 'src/constants';
import { Cookies } from 'src/decorators/cookie';
import Stripe from 'stripe';
import { SubscriptionService } from './subscription.service';
import { StripeService } from 'src/stripe/stripe.service';

export type TCreatePrice = {
    productId: number;
    amount: number;
    period: PricePeriod;
    currency: string;
    title: string;
};

export type TCreateProduct = {
    title: string;
};

export type TSubscriptionControllerCreateSubscription = {
    priceId: number;
    idempotencyKey: string;
    cycles: number;
};

@Controller()
export class SubscriptionController {
    constructor(
        private readonly subsciptionService: SubscriptionService,
        private readonly stripeService: StripeService
    ) { }

    @Post('/create-subscription')
    async startSubscriptionProcess(
        @Body() body: TSubscriptionControllerCreateSubscription,
        @Res() response: Response,
        @Cookies(APP_USER_ID_COOKIE) userId: string
    ) {
        try {
            /** Validate input */
            const { priceId, cycles } = body;

            if (userId === undefined) {
                return response.status(HttpStatus.UNAUTHORIZED).send({
                    error: {
                        message: "Authorize first."
                    }
                });
            }

            const { stripeSubscriptionId, clientSecret } = await this.subsciptionService.subscribe({
                priceId,
                userId: parseInt(userId),
                cycles,
            });

            return response.send({
                subscriptionId: stripeSubscriptionId,
                clientSecret,
            });
        } catch (error) {
            return response.status(400).send({ error: { message: error.message } });
        }
    };

    @Get('/invoices')
    async getInvoices(
        @Cookies(APP_USER_ID_COOKIE) userId: string
    ) {
        try {
            const invoices = await this.subsciptionService.getCustomerInvoices({
                customerId: parseInt(userId)
            });

            return {
                data: invoices.data,
            };
        } catch (e: unknown) {
            console.error(e);
        }
    }

    @Get('/invoices/:subscriptionId')
    async getSubscriptionInvoices(
        @Param() params: any,
        @Cookies(APP_USER_ID_COOKIE) userId: string
    ) {
        try {
            const { subscriptionId } = params;
            const subId = parseInt(subscriptionId);

            const invoices = await this.subsciptionService.getSubscriptionWithInvoices({
                subId
            });

            return {
                data: invoices,
            };
        } catch (e: unknown) {
            console.error(e);
        }
    }

    @Get('/subscriptions')
    async getAllSubscriptions(
        @Res() response: Response,
        @Cookies(APP_USER_ID_COOKIE) userId: string
    ) {
        try {
            console.log(`User id from cookie '${APP_USER_ID_COOKIE}': ${userId}`);
            const { stripeSubs, subs } = await this.subsciptionService.getAllSubscriptions({
                userId: parseInt(userId)
            });

            console.log(`Return answer:`);
            console.log(JSON.stringify(subs, null, 4));

            // return {
            //     message: 'ok',
            //     data: stripeSubs.data,
            //     other: subs
            // };

            return response.status(200).send({
                message: 'ok',
                data: stripeSubs.data,
                other: subs
            });
        } catch (e: unknown) {
            return response.status(400).send({ error: { message: "Wrong." } });
        }
    }

    @Post('/subscription/cancel/:subscriptionId')
    async cancelSubscription(
        @Body() createSubscription: {
            priceId: string;
            cycles: string;
        },
        @Res() response: Response,
        @Param() params: any,
        @Cookies(APP_USER_ID_COOKIE) userId: string
    ) {
        try {
            const { subscriptionId } = params;
            const subId = parseInt(subscriptionId);

            const subscriptions = await this.subsciptionService.cancelSubscription({ subscriptionId: subId });

            const { stripeSubs, subs } = await this.subsciptionService.getAllSubscriptions({
                userId: parseInt(userId)
            });

            return response.status(200).send({
                message: 'ok',
                data: subs
            });
        } catch (e: unknown) {
            return response.status(400).send({ error: { message: "Wrong." } });
        }
    }

    @Post('/subscription/pause/:subscriptionId')
    async pauseSubscription(
        @Body() createSubscription: {
            priceId: string;
            cycles: string;
        },
        @Res() response: Response,
        @Param() params: any,
        @Cookies(APP_USER_ID_COOKIE) userId: string
    ) {
        try {
            const { subscriptionId } = params;
            const subscriptions = await this.subsciptionService.pauseSubscription({
                subscriptionId: parseInt(subscriptionId),
                customerId: parseInt(userId)
            });

            const { subs } = await this.subsciptionService.getAllSubscriptions({
                userId: parseInt(userId)
            });

            return response.status(200).send({
                message: 'ok',
                data: subs
            });
        } catch (e: unknown) {
            return response.status(400).send({ error: { message: "Wrong." } });
        }
    }

    @Post('/subscription/unpause/:subscriptionId')
    async unpauseSubscription(
        @Body() createSubscription: {
            priceId: string;
            cycles: string;
        },
        @Res() response: Response,
        @Param() params: any,
        @Cookies(APP_USER_ID_COOKIE) userId: string
    ) {
        try {
            const { subscriptionId } = params;

            const subscriptions = await this.subsciptionService.unpauseSubscription({
                subscriptionId: parseInt(subscriptionId),
                customerId: parseInt(userId)
            });

            const { subs } = await this.subsciptionService.getAllSubscriptions({
                userId: parseInt(userId)
            });

            return response.status(200).send({
                message: 'ok',
                data: subs
            });
        } catch (e: unknown) {
            return response.status(400).send({ error: { message: "Wrong." } });
        }
    }

    @EventPattern(SUBSCRIPTION_EVENTS_PATTERN)
    async listenUserEvents(@Payload() event: Stripe.Event) {
        this.subsciptionService.handleEvent(event);
    }
}
