import { IsString, IsNotEmpty, IsIn, IsEnum } from "class-validator";
import { ModerationResult } from "../entities/moderation-log.entity";
import { KeywordSeverity } from "../entities/blocked-keyword.entity";

export class AddKeywordDto {
  @IsString()
  @IsNotEmpty()
  keyword: string;

  @IsString()
  @IsEnum(KeywordSeverity)
  severity: string;
}

export class ReviewActionDto {
  @IsEnum([ModerationResult.APPROVED, ModerationResult.BLOCKED])
  action: "approve" | "block";
}
