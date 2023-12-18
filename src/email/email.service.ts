import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '529117173@qq.com',
        pass: '',
      },
    });
  }
}
