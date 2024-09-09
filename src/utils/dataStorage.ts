// src/utils/dataStorage.ts

//import fs from 'react-native-fs'; // or the appropriate file system library for your environment


import { log } from "~/src/utils/config";
import { supabase } from '~/src/lib/supabase'; // Adjust the import path as necessary


export const saveOutfitData = async (data: any) => {
    try {
        log.info(`Outfit data: ${JSON.stringify(data, null, 2)}`);
        
        // Insert outfit data into Supabase
        const { error } = await supabase
            .from('outfits') // Replace 'outfits' with your actual table name
            .insert([
                {
                    outfit_id: data.outfit_id,
                    user_id: data.user_id,
                    outfit_image_url: data.outfit_image_url,
                    outfit_image_public_id: data.outfit_image_public_id,
                    date_created: data.date_created,
                    items: data.items, // Ensure this is in the correct format for your database
                    additional_info: data.additional_info,
                },
            ]);

        if (error) {
            throw error;
        }

        log.info(`Outfit data saved to Supabase`);
    } catch (error) {
        log.error('Error saving outfit data:', error);
    }
};