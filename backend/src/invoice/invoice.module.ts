import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { InvoiceRepository } from './invoice.repository';
import { PersistenceModule } from 'src/persistence/persistence.module';

@Module({
    imports: [
        PersistenceModule
    ],
    providers: [InvoiceService, InvoiceRepository],
    controllers: [InvoiceController]
})
export class InvoiceModule { }
