import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { InvoiceRepository } from './invoice.repository';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
    imports: [
        PersistenceModule,
        StripeModule
    ],
    providers: [InvoiceService, InvoiceRepository],
    controllers: [InvoiceController],
    exports: [InvoiceService]
})
export class InvoiceModule { }
