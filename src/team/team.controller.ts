import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { TeamService } from "./team.service";
import { CreateTeamDTO } from "./create-team.dto";

@Controller('teams')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getTeams() {
    return this.teamService.getTeams();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/createTeam')
  createTeam(@Body() { name, owner }: CreateTeamDTO) {
    return this.teamService.createTeam(owner, name);
  }
}
