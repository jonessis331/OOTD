export const searchImage = async (imageUrl: string) => {
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
      console.error('Error:', error);
      throw error;
    }
  };

  export const detectItems = async (imageUrl: string) => {
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
        //console.log("result:", result);
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getDeepTags = async (imageUrl: string) => {
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
    console.error('Error:', error);
    throw error;
  }
};