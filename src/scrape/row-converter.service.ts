import { Injectable } from "@nestjs/common";

@Injectable()
export class RowConverterService {
  convertQBRows(rows: HTMLTableRowElement[]) {
    return rows.map((row) => {
      const tds = row.querySelectorAll('td');
      return {
        name: tds[0].querySelector('a').textContent,
        team: tds[0].innerText.split(' ').pop(),
        position: 'QB',
        passProjections: {
          attempts: +tds[1].innerText,
          completions: +tds[2].innerText,
          yards: +tds[3].innerText.replace(',', ''),
          tds: +tds[4].innerText,
          ints: +tds[5].innerText,
        },
        rushProjections: {
          carries: +tds[6].innerText,
          yards: +tds[7].innerText.replace(',', ''),
          tds: +tds[8].innerText,
          fumbles: +tds[9].innerText,
        },
        receProjections: {
          receptions: 0,
          yards: 0,
          tds: 0,
        },
      }
    });
  }

  convertRBRows(rows: HTMLTableRowElement[]) {
    return rows.map((row) => {
      const tds = row.querySelectorAll('td');
      return {
        name: tds[0].querySelector('a').textContent,
        team: tds[0].innerText.split(' ').pop(),
        position: 'RB',
        passProjections: {
          attempts: 0,
          completions: 0,
          yards: 0,
          tds: 0,
          ints: 0,
        },
        rushProjections: {
          carries: +tds[1].innerText,
          yards: +tds[2].innerText.replace(',', ''),
          tds: +tds[3].innerText,
          fumbles: +tds[7].innerText,
        },
        receProjections: {
          receptions: +tds[4].innerText,
          yards: +tds[5].innerText.replace(',', ''),
          tds: +tds[6].innerText,
        },
      }
    });
  }

  convertWRRows(rows: HTMLTableRowElement[]) {
    return rows.map((row) => {
      const tds = row.querySelectorAll('td');
      return {
        name: tds[0].querySelector('a').textContent,
        team: tds[0].innerText.split(' ').pop(),
        position: 'WR',
        passProjections: {
          attempts: 0,
          completions: 0,
          yards: 0,
          tds: 0,
          ints: 0,
        },
        rushProjections: {
          carries: +tds[4].innerText,
          yards: +tds[5].innerText.replace(',', ''),
          tds: +tds[6].innerText,
          fumbles: +tds[7].innerText,
        },
        receProjections: {
          receptions: +tds[1].innerText,
          yards: +tds[2].innerText.replace(',', ''),
          tds: +tds[3].innerText,
        },
      }
    });
  }

  convertTERows(rows: HTMLTableRowElement[]) {
    return rows.map((row) => {
      const tds = row.querySelectorAll('td');
      return {
        name: tds[0].querySelector('a').textContent,
        team: tds[0].innerText.split(' ').pop(),
        position: 'TE',
        passProjections: {
          attempts: 0,
          completions: 0,
          yards: 0,
          tds: 0,
          ints: 0,
        },
        rushProjections: {
          carries: 0,
          yards: 0,
          tds: 0,
          fumbles: +tds[4].innerText,
        },
        receProjections: {
          receptions: +tds[1].innerText,
          yards: +tds[2].innerText.replace(',', ''),
          tds: +tds[3].innerText,
        },
      }
    });
  }

  convertKRows(rows: HTMLTableRowElement[]) {
    return rows.map((row) => {
      const tds = row.querySelectorAll('td');
      return {
        name: tds[0].querySelector('a').textContent,
        team: tds[0].innerText.split(' ').pop(),
        position: 'K',
        passProjections: {
          attempts: 0,
          completions: 0,
          yards: 0,
          tds: 0,
          ints: 0,
        },
        rushProjections: {
          carries: 0,
          yards: 0,
          tds: 0,
          fumbles: 0,
        },
        receProjections: {
          receptions: 0,
          yards: 0,
          tds: 0,
        },
        points: +tds[4].innerText
      }
    });
  }

  convertDSTRows(rows: HTMLTableRowElement[]) {
    return rows.map((row) => {
      const tds = row.querySelectorAll('td');
      const name = tds[0].querySelector('a').textContent;
      let team = '';
      switch (name) {
        case 'Dallas Cowboys':
          team = 'DAL';
          break;
        case 'Baltimore Ravens':
          team = 'BAL';
          break;
        case 'New York Jets':
          team = 'NYJ';
          break;
        case 'Philadelphia Eagles':
          team = 'PHI';
          break;
        case 'Houston Texans':
          team = 'HOU';
          break;
        case 'Cleveland Browns':
          team = 'CLE';
          break;
        case 'Indianapolis Colts':
          team = 'IND';
          break; 
        case 'Kansas City Chiefs':
          team = 'KC';
          break; 
        case 'San Francisco 49ers':
          team = 'SF';
          break; 
        case 'Pittsburgh Steelers':
          team = 'PIT';
          break; 
        case 'Buffalo Bills':
          team = 'BUF';
          break; 
        case 'Miami Dolphins':
          team = 'MIA';
          break; 
        case 'Cincinnati Bengals':
          team = 'CIN';
          break; 
        case 'Los Angeles Chargers':
          team = 'LAC';
          break; 
        case 'Washington Commanders':
          team = 'WAS';
          break; 
        case 'Green Bay Packers':
          team = 'GB';
          break; 
        case 'Jacksonville Jaguars':
          team = 'JAC';
          break; 
        case 'Seattle Seahawks':
          team = 'SEA';
          break; 
        case 'New York Giants':
          team = 'NYG';
          break; 
        case 'New Orleans Saints':
          team = 'NO';
          break; 
        case 'Tampa Bay Buccaneers':
          team = 'TB';
          break; 
        case 'Las Vegas Raiders':
          team = 'LV';
          break; 
        case 'Minnesota Vikings':
          team = 'MIN';
          break; 
        case 'Denver Broncos':
          team = 'DEN';
          break; 
        case 'Detroit Lions':
          team = 'DET';
          break; 
        case 'New England Patriots':
          team = 'NE';
          break; 
        case 'Chicago Bears':
          team = 'CHI';
          break; 
        case 'Atlanta Falcons':
          team = 'ATL';
          break; 
        case 'Los Angeles Rams':
          team = 'LAR';
          break; 
        case 'Tennessee Titans':
          team = 'TEN';
          break; 
        case 'Arizona Cardinals':
          team = 'ARI';
          break; 
        case 'Carolina Panthers':
          team = 'CAR';
          break; 
        default: 
          throw new Error(`Bad defense name: ${name}`);
      }
          return {
            name,
            team,
            position: 'DST',
            passProjections: {
              attempts: 0,
              completions: 0,
              yards: 0,
              tds: 0,
              ints: 0,
            },
            rushProjections: {
              carries: 0,
              yards: 0,
              tds: 0,
              fumbles: 0,
            },
            receProjections: {
              receptions: 0,
              yards: 0,
              tds: 0,
            },
            points: +tds[9].innerText
          }
      });
  }

}