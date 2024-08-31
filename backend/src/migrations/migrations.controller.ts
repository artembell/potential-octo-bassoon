import { Controller, Post } from '@nestjs/common';
import { MigrationsService } from './migrations.service';
import { Public } from 'src/decorators/public';

@Controller('migrations')
export class MigrationsController {
    constructor(
        private readonly migrationsService: MigrationsService
    ) { }

    @Public()
    @Post('/init')
    async initMigrations() {
        await this.migrationsService.migrate();
        return {};
    }

    @Public()
    @Post('/reset')
    async resetMigrations() {
        await this.migrationsService.clear();
        return {};
    }
}
