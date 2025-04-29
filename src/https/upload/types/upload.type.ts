import { Express } from "express";

export enum UPLOAD_TYPES {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    FILE = "FILE",
}

export interface UploadedFile extends Express.Multer.File {
    key: string;
    originalname: string;
    mimetype: string;
    size: number;
    location: string; // The S3 object URL
    framePath: string;
    frameImages: Array<string>;
}