import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WEBHOOK_QUEUE } from 'src/constants';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'WEBHOOK_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL],
                    queue: WEBHOOK_QUEUE,
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
    ],
    providers: [StripeService],
    controllers: [StripeController],
    exports: [StripeService]
})
export class StripeModule { }
