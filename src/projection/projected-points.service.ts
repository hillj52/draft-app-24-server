import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { PlayerProjectionService } from "src/player-projection/player-projection.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProjectedPointsService {
  private readonly logger = new Logger(ProjectedPointsService.name);

  private td = 6;
  private ppr = 1;
  private passYards = 20;
  private rushRecYards = 10;
  private turnover = -2;

  constructor(
    private prisma: PrismaService,
    private playerProjectionService: PlayerProjectionService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('projections.updated')
  async handleProjectionsUpdated() {
    this.logger.debug('projections.updated event recieved');
    const playerProjections = await this.playerProjectionService.getPlayerProjections();
    await Promise.all(playerProjections
      .filter(({ position }) => position === 'QB' || position === 'RB' || position === 'WR' || position === 'TE')
      .map(async (playerProj) => {
        const { passing, rushing, receiving } = playerProj;
        const passingPoints = (passing.yards / this.passYards) + (passing.tds * this.td) + (passing.ints * this.turnover);
        const rushingPoints = (rushing.yards / this.rushRecYards) + (rushing.tds * this.td) + (rushing.fumbles * this.turnover);
        const recievingPoints = (receiving.receptions * this.ppr) + (receiving.yards / this.rushRecYards);
        const points = passingPoints + rushingPoints + recievingPoints;

        await this.prisma.projectedPoints.upsert({
          where: { playerId: playerProj.id },
          create: { points, playerId: playerProj.id },
          update: { points },
        });
      }));
    this.logger.debug('Projected Points update finished');
    this.eventEmitter.emit('projectedPoints.updated');
  }

  createPointsProjection(playerId: number, points: number) {
    return this.prisma.projectedPoints.create({ data: { playerId, points } });
  }
}