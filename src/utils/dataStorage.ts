// src/utils/dataStorage.ts

//import fs from 'react-native-fs'; // or the appropriate file system library for your environment

import { logger } from "react-native-logs";
import { supabase } from '~/src/lib/supabase'; // Adjust the import path as necessary

var log = logger.createLogger();

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