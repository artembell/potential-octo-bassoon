import { Injectable } from '@nestjs/common';
import { PersistenceService } from 'src/persistence/persistence.service';

@Injectable()
export class ContentRepository {
    constructor(
        private readonly persistenceService: PersistenceService
    ) { }

    async grantAccess({
        contentId,
        userId,
        endDate
    }: {
        contentId: number;
        userId: number;
        endDate?: Date;
    }) {
        try {
            const result = await this.persistenceService.userOnContent.create({
                data: {
                    content: {
                        connect: {
                            id: contentId
                        }
                    },
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    endDate: !endDate ? null : endDate
                }
            });

            return result;
        } catch (e: unknown) {
            console.error(e);
        }
    }
    async removeAccess({
        contentId,
        userId
    }: {
        contentId: number;
        userId: number;
    }) {
        try {
            const result = await this.persistenceService.userOnContent.delete({
                where: {
                    contentId_userId: {
                        contentId,
                        userId
                    }
                }
            });

            return result;
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
            // const products = await this.persistenceService.product.findMany({
            //     where: {
            //         content: {
            //             users: {
            //                 some: {
            //                     user: {
            //                         id: userId
            //                     },
            //                 }
            //             }
            //         },
            //     },
            //     include: {
            //         content: true
            //     }
            // });

            const products = await this.persistenceService.userOnContent.findMany({
                where: {
                    user: {
                        id: userId
                    },
                    // OR: [
                    //     {
                    //         endDate: {
                    //             lte: new Date(),
                    //         },
                    //     },
                    //     {
                    //         endDate: {
                    //             equals: null
                    //         }
                    //     }
                    // ]
                },
                include: {
                    // select: {
                    content: {
                        select: {
                            product: {
                                include: {
                                    content: true
                                }
                            }
                        }
                    }
                }
            });

            // return products
            return products.filter(cnt => {
                if (cnt.endDate === null || cnt.endDate > new Date()) {
                    return true;
                }
                return false;
            }).map((cnt) => cnt.content.product);
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
