import { Module } from '@nestjs/common';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { MigrationsModule } from 'src/migrations/migrations.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { PriceModule } from 'src/price/price.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { UserModule } from 'src/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        UserModule,
        SubscriptionModule,
        StripeModule,
        InvoiceModule,
        PaymentsModule,
        PriceModule,
        MigrationsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
