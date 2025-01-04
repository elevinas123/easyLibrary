import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SettingsService {
    constructor(private readonly prisma: PrismaService) {}

    // Get all settings
    async getAllSettings() {
        return this.prisma.settings.findMany();
    }

    // Get settings by ID
    async getSettingsById(id: string) {
        const settings = await this.prisma.settings.findUnique({
            where: { id },
        });
        if (!settings) {
            throw new NotFoundException(`Settings with ID ${id} not found`);
        }
        return settings;
    }

    // Get settings by User ID
    async getSettingsByUserId(userId: string) {
        const settings = await this.prisma.settings.findUnique({
            where: { userId },
        });
        if (!settings) {
            throw new NotFoundException(
                `Settings with user ID ${userId} not found`
            );
        }
        return settings;
    }

    // Create new settings
    async createSettings(data: Prisma.SettingsCreateInput) {
        return this.prisma.settings.create({ data });
    }

    // Update settings for a User
    async updateSettingsForUser(
        userId: string,
        data: Prisma.SettingsUpdateInput
    ) {
        const settings = await this.prisma.settings.update({
            where: { userId },
            data,
        });
        if (!settings) {
            throw new NotFoundException(
                `Settings with user ID ${userId} not found`
            );
        }
        return settings;
    }

    // Update settings by ID
    async updateSettings(id: string, data: Prisma.SettingsUpdateInput) {
        const settings = await this.prisma.settings.update({
            where: { id },
            data,
        });
        if (!settings) {
            throw new NotFoundException(`Settings with ID ${id} not found`);
        }
        return settings;
    }
}
