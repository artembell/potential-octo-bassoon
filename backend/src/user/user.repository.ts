import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PersistenceService } from 'src/persistence/persistence.service';

export type TOptionalMetadata<T> = Omit<T, "metadata"> & { metadata?: any; };
export type TCreateUser = TOptionalMetadata<Prisma.UserUncheckedCreateInput>;

@Injectable()
export class UserRepository {
    constructor(
        private readonly persistenceService: PersistenceService
    ) { }

    async setMetadata(userId: number, metadata: any) {
        try {
            const user = await this.persistenceService.user.update({
                where: {
                    id: userId
                },
                data: {
                    metadata
                }
            });

            return user;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async findUserByEmail(email: string) {
        try {
            const price = await this.persistenceService.user.findUnique({
                where: {
                    email: email
                }
            });

            return price;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async findUserById(userId: number) {
        try {
            const price = await this.persistenceService.user.findUnique({
                where: {
                    id: userId
                }
            });

            return price;
        } catch (e: unknown) {
            console.error(e);
        }
    }
}
