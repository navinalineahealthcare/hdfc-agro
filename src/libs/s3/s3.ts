import AWS from "aws-sdk";
import { env } from "../../env"
import fs from "fs";
export class S3 {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  public static async verifyFile(url: string) {
    return new Promise((resolve, reject)=>{
      AWS.config.update({
        accessKeyId: env.aws.accessKey,
        secretAccessKey: env.aws.secretAccessKey,
        region: env.aws.region,
      });
      var s3 = new AWS.S3();
      var params = { Bucket: env.aws.bucket, Key: url.split("aws.com/")[1] };
      s3.headObject(params, (err:any, metadata:any)=>{
        if(err)
          reject(false);
        else 
          resolve(true);
      });
    })
  }

  public static async S3deleteObject(key:string) {
    return new Promise(async(resolve, reject)=>{
      AWS.config.update({
        accessKeyId: env.aws.accessKey,
        secretAccessKey: env.aws.secretAccessKey,
        region: env.aws.region,
      });
      var s3 = new AWS.S3();
      var params = { Bucket: env.aws.bucket, Key: key };

      await s3.deleteObject(params, function (err, data) {
        if (err) 
          return reject(false);
        
        resolve(true);
      });

      return true;
    })
  }

  public static async uploadFile(filePath: string, fileKey: string) {
    return new Promise(async (resolve, reject) => {
      
      var s3 = new AWS.S3();
      const readStream = await fs.createReadStream(filePath);

      const params = {
        ContentType: 'image/png',
        ContentDisposition: "inline",
        ACL: 'public-read',
        Bucket: env.aws.bucket,
        Key: fileKey,
        Body: readStream,
      };

      s3.upload(params, function(err:any, data:any) {
        
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  }

  public static async uploadBinaryFile(binaryData: string, fileKey: string) {
    return new Promise(async (resolve, reject) => {
 

      var s3 = new AWS.S3();

      const params = {
        ContentType: 'image/png',
        ContentDisposition: "inline",
        ACL: 'public-read',
        Bucket: env.aws.bucket,
        Key: fileKey,
        Body: binaryData,
      };

      s3.upload(params, function(err:any, data:any) {
        
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  }
}
