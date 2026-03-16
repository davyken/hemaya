import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import * as streamifier from 'streamifier';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async onModuleInit() {
    this.logger.log('Cloudinary storage initialized');
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; key: string }> {
    return new Promise((resolve, reject) => {
      const publicId = `heyama/${uuidv4()}`;
      
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: publicId, folder: 'heyama' },
        (error, result) => {
          if (error) {
            this.logger.error(`Upload failed: ${error.message}`);
            reject(error);
          } else {
            resolve({
              url: result?.secure_url || '',
              key: result?.public_id || '',
            });
          }
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      this.logger.warn(`Could not delete file ${publicId}: ${err.message}`);
    }
  }
}
