import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { ReplicationModule } from 'src/replication/replication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product], 'primary'),
    TypeOrmModule.forFeature([Product], 'replica'),
    ReplicationModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }