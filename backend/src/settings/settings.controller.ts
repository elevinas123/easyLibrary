import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { Prisma, Settings } from "@prisma/client"; // Import Prisma-generated types

import { JwtAuthGuard } from "../auth/jwt-auth.guard";

import { SettingsService } from "./settings.service";

@UseGuards(JwtAuthGuard)
@Controller("settings")
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @Get()
    async getAllSettings(): Promise<Settings[]> {
        return this.settingsService.getAllSettings();
    }

    @Get("user/:userId")
    async getSettingsByUserId(
        @Param("userId") userId: string
    ): Promise<Settings> {
        return this.settingsService.getSettingsByUserId(userId);
    }

    @Get(":id")
    async getSettingsById(@Param("id") id: string): Promise<Settings> {
        return this.settingsService.getSettingsById(id);
    }

    @Patch(":id")
    async updateSettings(
        @Param("id") id: string,
        @Body() data: Prisma.SettingsUpdateInput
    ): Promise<Settings> {
        return this.settingsService.updateSettings(id, data);
    }

    @Patch("user/:userId")
    async updateSettingsForUser(
        @Param("userId") userId: string,
        @Body() data: Prisma.SettingsUpdateInput
    ): Promise<Settings> {
        return this.settingsService.updateSettingsForUser(userId, data);
    }

    @Post()
    async createSettings(
        @Body() data: Prisma.SettingsCreateInput
    ): Promise<Settings> {
        return this.settingsService.createSettings(data);
    }
}
