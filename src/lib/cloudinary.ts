import { Cloudinary } from "@cloudinary/url-gen";
import { upload } from "cloudinary-react-native";
import { UploadApiResponse } from "cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params";

// Create and configure your Cloudinary instance.
export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
});

export const uploadImage = async (file: string) => {
  const options = {
    upload_preset: "default",
    unsigned: true,
   // access_mode: "authenticated", // Set access mode to authenticated
  };
  return new Promise<UploadApiResponse>(async (resolve, reject) => {
    await upload(cld, {
      file: file,
      options: options,
      callback: (error, response) => {
        if (error || !response) {
          reject(error);
        } else {
          resolve(response);
        }
      },
    });
  });
};

export const makeImagePublic = async (publicId: string) => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/image/upload/${publicId}`;
  const formdata = new FormData();
  formdata.append("access_mode", "public");

  const requestOptions = {
    method: 'POST',
    body: formdata,
    headers: {
      Authorization: `Basic ${btoa(process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY + ':' + process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET)}`,
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};