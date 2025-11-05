import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './modules/customers/customer.module';
import { OrderModule } from './modules/orders/order.module';
import { CatalogModule } from './modules/product/product.module';
import { DatabaseModule } from './databases/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';

@Module({
  imports: [
        ConfigModule.forRoot({
            isGlobal: true, // makes env vars available everywhere
        }),
  DatabaseModule,
  AuthModule,
  CustomerModule,
  OrderModule,
  CatalogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); 
  }

}
