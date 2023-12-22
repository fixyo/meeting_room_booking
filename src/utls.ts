import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';

export const md5 = (str) => {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
};

export const genParseIntPipe = (text: string) => {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(`${text}`);
    },
  });
};
