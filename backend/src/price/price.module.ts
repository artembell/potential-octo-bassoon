import { Module } from '@nestjs/common';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import { PriceRepository } from './price.repository';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
    imports: [
        PersistenceModule,
        StripeModule
    ],
    controllers: [PriceController],
    providers: [PriceService, PriceRepository],
    exports: [PriceService]
})
export class PriceModule { }
