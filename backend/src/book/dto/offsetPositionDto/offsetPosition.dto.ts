import { IsNumber } from "class-validator";
import { Book } from "src/book/schema/book.schema";
import { OffsetPosition } from "src/book/schema/offsetPosition.schema";

// Extracting the OffsetPosition type directly from the Book schema
export type OffsetPositionType = OffsetPosition;

export class OffsetPositionDto implements OffsetPositionType {
    @IsNumber() x!: number;

    @IsNumber() y!: number;
}
