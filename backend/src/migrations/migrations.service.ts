import { Injectable } from '@nestjs/common';
import { ContentService } from 'src/content/content.service';
import { PriceService } from 'src/price/price.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MigrationsService {
    constructor(
        private readonly userService: UserService,
        private readonly priceService: PriceService,
        private readonly subscriptionsService: SubscriptionService,
        private readonly contentService: ContentService
    ) { }

    async migrate() {
        const product1 = await this.priceService.createProduct({
            title: '.NET courses'
        });
        const product2 = await this.priceService.createProduct({
            title: 'GO courses'
        });
        const product3 = await this.priceService.createProduct({
            title: 'JavaScript courses'
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
            amount: 18,
            period: 'week',
            productId: product3.id,
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
            amount: 60,
            period: 'month',
            productId: product3.id,
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
        await this.priceService.createPrice({
            amount: 800,
            period: 'year',
            productId: product3.id,
            title: 'Yearly'
        });

        await this.contentService.createContent({
            productId: product1.id,
            content: "Exclusive content - GO courses (watch now)"
        });
        await this.contentService.createContent({
            productId: product2.id,
            content: "Exclusive content - .NET courses (watch now)"
        });
        await this.contentService.createContent({
            productId: product3.id,
            content: "Exclusive content - JavaScript courses (watch now)"
        });
    }

    async clear() {
        await this.priceService.removeAll();
        await this.subscriptionsService.removeAll();
        await this.userService.removeAll();
        await this.contentService.removeAll();
    }
}
