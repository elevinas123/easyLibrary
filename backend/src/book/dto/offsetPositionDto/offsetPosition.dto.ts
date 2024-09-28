import { IsNumber } from "class-validator";
import { Book } from "src/book/schema/book.schema";

// Extracting the OffsetPosition type directly from the Book schema
export type OffsetPosition = Book["offsetPosition"];

export class OffsetPositionDto implements OffsetPosition {
    @IsNumber() x!: number;

    @IsNumber() y!: number;
}
