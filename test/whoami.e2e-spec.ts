import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('Whoami test (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 and user when calling whoami with token', async () => {
    // 1. Register
    await request(server).post('/auth/register').send({ username: 'whoami', password: 'pass' });

    // 2. Login to get token
    const loginRes = await request(server).post('/auth/login').send({ username: 'whoami', password: 'pass' });
    console.log('LOGIN RESPONSE:', loginRes.body);
    const token = loginRes.body.access_token;

    // Debug: verify token structure
    const jwtService = app.get(JwtService);
    const decoded = jwtService.verify(token);
    console.log('JwtService.verify decoded:', decoded);

    // 3. Test unprotected endpoint (should always work)
    const hdrsRes = await request(server).get('/hdrs').set('Authorization', `Bearer ${token}`);
    console.log('HDRS RESPONSE:', hdrsRes.status, hdrsRes.body);

    // 4. Test protected endpoint
    const res = await request(server).get('/whoami').set('Authorization', `Bearer ${token}`);
    console.log('WHOAMI RESPONSE:', res.status, res.body);
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.username).toBe('whoami');
  });
});
