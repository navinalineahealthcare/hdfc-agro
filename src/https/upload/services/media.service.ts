import { deleteS3Media } from "../../../utils/utils";
import { Media } from "../model/media.model";

export const addMediaurl = async (url: string, used: boolean) => {
  try {
    await Media.create({
      url,
      used,
    });

    return true;
  } catch (error: any) {
    return error;
  }
};

export const updateMediaurl = async (url: string, used: boolean) => {
  try {
    await Media.findOneAndUpdate({ url: url }, { used: used });

    return true;
  } catch (error: any) {
    return error;
  }
};

export const deleteMediaurl = async (url: string) => {
  try {
    await Media.deleteOne({ url: url });

    // deleted file from aws
    await deleteS3Media(url);

    return true;
  } catch (error: any) {
    return error;
  }
};
