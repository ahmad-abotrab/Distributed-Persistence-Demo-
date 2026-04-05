import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Laptop' })
  name?: string;

  @ApiPropertyOptional({ example: 999.99 })
  price?: number;

  @ApiPropertyOptional({ example: 50 })
  stock?: number;
}
