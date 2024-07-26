import { Module } from "@nestjs/common";
import { DraftService } from "./draft.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { DraftController } from "./draft.controller";
import { PlayerModule } from "src/player/player.module";
import { TeamModule } from "src/team/team.module";

@Module({
  providers: [DraftService],
  imports: [PrismaModule, PlayerModule, TeamModule],
  controllers: [DraftController],
})
export class DraftModule {}
