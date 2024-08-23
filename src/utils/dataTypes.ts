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
    similarItems?: SimilarItem[]; // Adding similarItems to DetectedItem
    cropUrl?: string;
    tags?: any; // Tags from deep tagger or OpenAI
  };
  
  export type ImageUrl = string;
  
  export type MergedTags = {
    colors: string[];
    material: string | null;
    occasion: string[];
    brand_name: string | null;
    style: string | null;
    pattern: string | null;
    fit: string | null;
    category: string | null;
  };
  
  export type OutfitMetadata = {
    outfit_id: string;
    user_id: string;
    outfit_image_url: string;
    item_id: string;
    item_image_url: string;
  };
  