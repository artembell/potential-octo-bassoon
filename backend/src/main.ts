import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { WEBHOOK_QUEUE } from './constants';
import { AuthGuard } from './user/auth.guard';

export const prismaClient = new PrismaClient();

async function bootstrap() {
    console.log('Bootstrap');
    const app = await NestFactory.create(AppModule, {
        rawBody: true
    });

    const consumerMircoservice = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URL],
            queue: WEBHOOK_QUEUE,
            queueOptions: { durable: false },
        },
    });

    await app.startAllMicroservices();

    app.setGlobalPrefix('api');
    app.use(cookieParser());

    /** Start HTTP-server */
    await app.listen(3000);
}
bootstrap();