import { Module } from "@nestjs/common";
import { PuppeteerService } from "./puppeteer.service";
import { PlayerModule } from "src/player/player.module";
import { ScrapeService } from "./scrape.service";
import { RowConverterService } from "./row-converter.service";
import { ProjectionModule } from "src/projection/projection.module";

@Module({
  imports: [PlayerModule, ProjectionModule],
  controllers: [],
  providers: [PuppeteerService, ScrapeService, RowConverterService],
})
export class ScrapeModule {}
