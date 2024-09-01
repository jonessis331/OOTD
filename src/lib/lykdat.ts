
import { log } from "~/src/utils/config";

export const searchImage = async (imageUrl: string) => {
    log.info("Entering searchImage function"); // Log added
    const formdata = new FormData();
    formdata.append("api_key", "REMOVED_LYKDAT_KEY");
    formdata.append("image_url", imageUrl);
  
    const requestOptions = {
      method: 'POST',
      body: formdata,
    };
  
    try {
      const response = await fetch("https://cloudapi.lykdat.com/v1/global/search", requestOptions);
      const result = await response.json();
      return result;
    } catch (error) {
      //console.error('Error:', error);
      throw error;
    } finally {
      log.info("leaving SearchImage")
    }
  };

  export const detectItems = async (imageUrl: string) => {
    log.info("Entering detectItems function"); // Log added
    const myHeaders = new Headers();
    myHeaders.append("x-api-key", "REMOVED_LYKDAT_KEY");

    const formdata = new FormData();
    formdata.append("image_url", imageUrl);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
    };

    try {
        const response = await fetch("https://cloudapi.lykdat.com/v1/detection/items", requestOptions);
        const result = await response.json();
        ////console.log("result:", result);
        return result;
    } catch (error) {
        //console.error('Error:', error);
        throw error;
    } finally {
      log.info("Leaving DetectItems ")
    }
};

export const getDeepTags = async (imageUrl: string) => {
  log.info("Entering getDeepTags function"); // Log added
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "REMOVED_LYKDAT_KEY");

  const formdata = new FormData();
  formdata.append("image_url", imageUrl);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
  };

  try {
    const response = await fetch('https://cloudapi.lykdat.com/v1/detection/tags', requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    //console.error('Error:', error);
    throw error;
  }
  finally {
    log.info("Leaving Get Deep Tags")
  }
};