export interface ResponseType {
  ok: boolean;
  status: number;
  message: string;
  body?: any;
}
export interface FileUploadType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}
