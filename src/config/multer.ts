import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as Path from 'path';
import {
  UnsupportedMediaTypeException,
} from '@nestjs/common';
 
const dirname = Path.dirname(__dirname)
export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, Path.join(dirname, '..', 'src', 'uploads'),);
    },
    filename: (req, file, cb) => {
      const fileName = `${
        file.originalname.split('.')[0]
      }.${Date.now()}${Path.extname(file.originalname)}`;
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