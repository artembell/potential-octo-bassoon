import { Module } from '@nestjs/common';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
    imports: [
        PersistenceModule,
        StripeModule
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService]
})
export class UserModule { }
