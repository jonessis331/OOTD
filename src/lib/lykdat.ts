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