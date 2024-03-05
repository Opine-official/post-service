export interface BlockData {
  text?: string;
  level?: number;
  type?: string;
  items?: string[];
}

export interface Block {
  id: string;
  type: string;
  data: BlockData;
}

export interface Content {
  time: number;
  blocks: Block[];
}
