import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsString, ValidateNested } from "class-validator";

class ProcessedElementDto {
    @IsString() text: string;

    @IsString() lineX: number;

    @IsString() lineWidth: number;

    @IsString() lineY: number;
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
