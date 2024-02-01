import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  UnsupportedMediaTypeException,
  PreconditionFailedException,
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
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size <= maxSize) {
        cb(null, true);
      } else {
        cb(new PreconditionFailedException({
            status: false,
            message: "File size exceed the limit (5MB)"
        }), false);
      }
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
