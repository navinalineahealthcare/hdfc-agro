import { model, Schema } from "mongoose";
import { mediaType } from "../types/media.type";

const mediaSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        default: false,
        required: true
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
}, { timestamps: true });


const Media = model<mediaType>("medias", mediaSchema);

export { mediaType, Media };