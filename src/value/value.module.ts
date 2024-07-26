import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ValueService } from "./value.service";

@Module({
  imports: [PrismaModule],
  providers: [ValueService],
  controllers: [],
})
export class ValueModule {}
