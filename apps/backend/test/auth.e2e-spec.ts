import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Auth E2E', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        // Add a module that sets process.env.MONGO_URI for the test
        {
          module: class TestModule {},
          providers: [
            {
              provide: 'MONGO_URI_TEST',
              useValue: process.env.MONGO_URI = 'mongodb://localhost:27017/test_db',
            },
          ],
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Add your auth e2e tests here
  it('/auth/register (POST) - successful registration', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password123', fullName: 'Test User' })
      .expect(201);
  });
});