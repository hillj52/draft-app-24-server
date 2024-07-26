import { Module } from "@nestjs/common";
import { PlayerModule } from "src/player/player.module";
import { ProjectionModule } from "src/projection/projection.module";
import { PlayerProjectionService } from "./player-projection.service";

@Module({
  imports: [PlayerModule],
  controllers: [],
  providers: [PlayerProjectionService],
  exports: [PlayerProjectionService],
})
export class PlayerProjectionModule {}
