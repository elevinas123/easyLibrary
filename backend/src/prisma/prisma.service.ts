import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    constructor() {
        super(); // Call PrismaClient constructor
    }

    async onModuleInit() {
        await this.$connect(); // Connect to the database
    }

    async onModuleDestroy() {
        await this.$disconnect(); // Disconnect from the database
    }
}
