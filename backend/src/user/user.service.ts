import { Injectable } from '@nestjs/common';
import { prismaClient } from 'src/main';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository
    ) { }

    async updateMetadata(userId: number, metadata: any) {
        try {
            const user = await this.userRepo.setMetadata(userId, metadata);
            return user;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async findUserByEmail(email: string) {
        try {
            const findUser = await this.userRepo.findUserByEmail(email);
            return findUser;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async findUserById(userId: number) {
        try {
            const findUser = await this.userRepo.findUserById(userId);
            return findUser;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async createUserIfNotExists(email: string) {
        try {
            const findUser = await this.findUserByEmail(email);
            if (findUser !== null) {
                return findUser;
            }

            const createUser = await prismaClient.user.create({
                data: {
                    email: email,
                    metadata: {}
                }
            });

            return createUser;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async handleEvent(event: any) {
        switch (event.type) {
            case 'customer.created': {
                const data = event.data.object;
                const userId = data.metadata['userId'];

                break;
            }
            case 'customer.deleted': {

                break;
            }
            default: {
                break;
            }
        }
    }

}
