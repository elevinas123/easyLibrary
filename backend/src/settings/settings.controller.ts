// src/settings/settings.controller.ts
import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";


import { CreateSettingsDto, UpdateSettingsDto } from "./settings.dto";
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
        @Body() updateSettingsDto: UpdateSettingsDto
    ) {
        return this.settingsService.updateSettings(id, updateSettingsDto);
    }
    @Patch("user/:userId")
    async updateSettingsForUser(
        @Param("userId") userId: string,
        @Body() updateSettingsDto: UpdateSettingsDto
    ) {
        return this.settingsService.updateSettingsForUser(
            userId,
            updateSettingsDto
        );
    }

    @Post()
    async createSettings(@Body() createSettingsDto: CreateSettingsDto) {
        return this.settingsService.createSettings(createSettingsDto);
    }
}
