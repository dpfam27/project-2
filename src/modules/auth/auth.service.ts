import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Customer } from '../customers/entities/customer.entity';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { LoginDto } from './dto/requests/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Customer) private customersRepo: Repository<Customer>,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async register(dto: RegisterUserDto): Promise<User> {
    // Check if username exists
    const existingUser = await this.usersRepo.findOne({ where: { username: dto.username } });
    if (existingUser) throw new ConflictException('Username already exists');

    // Check if email exists
    const existingCustomer = await this.customersRepo.findOne({ where: { email: dto.email } });
    if (existingCustomer) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Use transaction to ensure both user and customer are created together
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create user
      const newUser = this.usersRepo.create({
        username: dto.username,
        password: hashedPassword,
        role: dto.role || 'customer',  // default role is customer
      });
      const savedUser = await queryRunner.manager.save(newUser);

      // Only create customer record for non-admin users
      // Admins should NOT have customer records
      if (savedUser.role !== 'admin') {
        const newCustomer = new Customer();
        newCustomer.name = dto.name;
        newCustomer.email = dto.email;
        if (dto.phone) newCustomer.phone = dto.phone;
        if (dto.address) newCustomer.address = dto.address;
        await queryRunner.manager.save(newCustomer);
      }

      await queryRunner.commitTransaction();
      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async validateUser(username: string, pass: string): Promise<User> {
    if (!username || !pass) throw new UnauthorizedException('Invalid credentials');
    
    const user = await this.usersRepo.findOne({ where: { username } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.username, dto.password);
    const payload = { sub: user.id, username: user.username, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
