import { Injectable, Logger } from "@nestjs/common";
import { RosterPosition } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { PlayerService } from "src/player/player.service";
import { TeamService } from "src/team/team.service";
import { DraftPlayerDTO } from "./draft-player.dto";

interface DraftPlayerProps {
  playerId: number,
  teamId: number,
  cost: number,
  position: string,
}

interface UndraftPlayerProps {
  playerId: number,
  teamId: number,
  position: string,
}

@Injectable()
export class DraftService {
  private readonly logger = new Logger(DraftService.name);

  private readonly rosterPosMap = new Map<string, RosterPosition>();

  constructor(
    private prisma: PrismaService,
    private playerService: PlayerService,
    private teamService: TeamService,
  ) {
    this.rosterPosMap.set('qb', 'QB');
    this.rosterPosMap.set('rb1', 'RB1');
    this.rosterPosMap.set('rb2', 'RB2');
    this.rosterPosMap.set('wr1', 'WR1');
    this.rosterPosMap.set('wr2', 'WR2');
    this.rosterPosMap.set('te', 'TE');
    this.rosterPosMap.set('flex', 'FLEX');
    this.rosterPosMap.set('op', 'OP');
    this.rosterPosMap.set('k', 'K');
    this.rosterPosMap.set('dst', 'DST');
    this.rosterPosMap.set('bench', 'BEN1');
  }

  async draftPlayer({ playerId, teamId, cost, position }: DraftPlayerProps) {
    let rosterPos = this.rosterPosMap.get(position);
    if (rosterPos === 'BEN1') {
      const bench = await this.prisma.draftRecord.findMany({
        where: { teamId, rosterPos: { in: ['BEN1', 'BEN2', 'BEN3', 'BEN4', 'BEN5', 'BEN6'] }}
      });
      if (!bench || bench.length === 0) {
        rosterPos = 'BEN1';
      } else if (bench.length === 1) {
        rosterPos = 'BEN2';
      } else if (bench.length === 2) {
        rosterPos = 'BEN3';
      } else if (bench.length === 3) {
        rosterPos = 'BEN4';
      } else if (bench.length === 4) {
        rosterPos = 'BEN5';
      } else if (bench.length === 5) {
        rosterPos = 'BEN6';
      } else if (bench.length === 6) {
        throw new Error('Bench is full!');
      }
    }
    await this.prisma.$transaction(async (tx) => {
      const { budgetRemaining } = await tx.team.findUnique({ where: { id: teamId }, select: { budgetRemaining: true } });
      if (budgetRemaining < cost) {
        throw new Error('Team does not have enough money!');
      }
      const draftRecord = await tx.draftRecord.create({ data: { teamId, playerId, cost, rosterPos } })
      const team = await tx.team.update({ where: { id: teamId }, data: { budgetRemaining: budgetRemaining - cost }, include: { roster: true } });
      return;
    });

    const team = await this.teamService.getTeam(teamId);
    const player = await this.playerService.getPlayerDto(playerId);
    return new DraftPlayerDTO({ team, player });   
  }

  async undraftPlayer({ playerId, teamId }: UndraftPlayerProps) {
    await this.prisma.$transaction(async (tx) => {
      const { cost } = await tx.draftRecord.findUnique({ where: { teamId, playerId } });
      const { budgetRemaining } = await tx.team.findUnique({ where: { id: teamId }, select: { budgetRemaining: true } });
      const deletedRecord = await tx.draftRecord.delete({ where: { teamId, playerId }});
      const team = await tx.team.update({ where: { id: teamId }, data: { budgetRemaining: budgetRemaining + cost }, include: { roster: true } });
      return;
    });

    const team = await this.teamService.getTeam(teamId);
    const player = await this.playerService.getPlayerDto(playerId);
    return new DraftPlayerDTO({ team, player }); 
  }
}