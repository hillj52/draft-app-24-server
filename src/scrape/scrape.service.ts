import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import puppeteer from "puppeteer";
import { PuppeteerService } from "./puppeteer.service";
import { RowConverterService } from "./row-converter.service";
import { PlayerService } from "src/player/player.service";
import { PassProjectionService } from "src/projection/pass-projection.service";
import { RushProjectionService } from "src/projection/rush-projection.service";
import { ReceProjectionService } from "src/projection/rece-projection.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ProjectedPointsService } from "src/projection/projected-points.service";

@Injectable()
export class ScrapeService {
  private readonly logger = new Logger(ScrapeService.name);
  
  constructor(
    private puppeteerService: PuppeteerService,
    private rowConverterService: RowConverterService,
    private playerService: PlayerService,
    private passProjectionService: PassProjectionService,
    private rushProjectionService: RushProjectionService,
    private receProjectionService: ReceProjectionService,
    private projectedPointsService: ProjectedPointsService,
    private eventEmitter: EventEmitter2,
  ) {}

  //@Cron(CronExpression.EVERY_MINUTE)
  async scrapeAllProjections() {
    this.logger.debug('Begining Scrape routine!');
    await this.puppeteerService.openBrowser();
    await this.scrapeQBProjections();
    await this.scrapeRBProjections();
    await this.scrapeWRProjections();
    await this.scrapeTEProjections();
    await this.scrapeKProjections();
    await this.scrapeDSTProjections();
    await this.puppeteerService.closeBrowser();
    this.eventEmitter.emit('projections.updated');
    this.logger.debug('Finished Scraping!');
  }

  async scrapeQBProjections() {
    this.logger.debug('Scraping QB Projections');
    try {
      await this.puppeteerService.openPage(
        process.env.SCRAPE_URL + 'qb.php?week=draft',
        'QB',
      );
    } catch (err) {
      this.logger.error('Error creating page:', err);
    }
    const page = this.puppeteerService.getPage('QB');
    const projections = await page.$$eval(
      'table[id="data"] tbody tr',
      this.rowConverterService.convertQBRows,
    );
    await this.puppeteerService.closePage('QB');
    const test = await Promise.all(projections.map(async (proj) => new Promise(async (resolve, reject) => {
      try {
        const player = await this.playerService.upsertPlayer(proj.name, proj.team, proj.position);
        const passProj = await this.passProjectionService.upsert(player.name, player.team, proj.passProjections);
        const rushProj = await this.rushProjectionService.upsert(player.name, player.team, proj.rushProjections);
        const receProj = await this.receProjectionService.upsert(player.name, player.team, proj.receProjections);
        resolve({ player, passProj, rushProj, receProj });
      } catch (err) {
        this.logger.error('Error on:', proj.team);
      }
    })));
  }

  async scrapeRBProjections() {
    this.logger.debug('Scraping RB Projections');
    try {
      await this.puppeteerService.openPage(
        process.env.SCRAPE_URL + 'rb.php?week=draft',
        'RB',
      );
    } catch (err) {
      this.logger.error('Error creating page:', err);
    }
    const page = this.puppeteerService.getPage('RB');
    const projections = await page.$$eval(
      'table[id="data"] tbody tr',
      this.rowConverterService.convertRBRows,
    );
    await this.puppeteerService.closePage('RB');
    const test = await Promise.all(projections.map(async (proj) => new Promise(async (resolve, reject) => {
      const player = await this.playerService.upsertPlayer(proj.name, proj.team, proj.position);
      const passProj = await this.passProjectionService.upsert(player.name, player.team, proj.passProjections);
      const rushProj = await this.rushProjectionService.upsert(player.name, player.team, proj.rushProjections);
      const receProj = await this.receProjectionService.upsert(player.name, player.team, proj.receProjections);
      resolve({ player, passProj, rushProj, receProj });
    })));
  }

