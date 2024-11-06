export type ProductCategory = 'Football' | 'Flag Football' | 'Basketball';
export type ProductType = 'Jersey' | 'Pants' | 'Shorts' | 'Jersey + Pants';
export type JerseyModel = 'Flex' | 'Hybrid' | 'Speed' | 'Velocity';
export type PantsModel = 'Flex' | 'Hybrid' | 'Speed' | 'Velocity';

export interface SizeGroup {
  id: string;
  playerName?: string;
  sizes: {
    S: number;
    M: number;
    L: number;
    XL: number;
    XXL: number;
  };
}

export interface OrderState {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  customer?: {
    fullName: string;
    email: string;
  };
  step: number;
  category?: ProductCategory;
  productType?: ProductType;
  model?: JerseyModel | PantsModel;
  frontImage?: string;
  backImage?: string;
  details: Detail[];
  exports: ExportRecord[];
  sizeGroups: SizeGroup[];
}

export interface Detail {
  id: string;
  type: 'Graphic' | 'Number' | 'Description';
  position: { x: number; y: number };
  value: string;
  view: 'front' | 'back';
  dimensions?: { width: number; height: number };
}

export interface TrelloConfig {
  apiKey: string;
  token: string;
  boardId: string;
  listId: string;
}

export interface TrelloList {
  id: string;
  name: string;
}

export interface TrelloExportMetadata {
  cardId: string;
  cardUrl: string;
  boardName: string;
  listId: string;
  listName: string;
}

export interface ExportRecord {
  id: string;
  type: 'trello';
  timestamp: string;
  metadata: TrelloExportMetadata;
}