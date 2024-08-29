import { Injectable } from '@nestjs/common';
import { PriceService } from 'src/price/price.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MigrationsService {
    constructor(
        private readonly userService: UserService,
        private readonly priceService: PriceService,
        private readonly subscriptionsService: SubscriptionService
    ) { }

    async migrate() {
        const email = "supertester@gmail.com";
        await this.userService.createUserIfNotExists(email);

        const product1 = await this.priceService.createProduct({
            title: '.NET courses'
        });
        const product2 = await this.priceService.createProduct({
            title: 'GO courses'
        });

        await this.priceService.createPrice({
            amount: 10,
            period: 'week',
            productId: product1.id,
            title: 'Weekly'
        });
        await this.priceService.createPrice({
            amount: 13,
            period: 'week',
            productId: product2.id,
            title: 'Weekly'
        });

        await this.priceService.createPrice({
            amount: 30,
            period: 'month',
            productId: product1.id,
            title: 'Monthly'
        });
        await this.priceService.createPrice({
            amount: 45,
            period: 'month',
            productId: product2.id,
            title: 'Monthly'
        });

        await this.priceService.createPrice({
            amount: 300,
            period: 'year',
            productId: product1.id,
            title: 'Yearly'
        });
        await this.priceService.createPrice({
            amount: 500,
            period: 'year',
            productId: product2.id,
            title: 'Yearly'
        });
    }

    async clear() {
        await this.priceService.removeAll()
        await this.userService.removeAll()
        await this.subscriptionsService.removeAll()
    }
}
