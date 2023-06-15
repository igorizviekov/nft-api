export enum CollectionCategory {
  ART = "Art",
  GAMES = "Games",
  COLLECTIBLES = "Collectibles",
  VIRTUAL_WORLDS = "Virtual Worlds",
  MUSIC = "Music",
  SPORTS = "Sports",
  PFPS = "PFPS",
}

export interface CollectionRoyalties {
  address: string;
  percentage: number;
}
