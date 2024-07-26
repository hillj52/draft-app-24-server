import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PlayerService } from "src/player/player.service";
import { PlayerProjection } from "./player-projection.interface";
import { Prisma } from "@prisma/client";

@Injectable()
export class PlayerProjectionService {
  private logger = new Logger(PlayerProjectionService.name);

  constructor(
    private playerService: PlayerService,
  ) {}

  async getPlayerProjection(playerId: number): Promise<PlayerProjection> {
    const player = await this.playerService.getPlayerWithProjections(playerId);
    if (!player) {
      this.logger.error(`Player with id: ${playerId} not found`);
      throw new NotFoundException(`Player with id: ${playerId} not found`);
    }
    
    return this.toPlayerProjection(player);
  }

  async getPlayerProjections(): Promise<PlayerProjection[]> {
    const players = await this.playerService.getPlayersWithProjections();
    return players.map((player) => this.toPlayerProjection(player));
  }

  private toPlayerProjection(
    player: Prisma.PlayerGetPayload<
    { include: { position: true, passProj: true, rushProj: true, receProj: true }}
    >
  ): PlayerProjection {
    return {
      id: player.id,
      name: player.name,
      team: player.team,
      position: player.position.code,
      passing: {
        attempts: player.passProj.attempts.toNumber(),
        completions: player.passProj.completions.toNumber(),
        yards: player.passProj.yards.toNumber(),
        tds: player.passProj.tds.toNumber(),
        ints: player.passProj.ints.toNumber(),
      },
      rushing: {
        carries: player.rushProj.carries.toNumber(),
        yards: player.rushProj.yards.toNumber(),
        tds: player.rushProj.tds.toNumber(),
        fumbles: player.rushProj.fumbles.toNumber(),
      },
      receiving: {
        receptions: player.receProj.receptions.toNumber(),
        yards: player.receProj.yards.toNumber(),
        tds: player.receProj.tds.toNumber(),
      }
    }
  }
}
