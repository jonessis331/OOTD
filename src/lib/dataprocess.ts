// src/screens/DataProcess.ts

import { MergedTags, DetectedItem, OutfitMetadata } from "../utils/dataTypes";
import { saveOutfitData } from "../utils/dataStorage";

export const mergeTags = (openAITags: any, deepTags: any): MergedTags => {
  const mergedTags: MergedTags = {
    colors: [...new Set([...(openAITags.color || []), ...(deepTags.data.colors.map((color: any) => color.name) || [])])],
    material: openAITags.material || null,
    occasion: openAITags.occasion || [],
    brand_name: openAITags.brand_name || null,
    style: openAITags.style || null,
    pattern: openAITags.pattern || deepTags.data.labels.find((label: any) => label.classification === "textile pattern")?.name || null,
    fit: deepTags.data.labels.find((label: any) => label.classification === "silhouette")?.name || null,
    category: openAITags.category || deepTags.data.items[0]?.category || null,
  };

  return mergedTags;
};

export const createOutfitData = (openAITags: any, deepTags: any, outfitMetadata: OutfitMetadata) => {
  const mergedTags = mergeTags(openAITags, deepTags);

  const outfitData = {
    outfit_id: outfitMetadata.outfit_id,
    user_id: outfitMetadata.user_id,
    outfit_image_url: outfitMetadata.outfit_image_url,
    date_created: new Date().toISOString(),
    items: [
      {
        item_id: outfitMetadata.item_id,
        item_image_url: outfitMetadata.item_image_url,
        category: mergedTags.category,
        tags: mergedTags,
      },
    ],
    additional_info: {
      // Any additional info you want to include, e.g., average rating, customer reviews, etc.
    },
  };

  saveOutfitData(outfitData, `./outfit_data_${outfitMetadata.outfit_id}.json`);
  return outfitData;
};
