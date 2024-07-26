import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "src/prisma/prisma.service";

interface Projection {
  id: number;
  position: string;
  points: number;
  multiplier?: number;
  value?: number;
}

@Injectable()
export class ValueService {
  private readonly logger = new Logger(ValueService.name);

  private readonly teams = 14;
  private readonly teamBudget = 300;

  private readonly startingQbs = 2 * this.teams;
  private readonly startingRbs = 2 * this.teams;
  private readonly startingWrs = 2 * this.teams;
  private readonly startingTes = 1 * this.teams;
  private readonly startingFlx = 1 * this.teams;
  private readonly startingKs = 1 * this.teams;
  private readonly startingDst = 1 * this.teams;
  private readonly benchSpots = 6 * this.teams;
  private readonly dollarPlayers = 42; // Conservative estimate, 46 last year

  private readonly playersToDraft = this.teams * 16;
  private readonly totalMoney = this.teams * this.teamBudget;

  constructor(private prisma: PrismaService) { }

  @OnEvent('projectedPoints.updated')
  //@Cron(CronExpression.EVERY_MINUTE)
  async handleProjectedPointsUpdated() {
    this.logger.debug('projectedPoints.updated event recieved');
    const projections = (await this.prisma.player.findMany({
      select: {
        id: true,
        position: {
          select: {
            code: true,
          }
        },
        projPoints: {
          select: {
            points: true,
          }
        }
      }
    })).map<Projection>((proj) => ({ id: proj.id, position: proj.position.code, points: proj.projPoints.points.toNumber() }))

    // Sort out players expected to be drafted
    const draftableQbs = projections
      .filter((p) => p.position === 'QB')
      .sort((a, b) => b.points - a.points)
      .slice(0, this.startingQbs);

    draftableQbs.forEach((qb, i) => {
      if (i < 7) {
        qb.multiplier = 1.7;
      } else if (i < 14) {
        qb.multiplier = 1.3;
      } else {
        qb.multiplier = 1.0;
      }
    });

    const draftableRbs = projections
      .filter((p) => p.position === 'RB')
      .sort((a, b) => b.points - a.points)
      .slice(0, this.startingRbs);

    draftableRbs.forEach((rb, i) => {
      if (i< 4) {
        rb.multiplier = 2.4
      } else if (i < 7) {
        rb.multiplier = 2.0;
      } else if (i < 14) {
        rb.multiplier = 1.4;
      } else {
        rb.multiplier = 1.0;
      }
    });

    const draftableWrs = projections
      .filter((p) => p.position === 'WR')
      .sort((a, b) => b.points - a.points)
      .slice(0, this.startingWrs);

    draftableWrs.forEach((wr, i) => {
      if (i < 4) {
        wr.multiplier = 2.4;
      } else if (i < 7) {
        wr.multiplier = 2.0;
      } else if (i < 14) {
        wr.multiplier = 1.6;
      } else {
        wr.multiplier = 1.2;
      }
    });

    const draftableTes = projections
      .filter((p) => p.position === 'TE')
      .sort((a, b) => b.points - a.points)
      .slice(0, this.startingTes);

    draftableTes.forEach((te, i) => {
      if (i < 3) {
        te.multiplier = 1.6;
      } else {
        te.multiplier = 1.0;
      }
    });

    const draftableFlx = projections
      .filter((p) => p.position === 'RB' || p.position === 'WR' || p.position === 'TE')
      .filter((p) => !draftableRbs.includes(p) && !draftableWrs.includes(p) && !draftableTes.includes(p))
      .sort((a, b) => b.points - a.points)
      .slice(0, this.startingFlx);

    draftableFlx.forEach((flx, i) => {
      if (i < 7) {
        flx.multiplier = 1.6;
      } else {
        flx.multiplier = 1.2;
      }
    });

    const draftableK = projections
      .filter((p) => p.position === 'K')
      .sort((a, b) => b.points - a.points)
      .slice(0, this.startingKs);

    const draftableDST = projections
      .filter((p) => p.position === 'DST')
      .sort((a, b) => b.points - a.points)
      .slice(0, this.startingDst);

    const draftableBench = projections
      .filter((p) => p.position !== 'K' && p.position !== 'DST')
      .filter((p) => !draftableQbs.includes(p) && !draftableRbs.includes(p) && !draftableWrs.includes(p) && !draftableTes.includes(p) && !draftableFlx.includes(p))
      .sort((a, b) => b.points - a.points)
      .slice(0, this.benchSpots);

    draftableBench.forEach((ben) => ben.multiplier = .4);

    // Sanity checks
    this.logger.debug('TYPEOF', typeof draftableQbs[1].points)
    this.logger.debug('Draftable QBs:', draftableQbs.length);
    this.logger.debug('Draftable RBs:', draftableRbs.length);
    this.logger.debug('Draftable WRs:', draftableWrs.length);
    this.logger.debug('Draftable TEs:', draftableTes.length);
    this.logger.debug('Draftable Flx:', draftableFlx.length);
    this.logger.debug('Draftable Bench:', draftableBench.length);

    // All K and DST should be $1
    draftableK.forEach((k) => k.value = 1);
    draftableDST.forEach((dst) => dst.value = 1);
    let dollarPlayersUsed = this.startingKs + this.startingDst

    if (this.dollarPlayers - dollarPlayersUsed <= this.benchSpots) {
      draftableBench
        .slice(this.benchSpots - (this.dollarPlayers - dollarPlayersUsed))
        .forEach((p) => p.value = 1);
    } else {
      this.logger.error('MORE DOLLAR PLAYERS THAN BENCH SPOTS!!! SOMETHING IS NOT RIGHT!!!!')
    }

    const draftableNonDollarPlayers = [...draftableQbs, ...draftableRbs, ...draftableWrs, ...draftableTes, ...draftableFlx, ...(draftableBench.filter((p) => !p.value))]
    const moneyRemaining = this.totalMoney - this.dollarPlayers;
    const pointsRemaining = draftableNonDollarPlayers.reduce((points, proj) => points + (proj.points * proj.multiplier), 0);
    this.logger.debug(`Money remaining: ${moneyRemaining} - Points Remaining: ${pointsRemaining}`);
    const costPerPoint = moneyRemaining / pointsRemaining;
    this.logger.debug(`Cost Per Point: ${costPerPoint}`);
    draftableNonDollarPlayers.forEach((player) => player.value = player.points * player.multiplier * costPerPoint);
    projections.forEach((proj) => {
      if (!proj.value) {
        proj.value = 0;
      }
    });
    
    await Promise.all(projections.map(async (proj) => {
      await this.prisma.value.upsert({
        where: { playerId: proj.id },
        create: { playerId: proj.id, value: proj.value },
        update: { value: proj.value },
      });
    }));

    const totalCost = projections.reduce((cost, { value }) => cost + value, 0);
    this.logger.debug('Total Value:', totalCost);
    this.logger.debug('finished updating values');
  }
}
