import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from "@nestjs/common";
import { PlayerService } from "./player.service";
import { PlayerDTO } from "./player.dto";

@Controller('players')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getPlayers(): Promise<PlayerDTO[]> {
    return await this.playerService.getPlayersWithValues();
  }
}
