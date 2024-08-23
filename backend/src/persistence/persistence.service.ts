import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PersistenceService extends PrismaClient {
    constructor() {
        super();
    }
}