import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";



export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
    console.log(configService.get<string>('DB_USER'));
    console.log(configService.get<string>('DB_NAME'));
  // For tests use in-memory sqlite to avoid external DB dependency
  if (process.env.NODE_ENV === 'test') {
    return {
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      autoLoadEntities: true,
    } as TypeOrmModuleOptions;
  }

  return {
    type: 'mysql', // changed from mariadb for compatibility with MySQL 8.0
    host: configService.get<string>('DB_HOST'),
    port: parseInt(configService.get<string>('DB_PORT')|| '3306', 10),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASS'),
    database: configService.get<string>('DB_NAME'),
    autoLoadEntities: true,
    synchronize: true, // only for dev
    timezone: '+00:00',
    // Add explicit options to handle MySQL 8.0 strict mode
    extra: {
      connectionLimit: 10,
    },
  };
};
