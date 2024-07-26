import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

interface ReceivingProjection {
  receptions: number;
  yards: number;
  tds: number;
}

@Injectable()
export class ReceProjectionService {
  constructor(private prisma: PrismaService) {}

  upsert(name: string, team: string, proj: ReceivingProjection) {
    return this.prisma.recievingProjection.upsert({
      where: { name_team: { name, team }},
      update: { ...proj },
      create: { name, team, ...proj },
    })
  }

  get(name: string, team: string) {
    return this.prisma.recievingProjection.findUnique({
      where: { name_team: { name, team }}
    });
  }
}
