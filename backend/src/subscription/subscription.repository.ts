import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PersistenceService } from 'src/persistence/persistence.service';

type TOptionalMetadata<T> = Omit<T, "metadata"> & { metadata?: any; };
type TCreateSubscription = TOptionalMetadata<Prisma.SubscriptionUncheckedCreateInput>;
type TUpdateSubscription = TCreateSubscription;

@Injectable()
export class SubscriptionRepository {
    constructor(
        private readonly persistenceService: PersistenceService
    ) { }

    async removeAll() {
        try {
            await this.persistenceService.subscription.deleteMany();
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async findSubscriptionByPriceAndUser(priceId: number, userId: number) {
        try {
            const subscription = await this.persistenceService.subscription.findFirst({
                where: {
                    userId: userId,
                    priceId: priceId
                }
            });

            return subscription;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async createSubscriptionPart({
        endDate,
        startDate,
        subscriptionId
    }: {
        subscriptionId: number,
        endDate: Date | null;
        startDate: Date;
    }) {
        try {
            const subscription = await this.persistenceService.subscriptionPart.create({
                data: {
                    subscription: {
                        connect: {
                            id: subscriptionId
                        }
                    },
                    description: "",
                    metadata: {},
                    startDate: startDate,
                    endDate: endDate,
                }
            });

            return subscription;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async findSubscriptionById(subscriptionId: number) {
        try {
            const subscription = await this.persistenceService.subscription.findUnique({
                where: {
                    id: subscriptionId
                },
                include: {
                    subscriptionParts: true,
                    price: {
                        include: {
                            product: true
                        }
                    },
                    invoices: true,
                }
            });

            return subscription;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async createSubscription({
        metadata = {},
        priceId,
        userId,
    }: TCreateSubscription) {
        try {
            const subscription = await this.persistenceService.subscription.create({
                data: {
                    metadata,
                    price: {
                        connect: {
                            id: priceId
                        }
                    },
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                }
            });

            return subscription;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async getAllSubscriptions({
        userId
    }: {
        userId: number;
    }) {
        try {
            const subscriptions = await this.persistenceService.subscription.findMany({
                where: {
                    userId: userId
                },
                include: {
                    subscriptionParts: {
                        orderBy: {
                            startDate: 'desc'
                        },
                        take: 1
                    },
                    price: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            return subscriptions;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async updateSubscription({
        subscriptionId,
        metadata,
        status,

    }: TUpdateSubscription & { subscriptionId: number; }) {
        try {
            const subscription = await this.persistenceService.subscription.update({
                where: {
                    id: subscriptionId
                },
                data: {
                    metadata,
                    status
                },
                include: {
                    price: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            return subscription;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async changeSubscriptionEndDate({
        endDate,
        subscriptionId
    }: {
        subscriptionId: number;
        endDate: Date;
    }) {
        try {

            const subscription = await this.persistenceService.subscription.findUnique({
                where: {
                    id: subscriptionId
                },
                include: {
                    subscriptionParts: {
                        orderBy: {
                            startDate: 'desc'
                        },
                        take: 1
                    },
                    user: true
                }
            });

            const part = subscription.subscriptionParts[0];

            await this.persistenceService.subscriptionPart.update({
                where: {
                    id: part.id
                },
                data: {
                    endDate: endDate
                }
            });

            const updatedSubscription = await this.findSubscriptionById(subscriptionId);

            return updatedSubscription;
        } catch (e: unknown) {
            console.error(e);
        }
    }
}
