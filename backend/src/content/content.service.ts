import { Injectable } from '@nestjs/common';
import { ContentRepository } from './content.repository';

@Injectable()
export class ContentService {
    constructor(
        private readonly contentRepo: ContentRepository,
    ) { }


    async grantAccess({
        contentId,
        userId
    }: {
        contentId: number;
        userId: number;
    }) {
        try {
            const result = await this.contentRepo.grantAccess({
                contentId,
                userId
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

    async createContent({
        content,
        productId
    }: {
        productId: number;
        content: string;
    }) {
        try {
            const createdContent = await this.contentRepo.createContentFor({
                data: content,
                productId
            });

            return createdContent;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async removeAll() {
        try {
            const createdContent = await this.contentRepo.removeAll();
            return createdContent;
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
            const availableContent = await this.contentRepo.getAvailableContentFor({
                userId
            });

            return availableContent;
        } catch (e: unknown) {
            console.error(e);
        }
    }
}
