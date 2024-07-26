import { Module } from "@nestjs/common";
import { PlayerService } from "./player.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { PlayerController } from "./player.controller";

@Module({
  imports: [PrismaModule],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
