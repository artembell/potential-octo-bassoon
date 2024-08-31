import { Module } from '@nestjs/common';
import { PriceModule } from 'src/price/price.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { UserModule } from 'src/user/user.module';
import { MigrationsService } from './migrations.service';
import { MigrationsController } from './migrations.controller';
import { ContentModule } from 'src/content/content.module';

@Module({
    imports: [
        UserModule,
        PriceModule,
        SubscriptionModule,
        ContentModule
    ],
    providers: [MigrationsService],
    exports: [MigrationsService],
    controllers: [MigrationsController]
})
export class MigrationsModule { }
