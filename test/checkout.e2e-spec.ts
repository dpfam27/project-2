import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { JwtAuthGuard } from './../src/modules/auth/jwt-auth.guard';
import { RolesGuard } from './../src/common/guards/roles.guard';

describe('Checkout flow (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let token: string;

  beforeAll(async () => {
    const builder = Test.createTestingModule({ imports: [AppModule] })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true });

    const moduleRef = await builder.compile();
    app = moduleRef.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    // register a user (we bypass guards so this is optional but kept for realism)
    await request(server).post('/auth/register').send({ username: 'e2eadmin', password: 'password' });
    const r = await request(server).post('/auth/login').send({ username: 'e2eadmin', password: 'password' });
    token = r.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create product, variant, stock and checkout successfully', async () => {
    // create product
    const p = await request(server)
      .post('/catalog/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Whey Test', description: 'Test' });

    expect(p.status).toBe(201);
    const product = p.body;

    // create variant directly via DB for speed
    const ds = app.get<DataSource>(DataSource);
    const variantRepo = ds.getRepository('variants');
    const variant = await variantRepo.save({ product: { id: product.id }, sku: 'SKU-1', attributes: { flavor: 'vanilla' } } as any);

    const stockRepo = ds.getRepository('stocks');
    await stockRepo.save({ variant: { id: variant.id }, quantity: 10, reserved: 0 });

    const priceRepo = ds.getRepository('prices');
    await priceRepo.save({ variant: { id: variant.id }, base_price: 100, sale_price: null });

    // create a customer to use for checkout
    const c = await request(server)
      .post('/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'E2E Customer', email: 'e2e@example.com' });
  expect(c.status).toBe(201);
    const customer = c.body.data;

    // checkout
    const checkout = await request(server)
      .post('/orders/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ customer_id: customer.id ?? 1, items: [{ variant_id: variant.id, quantity: 2 }], shipping_fee: 0 });

    if (checkout.status === 401) {
      console.log('CHECKOUT 401 BODY:', checkout.body);
    }
    console.log('CHECKOUT RESPONSE:', checkout.status, checkout.body);
    expect(checkout.status).toBe(201);

    const { order, paymentId } = checkout.body.data;

    // simulate payment webhook
    const webhook = await request(server).post('/payments/webhook').send({ payment_id: paymentId, order_id: order.id, status: 'success' });
    expect(webhook.body.ok).toBe(true);

    // fetch order
    const fetched = await request(server).get(`/orders/${order.id}`).set('Authorization', `Bearer ${token}`);
    expect(fetched.body.data.status).toBe('Paid');

    // check stock updated
    const updatedStock = await stockRepo.findOne({ where: { variant: { id: variant.id } } }) as any;
    expect(updatedStock).toBeTruthy();
    expect(updatedStock.quantity).toBe(8);
    expect(updatedStock.reserved).toBe(0);
  }, 20000);
});
