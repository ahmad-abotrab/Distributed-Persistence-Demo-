import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop', maxLength: 150 })
  name: string;

  @ApiProperty({ example: 999.99 })
  price: number;

  @ApiProperty({ example: 50 })
  stock: number;
}
