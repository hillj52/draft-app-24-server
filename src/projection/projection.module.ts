import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { PassProjectionService } from "./pass-projection.service";
import { RushProjectionService } from "./rush-projection.service";
import { ReceProjectionService } from "./rece-projection.service";
import { ProjectedPointsService } from "./projected-points.service";
import { PlayerProjectionModule } from "src/player-projection/player-projection.module";

@Module({
  imports: [PrismaModule, PlayerProjectionModule],
  exports: [PassProjectionService, RushProjectionService, ReceProjectionService, ProjectedPointsService],
  providers: [PassProjectionService, RushProjectionService, ReceProjectionService, ProjectedPointsService],
})
export class ProjectionModule {}