  async scrapeWRProjections() {
    this.logger.debug('Scraping WR Projections');
    try {
      await this.puppeteerService.openPage(
        process.env.SCRAPE_URL + 'wr.php?week=draft',
        'WR',
      );
    } catch (err) {
      this.logger.error('Error creating page:', err);
    }
    const page = this.puppeteerService.getPage('WR');
    const projections = await page.$$eval(
      'table[id="data"] tbody tr',
      this.rowConverterService.convertWRRows,
    );
    await this.puppeteerService.closePage('WR');
    const test = await Promise.all(projections.map(async (proj) => new Promise(async (resolve, reject) => {
      const player = await this.playerService.upsertPlayer(proj.name, proj.team, proj.position);
      const passProj = await this.passProjectionService.upsert(player.name, player.team, proj.passProjections);
      const rushProj = await this.rushProjectionService.upsert(player.name, player.team, proj.rushProjections);
      const receProj = await this.receProjectionService.upsert(player.name, player.team, proj.receProjections);
      resolve({ player, passProj, rushProj, receProj });
    })));
  }

  async scrapeTEProjections() {
    this.logger.debug('Scraping TE Projections');
    try {
      await this.puppeteerService.openPage(
        process.env.SCRAPE_URL + 'te.php?week=draft',
        'TE',
      );
    } catch (err) {
      this.logger.error('Error creating page:', err);
    }
    const page = this.puppeteerService.getPage('TE');
    const projections = await page.$$eval(
      'table[id="data"] tbody tr',
      this.rowConverterService.convertTERows,
    );
    await this.puppeteerService.closePage('TE');
    const test = await Promise.all(projections.map(async (proj) => new Promise(async (resolve, reject) => {
      const player = await this.playerService.upsertPlayer(proj.name, proj.team, proj.position);
      const passProj = await this.passProjectionService.upsert(player.name, player.team, proj.passProjections);
      const rushProj = await this.rushProjectionService.upsert(player.name, player.team, proj.rushProjections);
      const receProj = await this.receProjectionService.upsert(player.name, player.team, proj.receProjections);
      resolve({ player, passProj, rushProj, receProj });
    })));
  }

  async scrapeKProjections() {
    this.logger.debug('Scraping K Projections');
    try {
      await this.puppeteerService.openPage(
        process.env.SCRAPE_URL + 'k.php?week=draft',
        'K',
      );
    } catch (err) {
      this.logger.error('Error creating page:', err);
    }
    const page = this.puppeteerService.getPage('K');
    const projections = await page.$$eval(
      'table[id="data"] tbody tr',
      this.rowConverterService.convertKRows,
    );
    await this.puppeteerService.closePage('K');
    const test = await Promise.all(projections.map(async (proj) => new Promise(async (resolve, reject) => {
      const player = await this.playerService.upsertPlayer(proj.name, proj.team, proj.position);
      const passProj = await this.passProjectionService.upsert(player.name, player.team, proj.passProjections);
      const rushProj = await this.rushProjectionService.upsert(player.name, player.team, proj.rushProjections);
      const receProj = await this.receProjectionService.upsert(player.name, player.team, proj.receProjections);
      const projPoints = await this.projectedPointsService.createPointsProjection(player.id, proj.points);
      resolve({ player, passProj, rushProj, receProj });
    })));
  }

  async scrapeDSTProjections() {
    this.logger.debug('Scraping DST Projections');
    try {
      await this.puppeteerService.openPage(
        process.env.SCRAPE_URL + 'dst.php?week=draft',
        'DST',
      );
    } catch (err) {
      this.logger.error('Error creating page:', err);
    }
    const page = this.puppeteerService.getPage('DST');
    const projections = await page.$$eval(
      'table[id="data"] tbody tr',
      this.rowConverterService.convertDSTRows,
    );
    await this.puppeteerService.closePage('DST');
    const test = await Promise.all(projections.map(async (proj) => new Promise(async (resolve, reject) => {
      const player = await this.playerService.upsertPlayer(proj.name, proj.team, proj.position);
      const passProj = await this.passProjectionService.upsert(player.name, player.team, proj.passProjections);
      const rushProj = await this.rushProjectionService.upsert(player.name, player.team, proj.rushProjections);
      const receProj = await this.receProjectionService.upsert(player.name, player.team, proj.receProjections);
      const projPoints = await this.projectedPointsService.createPointsProjection(player.id, proj.points);
      resolve({ player, passProj, rushProj, receProj });
    })));
  }
}
