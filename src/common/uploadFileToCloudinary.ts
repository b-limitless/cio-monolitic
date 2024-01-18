import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { promisify } from "util";
const writeFileAsync = promisify(fs.writeFile);
import logger from "@pasal/common/build/logger";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/**
 * Uploads a file to Cloudinary for the specified user.
 *
 * @async
 * @param {string} userId - The ID of the user for whom the file is being uploaded.
 * @param {Express.Request["file"] | Express.Request["file"]} file - The file to be uploaded to Cloudinary.
 * @returns {Promise<{ originalImageUrl: string, thumbnailImageUrl: string, filePath:string }>} An object containing the URLs of the original and thumbnail images.
 * @throws {Error} If there is an error during the upload process.
 */
const fileExtensionsPattern = /\.(jpg|jpeg|png|svg)$/i;

export async function uploadFileToCloudinary(
  userId: string,
  file: Express.Request["file"] | Express.Request["file"]
) {
  try {
    const allowedTypes = ["image/jpeg", "image/png", , "image/webp"]; // Add more allowed types if needed
    const maxFileSizeKB = 1024 * 1024 * 3; // Maximum allowed file size in kilobytes (1MB * 3)

    if (!file) {
      throw new Error("Please select a file");
    }

    if (file.size > maxFileSizeKB) {
      throw new Error(
        `File size exceeds, Only ${maxFileSizeKB / 1024} MB allowed`
      );
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(
        `Invalid image type, only jpeg, png, gif, webp extension is allwoed`
      );
    }

    const uploadedFile = file;

    // create file path
    const filePath = `/tmp/${uploadedFile.originalname}`;

    try {
      await writeFileAsync(filePath, uploadedFile.buffer);
    } catch (err) {
      throw new Error(`Could not upload the file ${err}`);
    }

    // Upload the original image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: `images/${userId}`,
    });

    // Use Cloudinary SDK to generate the thumbnail
    const thumbnailResult = await cloudinary.uploader.upload(filePath, {
      folder: `thumbnails/${userId}`,
      transformation: { width: 140, height: 103, crop: "crop" },
    });

    // Get the URLs for the original and thumbnail images
    const originalImageUrl = uploadResult.secure_url;
    const thumbnailImageUrl = thumbnailResult.secure_url;
    // Send the URLs back to the client
    // Clean up: Remove the temporary file from /tmp
    //fs.unlinkSync(filePath);
    return { originalImageUrl, thumbnailImageUrl, filePath };
  } catch (error) {
    logger.log("error", `Error uploading image: ${error}`);
    throw new Error(`Error uploading image:${JSON.stringify(error)}`);
  }
}


export async function deleteMedia(mediaURL: string | undefined) {
  if (!mediaURL) return;
  const publicId = mediaURL.split("/").slice(7).join("/").replace(fileExtensionsPattern, "");

  try {
    await cloudinary.uploader.destroy(publicId);
    logger.log("info", `Media has been successfully delete ${publicId}`);
  } catch (err:any) {
    logger.log("error", err);
    throw new Error(`Could not delete the media ${JSON.stringify(err)}`);
  }
}
