/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../src/email/email.service';

describe('Auth E2E', () => {
  let app: INestApplication;
  let dbConnection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          if (key === 'MONGO_URI') {
            return 'mongodb://localhost:27017/social_kit_test';
          }
          if (key === 'JWT_SECRET') {
            return 'testsecret';
          }
          return null;
        }),
      })
      .overrideProvider(EmailService)
      .useValue({
        sendEmail: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dbConnection = moduleFixture.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    await dbConnection.close();
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('users').deleteMany({});
  });

  it('/auth/register (POST) - successful registration', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.email).toEqual('test@example.com');
        expect(res.body.isEmailConfirmed).toBe(false);
        expect(res.body.emailConfirmationToken).toBeDefined();
        expect(res.body.password).not.toEqual('password123');
      });
  });

  it('/auth/register (POST) - registration with existing email', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(201)
      .then(() => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            fullName: 'Another User',
            email: 'test@example.com',
            password: 'anotherpassword',
          })
          .expect(409);
      });
  });

  it('/auth/activate (GET) - successful activation', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        fullName: 'Test User',
        email: 'activate@example.com',
        password: 'password123',
      })
      .expect(201);

    const user = await dbConnection
      .collection('users')
      .findOne({ email: 'activate@example.com' });
    if (!user) throw new Error('User not found');

    return request(app.getHttpServer())
      .get(
        `/auth/activate?token=${user.emailConfirmationToken}&email=${user.email}`,
      )
      .expect(200)
      .expect((res) => {
        expect(res.text).toEqual('Account activated successfully!');
      });
  });

  it('/auth/activate (GET) - invalid activation token', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        fullName: 'Test User',
        email: 'invalidtoken@example.com',
        password: 'password123',
      })
      .expect(201);

    return request(app.getHttpServer())
      .get('/auth/activate?token=invalidtoken&email=invalidtoken@example.com')
      .expect(200)
      .expect((res) => {
        expect(res.text).toEqual('Invalid activation link or email.');
      });
  });

  it('/auth/login (POST) - successful login after activation', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        fullName: 'Login User',
        email: 'login@example.com',
        password: 'password123',
      })
      .expect(201);

    const user = await dbConnection
      .collection('users')
      .findOne({ email: 'login@example.com' });
    if (!user) throw new Error('User not found');

    await request(app.getHttpServer())
      .get(
        `/auth/activate?token=${user.emailConfirmationToken}&email=${user.email}`,
      )
      .expect(200);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
      });
  });

  it('/auth/login (POST) - login with unconfirmed email', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        fullName: 'Unconfirmed User',
        email: 'unconfirmed@example.com',
        password: 'password123',
      })
      .expect(201);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'unconfirmed@example.com',
        password: 'password123',
      })
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toEqual('Please confirm your email address');
      });
  });

  it('/auth/login (POST) - login with invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        fullName: 'Invalid Creds User',
        email: 'invalidcreds@example.com',
        password: 'password123',
      })
      .expect(201);

    const user = await dbConnection
      .collection('users')
      .findOne({ email: 'invalidcreds@example.com' });
    if (!user) throw new Error('User not found');

    await request(app.getHttpServer())
      .get(
        `/auth/activate?token=${user.emailConfirmationToken}&email=${user.email}`,
      )
      .expect(200);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'invalidcreds@example.com',
        password: 'wrongpassword',
      })
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toEqual('Invalid credentials');
      });
  });

  it('/auth/me (GET) - successful retrieval of authenticated user data', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        fullName: 'Me User',
        email: 'me@example.com',
        password: 'password123',
      })
      .expect(201);

    const user = await dbConnection
      .collection('users')
      .findOne({ email: 'me@example.com' });
    if (!user) throw new Error('User not found');

    await request(app.getHttpServer())
      .get(
        `/auth/activate?token=${user.emailConfirmationToken}&email=${user.email}`,
      )
      .expect(200);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'me@example.com',
        password: 'password123',
      })
      .expect(201);

    const accessToken = loginRes.body.access_token;

    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toEqual('me@example.com');
        expect(res.body.fullName).toEqual('Me User');
        expect(res.body.password).toBeUndefined();
      });
  });

  it('/auth/me (GET) - unauthorized access', () => {
    return request(app.getHttpServer()).get('/auth/me').expect(401);
  });
});
