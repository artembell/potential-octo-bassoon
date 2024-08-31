import { Controller, Get, HttpStatus, NotFoundException } from '@nestjs/common';
import { APP_USER_ID_COOKIE } from 'src/constants';
import { Cookies } from 'src/decorators/cookie';
import { PriceRepository } from 'src/price/price.repository';
import { ContentService } from './content.service';

@Controller()
export class ContentController {
    constructor(
        private readonly contentService: ContentService
    ) { }

    @Get('/products/my')
    async getAllProduct(
        @Cookies(APP_USER_ID_COOKIE) _userId: string
    ) {
        try {
            const userId = parseInt(_userId);
            const availableContent = await this.contentService.getAvailableContentFor({
                userId
            });

            return {
                message: "Ok.",
                statusCode: HttpStatus.OK,
                data: availableContent
            };
        } catch (e: unknown) {
            console.error(e);
        }

    }
}
