import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsString } from "class-validator";

export class CreateBookDto {
    @IsString() title: string;

    @IsString() description: string;

    @IsString() author: string;

    @IsArray() @IsString({ each: true }) genre: string[];

    @IsString() imageUrl: string;

    @IsBoolean() liked: boolean;

    @IsDate() @Type(() => Date) dateAdded: Date;
}
