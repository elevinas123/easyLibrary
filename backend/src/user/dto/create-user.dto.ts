import {IsArray, IsMongoId, IsNumber, IsString, Min} from 'class-validator';

export class CreateUserDto {
  @IsString() readonly username: string;

  @IsString() readonly password: string;

  @IsNumber() @Min(0) readonly age: number;

  @IsString() readonly comment: string;

  // Books array that must contain valid MongoDB ObjectId references
  @IsArray()
  @IsMongoId({each: true})
  // Validate each item in the array as a valid ObjectId
  readonly books: string[];  // Required, but can be an empty array

  // Bookshelves array that must contain valid MongoDB ObjectId references
  @IsArray()
  @IsMongoId({each: true})
  // Validate each item in the array as a valid ObjectId
  readonly bookshelves: string[];  // Required, but can be an empty array
}
