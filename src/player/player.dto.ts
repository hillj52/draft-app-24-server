
export class PlayerDTO {
  id: string;
  name: string;
  team: string;
  position: string;
  price?: number;
  value: number;
  byeWeek: number;
  projPoints: number;
  drafted: boolean;

  constructor(partial: Partial<PlayerDTO>) {
    Object.assign(this, partial);
  }
}