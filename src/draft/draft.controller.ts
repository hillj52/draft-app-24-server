import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from "@nestjs/common";
import { DraftService } from "./draft.service";
import { DraftPlayerDTO } from "./draft-player.dto";
import { CreateDraftRecordDTO } from "./create-draft-record.dto";
import { DeleteDraftRecordDTO } from "./delete-draft-record.dto";

@Controller('draft')
export class DraftController {
  constructor(private draftService: DraftService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  draftPlayer(@Body() { teamId, playerId, price, position }: CreateDraftRecordDTO): Promise<DraftPlayerDTO> {
    return this.draftService.draftPlayer({
      teamId: +teamId,
      playerId: +playerId,
      cost: price,
      position,
    }); 
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/undraft')
  undraftPlayer(@Body() { teamId, playerId, position }: DeleteDraftRecordDTO) {
    return this.draftService.undraftPlayer({
      teamId: +teamId,
      playerId: +playerId,
      position,
    })
  }
}