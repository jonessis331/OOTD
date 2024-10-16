// src/utils/dataTypes.ts

export type BoundingBox = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

export type SimilarItem = {
  link: string;
  source: string;
  title: string;
  thumbnail: string;
};

export type DetectedItem = {
  area: number;
  bounding_box: BoundingBox;
  category: string;
  detection_confidence: number;
  name: string;
  similarItems?: SimilarItem[];
  cropUrl?: string;
  tags?: any;
  googleItem?: any; // Add googleItem to DetectedItem type
};

export type OutfitMetadata = {
  outfit_id: string;
  user_id: string;
  outfit_image_url: string;
  outfit_image_public_id?: string;
  item_id?: string;
  item_image_url?: string;
};

export type MergedTags = {
  colors: string[];
  material: string | null;
  occasion: string[];
  brand_name: string | null;
  style: string | null;
  pattern: string | null;
  fit: string | null;
  category: string | null;
  openTagsOne: string[]; // Add this line
  openTagsTwo: string[]; // Add this line
  scraped_tags: string[]; // Add this line
  otherTags: string[]; // Add this line
};

export type Outfit = {
  id: string;
  user_id: string;
  outfit_image_url: string;
  outfit_image_public_id: string;
  date_created: string;
  items: Item[];
  is_public: boolean;
};
export type ImageUrl = string;

export type Item = {
  item_id: string;
  item_image_url: string;
  googleItem?: SimilarItem;
  tags?: any;
  bounding_box: any;
};

export const synonymGroups: { [key: string]: string[] } = {
  top: ["top", "shirt", "blouse", "t-shirt", "tee"],
  bottom: ["bottom", "pants", "trousers", "jeans", "shorts"],
  jacket: ["jacket", "coat", "blazer", "outerwear"],
  dress: ["dress", "gown"],
  skirt: ["skirt"],
  shoe: [
    "shoe",
    "sneaker",
    "boot",
    "heel",
    "sandal",
    "high heel",
    "low heel",
    "flat",
    "platform",
    "sneakers",
    "boots",
    "heels",
    "sandal",
    "high heels",
    "low heels",
    "flats",
    "platforms",
    "footwear",
  ],
  accessory: ["accessory", "hat", "scarf", "glove", "belt", "watch", "jewelry"],
  // Add more synonym groups as needed
};

export const normalizeItemName = (name: string): string => {
  for (const [key, synonyms] of Object.entries(synonymGroups)) {
    if (synonyms.includes(name.toLowerCase())) {
      return key;
    }
  }
  return name.toLowerCase();
};
