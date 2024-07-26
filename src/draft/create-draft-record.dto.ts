import { IsNumber, IsNumberString, IsString } from "class-validator";

export class CreateDraftRecordDTO {
  @IsNumberString() playerId: string;
  @IsNumberString() teamId: string;
  @IsNumber() price: number;
  @IsString() position: string;
}