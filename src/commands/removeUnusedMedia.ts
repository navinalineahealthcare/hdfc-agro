
import { Media } from "../https/upload/model/media.model";
import { deleteS3Media } from "../utils/utils";

export const removeUnusedMedia = async () => {

    const notUsedMedia = await Media.find({ used: false })

    for (const media of notUsedMedia) {
        await deleteS3Media(media.url);

    }
    await Media.deleteMany({ used: false })
};