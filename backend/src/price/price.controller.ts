import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';
import { Cookies } from 'src/decorators/cookie';
import { prismaClient } from 'src/main';
import { TCreatePrice, TCreateProduct } from 'src/subscription/subscription.controller';
import Stripe from 'stripe';
import { PriceRepository } from './price.repository';
import { PriceService } from './price.service';
import { Public } from 'src/decorators/public';

@Controller()
export class PriceController {
    constructor(
        private readonly priceRepo: PriceRepository,
        private readonly priceService: PriceService
    ) { }

    @Public()
    @Get('/products/all')
    async getAllProduct() {
        const products = await prismaClient.product.findMany({
            include: {
                prices: true
            }
        });

        if (products === null) {
            throw new NotFoundException();
        }

        return {
            message: "Ok.",
            statusCode: HttpStatus.OK,
            data: products
        };
    }

    @Post('/product/create')
    async createProduct(
        @Body() createProduct: TCreateProduct
    ) {
        const { title } = createProduct;

        const product = await this.priceService.createProduct({
            title
        });

        return {
            message: "Ok.",
            statusCode: HttpStatus.OK,
            data: product
        };
    }


    @Public()
    @Get('/product/:id')
    async getProduct(
        @Param() params: any
    ) {
        const { id: productId } = params;

        const product = await prismaClient.product.findFirst({
            where: {
                id: parseFloat(productId)
            }
        });

        if (product === null) {
            throw new NotFoundException();
        }

        return {
            message: "Ok.",
            statusCode: HttpStatus.OK,
            data: product
        };
    }

    @Public()
    @Get('/prices/:productId')
    async getProductPrices(
        @Param() params: any,
        @Cookies('stripe-user-id') stripeUserId: string
    ) {
        const { productId } = params;

        const prices = await prismaClient.price.findMany({
            where: {
                productId: parseFloat(productId)
            }
        });

        if (prices === null) {
            throw new NotFoundException();
        }

        return {
            message: "Ok.",
            statusCode: HttpStatus.OK,
            data: prices
        };
    }


    @Public()
    @Get('/price/:id')
    async getPrice(
        @Param() params: any
    ) {
        const { id: priceId } = params;

        const price = await this.priceRepo.findPriceById(parseFloat(priceId));

        if (price === null) {
            throw new NotFoundException();
        }

        return {
            message: "Ok.",
            statusCode: HttpStatus.OK,
            data: price
        };
    }

    @Post('/price/create')
    async createPrice(
        @Body() createPrice: TCreatePrice
    ) {
        try {
            const { amount, period, productId, title } = createPrice;

            const price = await this.priceService.createPrice({
                amount,
                period,
                productId,
                title
            });

            return {
                statusCode: HttpStatus.OK,
                data: price
            };
        } catch (e: unknown) {
            console.error(e);
        }
    }
}
