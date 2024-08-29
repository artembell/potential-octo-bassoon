import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaClient } from 'src/main';
import { PersistenceService } from 'src/persistence/persistence.service';

/** Prisma types should be exported from Prisma module */


@Injectable()
export class PriceRepository {
    constructor(
        private readonly persistenceService: PersistenceService
    ) { }

    async removeAllProducts() {
        try {
            return await this.persistenceService.product.deleteMany();
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async removeAllPrices() {
        try {
            return await this.persistenceService.price.deleteMany();
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async findPriceById(priceId: number) {
        try {
            const price = await this.persistenceService.price.findUnique({
                where: {
                    id: priceId
                },
                include: {
                    product: true
                }
            });

            return price;
        } catch (e: unknown) {
            console.error(e);
        }
    }
}
