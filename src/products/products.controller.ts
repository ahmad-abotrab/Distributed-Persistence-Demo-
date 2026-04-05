import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './create-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a product (writes to primary DB)' })
    @ApiBody({ type: CreateProductDto })
    async create(@Body() body: CreateProductDto) {
        return await this.productsService.create(body);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products (reads from replica DB)' })
    async findAll() {
        return await this.productsService.findAllFromReplica();
    }

    @Get('primary/:id')
    @ApiOperation({ summary: 'Get one product by id (reads from primary DB)' })
    @ApiParam({ name: 'id', type: Number })
    async findOneFromPrimary(@Param('id', ParseIntPipe) id: number) {
        return await this.productsService.findOneFromPrimary(id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get one product by id (reads from replica DB)' })
    @ApiParam({ name: 'id', type: Number })
    async findOneFromReplica(@Param('id', ParseIntPipe) id: number) {
        return await this.productsService.findOneFromReplica(id);
    }
}
