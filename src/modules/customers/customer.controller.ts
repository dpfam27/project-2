import { Controller, Get, Param, Req , Post, Body, Put, Delete, Query, Logger } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

import { Auth } from "../../common/decorators/auth.decorator";
import { ApiResponseDto } from "../../common/dto/api-response.dto";
import { CustomerService } from "./customer.service";
import { Customer } from "./entities/customer.entity";
import { CreateCustomerDto } from "./dto/request/create-customer.dto";
import { CustomerResponseDto } from "./dto/response/customer-response.dto";

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {

    constructor(private readonly customerService: CustomerService) {}
    
    
    @Get('search')
    //@Auth('user')
    @ApiOkResponse({ type: ApiResponseDto<Customer[]> })
    async search(@Query('keyword') keyword: string): Promise<ApiResponseDto<Customer[]|null>> {
        //console.log('>>> Current user:', req.user); //  check
        Logger.log('Searching customers with keyword:', keyword);
        var listCustomers = await this.customerService.search(keyword);
        return {
            statusCode: 200,
            message: 'Success',
            data: listCustomers
        }
    }

    @Get()
    @Auth('admin')
    @ApiOkResponse({ type: ApiResponseDto<Customer[]> })
    async findAll(@Req() req): Promise<ApiResponseDto<Customer[]>> {
        console.log('>>> Current user:', req.user); //  check
        var listCustomers = await this.customerService.findAll();
        return {
            statusCode: 200,
            message: 'Success',
            data: listCustomers
        }
    }
    
    @Get(':id')
    @ApiOkResponse({ type: ApiResponseDto<CustomerResponseDto> })
    async findOne(@Param('id') id: number): Promise<ApiResponseDto<CustomerResponseDto | null>> {
        var customer = plainToInstance(CustomerResponseDto, await this.customerService.findOne(id), { excludeExtraneousValues: true });
        console.log('id:', id, 'customer:', customer);
        return {
            statusCode: 200,
            message: 'Successfully',
            data: customer
        }
    }

    @Post()
    @Auth('user')
    @ApiOkResponse({ type: ApiResponseDto<CustomerResponseDto> })
    async create(@Body() dto: CreateCustomerDto): Promise<ApiResponseDto<CustomerResponseDto>> {
        var customer = plainToInstance(Customer, dto, { excludeExtraneousValues: true });
        customer = await this.customerService.create(customer);
        console.log('customer: new object created',customer);
        return {
            statusCode: 200,
            message: 'Successfully',
            data: plainToInstance(CustomerResponseDto, customer, { excludeExtraneousValues: true })
        }
    }

    @Put(':id')
    @Auth('user')
    @ApiOkResponse({ type: ApiResponseDto<CustomerResponseDto> })
    async update(@Param('id') id: number, @Body() dto: CreateCustomerDto): Promise<ApiResponseDto<CustomerResponseDto>> {
        var customer = plainToInstance(Customer, dto, { excludeExtraneousValues: true });
        var updatedCustomer = await this.customerService.update(id, customer);
        return {
            statusCode: 200,
            message: 'Successfully',
            data: plainToInstance(CustomerResponseDto, updatedCustomer, { excludeExtraneousValues: true })
        }
    }
    
    @Delete(':id')
    @Auth('user')
    @ApiOkResponse({ type: ApiResponseDto<void> })
    async remove(@Param('id') id: number): Promise<ApiResponseDto<null>> {
        await this.customerService.remove(id);
        return {
            statusCode: 200,
            message: 'Successfully',
            data: null
        }
    }   

}
