import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { SubscriptionRepository } from './subscription.repository';
import { PriceModule } from 'src/price/price.module';
import { UserModule } from 'src/user/user.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { InvoiceModule } from 'src/invoice/invoice.module';

@Module({
    imports: [
        UserModule,
        PriceModule,
        PersistenceModule,
        StripeModule,
        InvoiceModule
    ],
    controllers: [SubscriptionController],
    providers: [SubscriptionService, SubscriptionRepository],
    exports: [SubscriptionService]
})
export class SubscriptionModule { }
