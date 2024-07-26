import { IsNumberString, IsString } from "class-validator";

export class DeleteDraftRecordDTO {
  @IsNumberString() playerId: string;
  @IsNumberString() teamId: string;
  @IsString() position: string;
}