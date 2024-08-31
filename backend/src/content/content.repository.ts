import { Injectable } from '@nestjs/common';
import { PersistenceService } from 'src/persistence/persistence.service';

@Injectable()
export class ContentRepository {
    constructor(
        private readonly persistenceService: PersistenceService
    ) { }

    async grantAccess({
        contentId,
        userId
    }: {
        contentId: number;
        userId: number;
    }) {
        try {
            const result = await this.persistenceService.userOnContent.create({
                data: {
                    contentId,
                    userId
                }
                // data: {
                //     users: {
                //         connect: [
                //             {
                //                 contentId_userId: {
                //                     contentId,
                //                     userId
                //                 }
                //             }
                //         ]
                //     }
                // }
            });

            return result;
        } catch (e: unknown) {
            console.error(e);
        }
    }
    async removeAccess({
        contendId,
        userId
    }: {
        contendId: number;
        userId: number;
    }) {
        try {
            // const result = await this.
        } catch (e: unknown) {
            console.error(e);
        }
    }

    /** Not idempotent */
    async createContentFor({
        productId,
        data
    }: {
        productId: number;
        data: string;
    }) {
        try {
            const content = this.persistenceService.content.create({
                data: {
                    product: {
                        connect: {
                            id: productId
                        }
                    },
                    data
                }
            });

            return content;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async getAvailableContentFor({
        userId
    }: {
        userId: number;
    }) {
        try {
            const content = await this.persistenceService.content.findMany({
                where: {
                    users: {
                        some: {
                            user: {
                                id: userId
                            }
                        }
                    }
                }
            });

            return content;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async removeAll() {
        try {
            await this.persistenceService.content.deleteMany();
        } catch (e: unknown) {
            console.error(e);
        }
    }
}
