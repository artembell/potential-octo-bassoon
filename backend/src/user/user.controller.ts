import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { APP_USER_ID_COOKIE, CUSTOMER_EVENTS_PATTERN } from 'src/constants';
import { StripeService } from 'src/stripe/stripe.service';
import { UserService } from './user.service';
import { Public } from 'src/decorators/public';

type TCreateUserInfo = {
    email: string;
};

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly stripeService: StripeService
    ) { }

    @EventPattern(CUSTOMER_EVENTS_PATTERN)
    async listenUserEvents(@Payload() event: any) {
        this.userService.handleEvent(event);
    }

    @Post('logout')
    async logout(
        @Res() response: Response,
    ) {
        response.clearCookie(APP_USER_ID_COOKIE);
        return response.send({
            message: "Ok.",
            statusCode: HttpStatus.OK
        });
    }

    @Public()
    @Post('authenticate')
    async authenticate(
        @Body() details: TCreateUserInfo,
        @Res() response: Response,
    ) {
        try {
            const { email } = details;

            if (email === '' || email === undefined || email === null) {
                throw new Error('Bad email');
            }

            console.log(`- register`);
            const userSaved = await this.userService.createUserIfNotExists(email);
            const userStripe =
                await this.stripeService.createCustomerIfNotExists(email, { userId: userSaved.id });
            await this.userService.updateMetadata(userSaved.id, { stripeId: userStripe.id });

            response.cookie(APP_USER_ID_COOKIE, userSaved.id, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            });

            response.cookie('stripe-user-id', userStripe.id, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            });

            return response.send({
                statusCode: HttpStatus.OK,
                message: 'Successfully authenticated.'
            });
        } catch (e: unknown) {
            console.error(JSON.stringify(e));
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: JSON.stringify(e)
            };
        }
    }
}