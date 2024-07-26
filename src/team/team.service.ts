import { Injectable } from "@nestjs/common";
import { PlayerService } from "src/player/player.service";
import { PrismaService } from "src/prisma/prisma.service";
import { TeamDTO } from "./team.dto";

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async createTeam(owner: string, name: string): Promise<TeamDTO> {
    const team = await this.prisma.team.create({
      data: { owner, name },
      include: { roster: { include: { player: { include: { position: true, value: true, projPoints: true } } } } },
    });
    return new TeamDTO(team);
  }

  async getTeams(): Promise<TeamDTO[]> {
    const teams = await this.prisma.team.findMany({
      include: { roster: { include: { player: { include: { position: true, value: true, projPoints: true } } } } },
    });
    return teams.map((team) => new TeamDTO(team));
  }

  async getTeam(teamId: number): Promise<TeamDTO> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { roster: { include: { player: { include: { position: true, value: true, projPoints: true } } } } },
    });
    return new TeamDTO(team);
  }
}
