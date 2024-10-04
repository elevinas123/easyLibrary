// src/books/dto/arrow-element.dto.ts

<<<<<<< HEAD
import { IsDefined, IsEnum, IsOptional, IsString } from "class-validator";
import { CurveElementSkeletonDto } from "../curveElementSkeleton.dto";
import { ArrowElement, StartType } from "src/book/schema/curveElements/elements/arrowElement.schema";

type ArrowElementType = ArrowElement;
=======
import {
    IsEnum,
    IsOptional,
    IsString
} from "class-validator";
import {
    ArrowElementType,
    StartType,
} from "src/book/schema/curveElements/elements/arrowElement.schema";
import { CurveElementSkeletonDto } from "../curveElementSkeleton.dto";

>>>>>>> MongooseBackend
export class ArrowElementDto
    extends CurveElementSkeletonDto
    implements ArrowElementType
{
<<<<<<< HEAD
    @IsString() @IsEnum(["arrow"]) type!: "arrow";
=======
    @IsString() @IsEnum(["arrow"]) type: "arrow";
>>>>>>> MongooseBackend

    @IsOptional() @IsString() startId!: string | null;

    @IsOptional() @IsString() endId!: string | null;

    @IsString() @IsEnum(['bookText', 'text', null]) startType!: StartType;

    @IsString() @IsEnum(['bookText', 'text', null]) endType!: StartType;
}
