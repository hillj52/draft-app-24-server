import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

interface PassProjection {
  attempts: number;
  completions: number;
  yards: number;
  tds: number;
  ints: number;
}

@Injectable()
export class PassProjectionService {
  constructor(private prisma: PrismaService) {}

  upsert(name: string, team: string, proj: PassProjection) {
    return this.prisma.passingProjection.upsert({
      where: { name_team: { name, team }},
      update: { ...proj },
      create: { name, team, ...proj },
    })
  }

  get(name: string, team: string) {
    return this.prisma.passingProjection.findUnique({
      where: { name_team: { name, team }}
    });
  }
}
