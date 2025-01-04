import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";

import { SettingsService } from "./settings.service";

@UseGuards(JwtAuthGuard)
@Controller("settings")
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @Get()
    async getAllSettings() {
        return this.settingsService.getAllSettings();
    }

    @Get("user/:userId")
    async getSettingsByUserId(@Param("userId") userId: string) {
        return this.settingsService.getSettingsByUserId(userId);
    }

    @Get(":id")
    async getSettingsById(@Param("id") id: string) {
        return this.settingsService.getSettingsById(id);
    }

    @Patch(":id")
    async updateSettings(
        @Param("id") id: string,
        @Body() data: Prisma.SettingsUpdateInput
    ) {
        return this.settingsService.updateSettings(id, data);
    }

    @Patch("user/:userId")
    async updateSettingsForUser(
        @Param("userId") userId: string,
        @Body() data: Prisma.SettingsUpdateInput
    ) {
        return this.settingsService.updateSettingsForUser(userId, data);
    }

    @Post()
    async createSettings(@Body() data: Prisma.SettingsCreateInput) {
        return this.settingsService.createSettings(data);
    }
}
