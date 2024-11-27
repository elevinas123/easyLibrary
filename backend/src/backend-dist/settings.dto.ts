import { PartialType } from "@nestjs/mapped-types";
// src/settings/create-settings.dto.ts
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

import { SettingsType } from "./settings.schema";


export class CreateSettingsDto implements Omit<SettingsType, "_id" | "userId"> {
    @IsString() userId!: string;

    @IsOptional() @IsNumber() fontSize!: number;

    @IsOptional() @IsString() fontFamily!: string;

    @IsOptional() @IsNumber() lineHeight!: number;

    @IsOptional() @IsString() backgroundColor!: string;

    @IsOptional() @IsString() textColor!: string;

    @IsOptional() @IsBoolean() darkMode!: boolean;
}
// Omit _id and make the rest of the fields optional
export class UpdateSettingsDto extends PartialType(CreateSettingsDto) {
    @IsOptional() @IsNumber() fontSize?: number;

    @IsOptional() @IsString() fontFamily?: string;

    @IsOptional() @IsNumber() lineHeight?: number;

    @IsOptional() @IsString() backgroundColor?: string;

    @IsOptional() @IsString() textColor?: string;

    @IsOptional() @IsBoolean() darkMode?: boolean;
}
