import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ScrapeModule } from './scrape/scrape.module';
import { PlayerModule } from './player/player.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectionModule } from './projection/projection.module';
import { PlayerProjectionModule } from './player-projection/player-projection.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ValueModule } from './value/value.module';
import { DraftModule } from './draft/draft.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    PrismaModule,
    ScrapeModule,
    PlayerModule,
    ProjectionModule,
    PlayerProjectionModule,
    ValueModule,
    DraftModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
