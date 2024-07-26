import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tableNames = ['ByeWeek', 'DraftRecord', 'PassingProjection', 'Player', 'Position', 'ProjectedPoints', 'RecievingProjection', 'RushingProjection', 'Team', 'Value'];

async function main() {
  for (const tableName of tableNames) await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);

  // Positions
  await prisma.position.createMany({
    data: [
      { code: 'QB', name: 'Quarterback' },
      { code: 'RB', name: 'Running Back' },
      { code: 'WR', name: 'Wide Reciver' },
      { code: 'TE', name: 'Tight End' },
      { code: 'K', name: 'Kicker' },
      { code: 'DST', name: 'Team Defense' },
    ],
  });

  // Teams
  await prisma.team.createMany({
    data: [
      { name: 'Kiss My A$$', owner: 'Chris Hill' },
      { name: 'Field of Dreams', owner: 'Blaine Wilson' },
      { name: 'Harrison Butker', owner: 'Tim Sykes' },
      { name: 'Ball So Hard University', owner: 'Mike Sykes' },
      { name: 'Week 1 And Done', owner: 'Bryan Tolle' },
      { name: 'The League is Named After Me', owner: 'Joe Hill' },
      { name: 'F You CMC', owner: 'Matt Moore' },
      { name: 'Hawk Tua', owner: 'Jerry Autry' },
      { name: 'Common Diggs', owner: 'John Frazier' },
      { name: 'Onward Christian Soldiers', owner: 'Chris Mohler' },
      { name: 'Bottom of The Barrel', owner: 'Rich Wilson' },
      { name: 'The Kummanders', owner: 'Rick George' },
      { name: 'Hungry Dogs', owner: 'Michael Polt' },
      { name: 'Main Vein', owner: 'John Main' },
    ],
  });

  // Bye Weeks
  await prisma.byeWeek.createMany({
    data: [
      { team: 'DET', week: 5 },
      { team: 'LAC', week: 5 },
      { team: 'PHI', week: 5 },
      { team: 'TEN', week: 5 },
      { team: 'KC', week: 6 },
      { team: 'LAR', week: 6 },
      { team: 'MIA', week: 6 },
      { team: 'MIN', week: 6 },
      { team: 'CHI', week: 7 },
      { team: 'DAL', week: 7 },
      { team: 'PIT', week: 9 },
      { team: 'SF', week: 9 },
      { team: 'CLE', week: 10 },
      { team: 'GB', week: 10 },
      { team: 'LV', week: 10 },
      { team: 'SEA', week: 10 },
      { team: 'ARI', week: 11 },
      { team: 'CAR', week: 11 },
      { team: 'NYG', week: 11 },
      { team: 'TB', week: 11 },
      { team: 'ATL', week: 12 },
      { team: 'BUF', week: 12 },
      { team: 'CIN', week: 12 },
      { team: 'JAC', week: 12 },
      { team: 'NO', week: 12 },
      { team: 'NYJ', week: 12 },
      { team: 'BAL', week: 14 },
      { team: 'DEN', week: 14 },
      { team: 'HOU', week: 14 },
      { team: 'IND', week: 14 },
      { team: 'NE', week: 14 },
      { team: 'WAS', week: 14 },
    ]
  });
}


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })