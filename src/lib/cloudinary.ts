import { Cloudinary } from "@cloudinary/url-gen";
import axios from "axios";
import { upload } from "cloudinary-react-native";
import { UploadApiResponse } from "cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params";
//import { removeBackground } from 'services/api';
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
    method: "POST",
    body: formdata,
    headers: {
      Authorization: `Basic ${btoa(
        process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY +
          ":" +
          process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET
      )}`,
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.warn("Error:", error);
    throw error;
  }
};

export const uploadNoBackground = async (fileUrl: string) => {
  const options = {
    upload_preset: "default",
    unsigned: true,
    //transformation: [{ effect: "remove_background" }],
  };

  return new Promise<UploadApiResponse>(async (resolve, reject) => {
    await upload(cld, {
      file: fileUrl,
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

const API_BASE_URL = "http://localhost:8000"; // Update with your backend URL

export const removeBackground = async (imageUrl: string): Promise<string> => {
  try {
    console.log("here");
    const response = await axios.post(`${API_BASE_URL}/remove-background`, {
      image_url: imageUrl,
    });

    const blob = response.data;
    const base64Image = response.data.image_data;
    //console.log(base64Image);
    const responseCloud = await uploadImage(
      `data:image/png;base64,${base64Image}`
    );

    console.log(responseCloud);
    return responseCloud.url;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};
