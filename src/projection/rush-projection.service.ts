import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

interface RushProjection {
  carries: number;
  yards: number;
  tds: number;
  fumbles: number;
}

@Injectable()
export class RushProjectionService {
  constructor(private prisma: PrismaService) {}

  upsert(name: string, team: string, proj: RushProjection) {
    return this.prisma.rushingProjection.upsert({
      where: { name_team: { name, team }},
      update: { ...proj },
      create: { name, team, ...proj },
    })
  }

  get(name: string, team: string) {
    return this.prisma.rushingProjection.findUnique({
      where: { name_team: { name, team }}
    });
  }
}
