import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentRepository } from './content.repository';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { PriceModule } from 'src/price/price.module';

@Module({
    imports: [
        PersistenceModule
    ],
    controllers: [ContentController],
    providers: [ContentService, ContentRepository],
    exports: [ContentService]
})
export class ContentModule { }
