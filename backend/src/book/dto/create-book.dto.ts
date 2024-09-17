import { IsOptional, IsString } from "class-validator";

export class CreateBookDto {

    @IsString()
    private readonly title: string;
    
    @IsString()
    private readonly description: string;

    @IsString()
    @IsOptional()
    private readonly author: string;

    @IsString()
    @IsOptional()
    private readonly genre: string[];

}
