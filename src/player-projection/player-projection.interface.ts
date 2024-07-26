
export interface PlayerProjection {
  id: number;
  name: string;
  team: string;
  position: string;
  passing: {
    attempts: number;
    completions: number;
    yards: number;
    tds: number;
    ints: number
  };
  rushing: {
    carries: number;
    yards: number;
    tds: number;
    fumbles: number;
  };
  receiving: {
    receptions: number;
    yards: number;
    tds: number;
  }
}