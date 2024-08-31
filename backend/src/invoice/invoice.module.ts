import { Module, forwardRef } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { InvoiceRepository } from './invoice.repository';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
    imports: [
        PersistenceModule,
        StripeModule,
        // SubscriptionModule
        // forwardRef(() => SubscriptionModule)
    ],
    providers: [InvoiceService, InvoiceRepository],
    controllers: [InvoiceController],
    exports: [InvoiceService]
})
export class InvoiceModule { }
