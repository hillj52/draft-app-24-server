import { Prisma, RosterPosition } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";
import { PlayerDTO } from "src/player/player.dto";

export class TeamDTO {
  @Expose() id: string;
  @Expose() owner: string;
  @Expose() name: string;
  @Expose() money: number;
  @Expose({ name: 'qb' })
  getQB1() {
    return this.roster.get('QB');
  }

  @Expose({ name: 'rb1' })
  getRB1() {
    return this.roster.get('RB1');
  }

  @Expose({ name: 'rb2' })
  getRB2() {
    return this.roster.get('RB2');
  }

  @Expose({ name: 'wr1' })
  getWR1() {
    return this.roster.get('WR1');
  }

  @Expose({ name: 'wr2' })
  getWR2() {
    return this.roster.get('WR2');
  }

  @Expose({ name: 'flex' })
  getFLX() {
    return this.roster.get('FLEX');
  }

  @Expose({ name: 'op' })
  getOP() {
    return this.roster.get('OP');
  }

  @Expose({ name: 'te' })
  getTE() {
    return this.roster.get('TE');
  }

  @Expose({ name: 'bench' })
  getBEN1() {
    const bench: PlayerDTO[] = [];
    this.roster.forEach((player, rosterPos) => {
      if (rosterPos.includes('BEN')) {
        bench.push(player);
      }
    });
    return bench;
  }

  @Exclude() roster: Map<RosterPosition, PlayerDTO>;
  
  constructor(team: Prisma.TeamGetPayload<{
    include: { roster: { include: { player: { include: { position: true, value: true, projPoints: true } } } } },
  }>) {
    this.id = team.id.toString();
    this.owner = team.owner;
    this.name = team.name;
    this.money = team.budgetRemaining;
    this.roster = new Map();
    if (!!team.roster && team.roster.length > 0) {
      team.roster.forEach((draftRec) => {
        this.roster.set(draftRec.rosterPos, new PlayerDTO({
          id: draftRec.player.id.toString(),
          name: draftRec.player.name,
          team: draftRec.player.team,
          position: draftRec.player.position.code,
          price: draftRec.cost,
          value: draftRec.player.value.value.toNumber(),
          projPoints: draftRec.player.projPoints.points.toNumber(), 
          byeWeek: 0,
          drafted: true,
        }));
      });
    }
  }
}