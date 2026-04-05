import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product], 'primary'),
    TypeOrmModule.forFeature([Product], 'replica'),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }