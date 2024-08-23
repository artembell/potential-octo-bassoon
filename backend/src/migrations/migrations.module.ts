import { Module } from '@nestjs/common';
import { PriceModule } from 'src/price/price.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { UserModule } from 'src/user/user.module';
import { MigrationsService } from './migrations.service';
import { MigrationsController } from './migrations.controller';

@Module({
    imports: [
        UserModule,
        PriceModule,
        SubscriptionModule
    ],
    providers: [MigrationsService],
    exports: [MigrationsService],
    controllers: [MigrationsController]
})
export class MigrationsModule { }
