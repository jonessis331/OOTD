// src/utils/dataStorage.ts

//import fs from 'fs';

export const saveOutfitData = (outfitData: any, filepath: string) => {
    console.log(JSON.stringify(outfitData, null, 2))
    //fs.writeFileSync(filepath, JSON.stringify(outfitData, null, 2), 'utf-8');
    console.log(`Outfit data saved to ${filepath}`);
    
};