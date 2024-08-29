import { Injectable } from '@nestjs/common';
import { PriceRepository } from './price.repository';
import { prismaClient } from 'src/main';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class PriceService {
    constructor(
        private readonly priceRepo: PriceRepository,
        private readonly stripeService: StripeService
    ) { }

    async removeAll() {
        try {
            await this.priceRepo.removeAllPrices()
            return await this.priceRepo.removeAllProducts()
        } catch (e: unknown) {
            console.error(e)
        }
    }

    async findPriceById(priceId: number) {
        try {
            const price = await this.priceRepo.findPriceById(priceId);
            return price;
        } catch (e) {
            console.error(e);
        }
    }

    async createPrice({
        amount,
        period,
        productId,
        title
    }: {
        amount: number;
        period: string;
        productId: number;
        title: string;
    }) {
        try {
            /** Create locally, and exchange with both id - from Stripe and our DB */
            const price = await prismaClient.price.create({
                data: {
                    amount: amount * 100,
                    currency: 'usd',
                    period: period as any,
                    title,
                    productId: productId,
                    metadata: {}
                },
                include: {
                    product: true
                }
            });

            const stripePrice = await this.stripeService.createPrice({
                productId: price.product.metadata['stripeId'],
                amount: price.amount,
                period: price.period,
                priceId: price.id
            });

            const udpatedPrice = await prismaClient.price.update({
                where: {
                    id: price.id
                },
                data: {
                    metadata: {
                        stripeId: stripePrice.id
                    }
                }
            });

            return udpatedPrice;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async createProduct({
        title
    }: {
        title: string;
    }) {
        try {
            const product = await prismaClient.product.create({
                data: {
                    title,
                    metadata: {}
                }
            });

            const stripeProduct = await this.stripeService.createProduct({
                productId: product.id,
                title
            });

            const updatedProduct = await prismaClient.product.update({
                where: {
                    id: product.id
                },
                data: {
                    metadata: {
                        stripeId: stripeProduct.id
                    }
                }
            });

            return updatedProduct;
        } catch (e: unknown) {
            console.error(e);
        }
    }
}
