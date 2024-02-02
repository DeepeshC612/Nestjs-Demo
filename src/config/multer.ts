import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  UnsupportedMediaTypeException,
} from '@nestjs/common';

export const multerConfig: MulterOptions = {
  dest: 'C:/Users/codiant/Desktop/nest js demo/nextjs-demo/src/uploads',
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'C:/Users/codiant/Desktop/nest js demo/nextjs-demo/src/uploads');
    },
    filename: (req, file, cb) => {
      const fileName = `${
        file.originalname.split('.')[0]
      }.${Date.now()}${extname(file.originalname)}`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new UnsupportedMediaTypeException({
          status: false,
          message: 'Unsupported Media Type',
        }),
        false,
      );
    }
  },
};
