import { Expose } from "class-transformer";
import { PlayerDTO } from "src/player/player.dto";
import { TeamDTO } from "src/team/team.dto";

export class DraftPlayerDTO {
  @Expose() team: TeamDTO;
  @Expose() player: PlayerDTO;

  constructor(partial: Partial<DraftPlayerDTO>) {
    Object.assign(this, partial);
  }
}