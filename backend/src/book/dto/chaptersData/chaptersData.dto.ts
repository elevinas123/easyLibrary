import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChaptersDataDto {
    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    href!: string;

    @IsNumber()
    indentLevel!: number | null;
}
