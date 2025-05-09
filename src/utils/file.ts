import env from "../config/config";
import { messages, bucket_folders } from "./consts";
import { StatusCodes } from "http-status-codes";
import { log } from "./logger";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

export const convertBase64ToFile = (content: string): Buffer => {
  return Buffer.from(content, "base64");
};

export const uploadFile = async (
  folder: bucket_folders,
  buffer: Buffer,
  filename: string
): Promise<string> => {
  try {
    const blobServiceClient = new BlobServiceClient(
      `https://${env.AZURE_STORAGE_NAME}.blob.core.windows.net`,
      new StorageSharedKeyCredential(
        env.AZURE_STORAGE_NAME,
        env.AZURE_STORAGE_KEY
      )
    );
    const containerClient = blobServiceClient.getContainerClient(
      env.AZURE_CONTAINER_NAME
    );
    // create blob client
    const blobClient = containerClient.getBlockBlobClient(
      `${folder}/${filename}`
    );
    await blobClient.uploadData(buffer);
    return blobClient.url;
  } catch (error) {
    log("error", { error });
    throw {
      ok: false,
      message: messages.SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

export async function deleteFile(
  url: string
): Promise<{ ok: boolean; message: string; status: number }> {
  try {
    const blobServiceClient = new BlobServiceClient(
      `https://${process.env.AZURE_STORAGE_NAME}.blob.core.windows.net`,
      new StorageSharedKeyCredential(
        process.env.AZURE_STORAGE_NAME!,
        process.env.AZURE_STORAGE_KEY!
      )
    );
    const containerClient = blobServiceClient.getContainerClient(
      process.env.AZURE_CONTAINER_NAME!
    );
    const blobPath = new URL(url).pathname.slice(1);
    const blobClient = containerClient.getBlockBlobClient(blobPath);
    const deleted = await blobClient.deleteIfExists();
    return deleted
      ? {
          ok: true,
          message: messages.FILE_DELETED,
          status: StatusCodes.NO_CONTENT,
        }
      : {
          ok: false,
          message: messages.FILE_NOT_FOUND,
          status: StatusCodes.NOT_FOUND,
        };
  } catch (error) {
    console.error("Failed to delete file:", error);
    return {
      ok: false,
      message: messages.SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
}
