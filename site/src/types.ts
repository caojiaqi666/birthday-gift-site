export interface LongDistanceInfo {
  herName: string;
  hisName: string;
  herCity: string;
  hisCity: string;
  distanceKm: number;
  age: number;
  yearsTogether: number;
}

export type ExperienceStage = 
  | 'welcome'
  | 'sevenDays'
  | 'balloons'
  | 'memories'
  | 'photoReel'
  | 'letter'
  | 'cake'
  | 'giftbox'
  | 'starry';
