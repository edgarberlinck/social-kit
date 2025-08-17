import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer', () => {
  const mockSendMail = jest.fn();
  const mockCreateTransport = jest.fn(() => ({
    sendMail: mockSendMail,
  }));
  return {
    createTransport: mockCreateTransport,
    __esModule: true, // This is important for default exports
  };
});

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'SMTP_HOST':
                  return 'test-smtp.com';
                case 'SMTP_PORT':
                  return 587;
                case 'SMTP_SECURE':
                  return false;
                case 'SMTP_USER':
                  return 'testuser';
                case 'SMTP_PASSWORD':
                  return 'testpass';
                case 'EMAIL_FROM':
                  return 'test@example.com';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create transporter with correct config', () => {
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'test-smtp.com',
      port: 587,
      secure: false,
      auth: {
        user: 'testuser',
        pass: 'testpass',
      },
    });
  });

  it('should send email successfully', async () => {
    const to = 'recipient@example.com';
    const subject = 'Test Subject';
    const body = 'Test Body';

    await service.sendEmail(to, subject, body);

    const mockedTransporter = nodemailer.createTransport();
    expect(mockedTransporter.sendMail).toHaveBeenCalledWith({
      from: 'test@example.com',
      to,
      subject,
      html: body,
    });
  });

  it('should throw an error if email sending fails', async () => {
    const mockedTransporter = nodemailer.createTransport();
    (mockedTransporter.sendMail as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to send email'),
    );

    const to = 'recipient@example.com';
    const subject = 'Test Subject';
    const body = 'Test Body';

    await expect(service.sendEmail(to, subject, body)).rejects.toThrow(
      'Failed to send email',
    );
  });
});
