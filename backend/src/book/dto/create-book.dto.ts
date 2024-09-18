import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNumber, IsString, ValidateNested } from "class-validator";

class ProcessedElementDto {
    @IsString() text: string;

    @IsNumber() lineX: number;

    @IsNumber() lineWidth: number;

    @IsNumber() lineY: number;
}

export class CreateBookDto {
    @IsString() title: string;

    @IsString() description: string;

    @IsString() author: string;

    @IsArray() @IsString({ each: true }) genre: string[];

    @IsString() imageUrl: string;

    @IsBoolean() liked: boolean;

    @IsDate() @Type(() => Date) dateAdded: Date;

    @IsArray() @ValidateNested({ each: true }) @Type(() => ProcessedElementDto) bookElements: ProcessedElementDto[];
}
