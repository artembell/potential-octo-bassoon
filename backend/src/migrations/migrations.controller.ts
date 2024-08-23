import { Controller, Post } from '@nestjs/common';
import { MigrationsService } from './migrations.service';

@Controller('migrations')
export class MigrationsController {
    constructor(
        private readonly migrationsService: MigrationsService
    ) { }

    @Post('/init')
    async initMigrations() {
        await this.migrationsService.migrate();
        return {};
    }

    @Post('/reset')
    async resetMigrations() {
        await this.migrationsService.clear();
        return {};
    }
}
