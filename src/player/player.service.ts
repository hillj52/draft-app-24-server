import { Injectable, Logger } from "@nestjs/common";
import { Player, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { PlayerDTO } from "./player.dto";

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);

  constructor(private prisma: PrismaService) {}

  async getPlayersWithValues(): Promise<PlayerDTO[]> {
    const players = await this.prisma.player.findMany({
      select: {
        id: true,
        name: true,
        team: true,
        position: {
          select: {
            code: true,
          }
        },
        value: {
          select: {
            value: true,
          }
        },
        projPoints: {
          select: {
            points: true,
          }
        },
        drafted: {
          select: {
            teamId: true,
            cost: true,
          }
        },
        bye: {
          select: {
            week: true,
          }
        }
      },
      orderBy: {
        projPoints: {
          points: 'desc',
        }
      }
    });
    return players.map<PlayerDTO>((player) => new PlayerDTO({
      id: player.id.toString(),
      name: player.name,
      team: player.team,
      position: player.position.code,
      price: !!player.drafted ? player.drafted.cost : null,
      value: player.value.value.toNumber(),
      byeWeek: player.bye.week,
      projPoints: player.projPoints.points.toNumber(),
      drafted: !!player.drafted,
    }))
  }

  async getPlayerDto(playerId: number): Promise<PlayerDTO> {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      include: { position: true, drafted: true, value: true, projPoints: true, bye: true },
    });
    return new PlayerDTO({
      id: player.id.toString(),
      name: player.name,
      team: player.team,
      position: player.position.code,
      price: !!player.drafted ? player.drafted.cost : null,
      value: player.value.value.toNumber(),
      byeWeek: player.bye.week,
      projPoints: player.projPoints.points.toNumber(),
      drafted: !!player.drafted,
    });
  }

  getPlayer(name: string, team: string) {
    return this.prisma.player.findUnique({ where: { name_team: { name, team } }, include: { position: true } })
  }

  getPlayerById(id: number) {
    return this.prisma.player.findUnique({ where: { id }, include: { position: true }});
  }

  getPlayerWithProjections(id: number) {
    return this.prisma.player.findUnique({
      where: { 
        id, 
        OR: [
          { positionId: { equals: 1 } }, 
          { positionId: { equals: 2 } },
          { positionId: { equals: 3 } },
          { positionId: { equals: 4 } } 
        ] 
      },
      include: {
        position: true,
        passProj: true,
        rushProj: true,
        receProj: true,
      }
    });
  }

  getPlayersWithProjections() {
    return this.prisma.player.findMany({
      include: {
        position: true,
        passProj: true,
        rushProj: true,
        receProj: true,
      }
    })
  }

  async upsertPlayer(name: string, team: string, position: string) {
    const pos = await this.prisma.position.findFirst({ where: { code: position }});
    return this.prisma.player.upsert({
      where: { name_team: { name, team }},
      update: { name, team, positionId: pos.id },
      create: { name, team, positionId: pos.id },
    })
  }

  async insertPlayer(name: string, team: string, position: string) {
    const pos = await this.prisma.position.findFirst({ where: { code: position }});
    if (!pos) {
      this.logger.error('Invalid position code:', position);
      throw new Error(`Invalid position code ${position}`);
    }
    const playerExists = await this.getPlayer(name, team);
    if (playerExists) {
      this.logger.debug('Attempted to insert existing player:', playerExists);
      return playerExists;
    }
    return this.prisma.player.create({ data: { name, team, positionId: pos.id }, include: { position: true } })
  }
}
