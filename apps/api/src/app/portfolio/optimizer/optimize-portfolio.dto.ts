import {
  PortfolioOptimizerMethod,
  PortfolioOptimizerRebalance
} from '@ghostfolio/common/interfaces';

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested
} from 'class-validator';

export class OptimizeAssetDto {
  @IsString()
  dataSource: string;

  @IsString()
  symbol: string;
}

export class OptimizeViewDto {
  @IsNumber()
  @Max(0.95)
  @Min(0.05)
  confidence: number;

  @IsNumber()
  @Max(5)
  @Min(-1)
  expectedReturn: number;

  @IsString()
  symbol: string;

  @IsIn(['ABSOLUTE', 'RELATIVE'])
  type: 'ABSOLUTE' | 'RELATIVE';

  @IsOptional()
  @IsString()
  versusSymbol?: string;
}

export class OptimizePortfolioDto {
  @ArrayMaxSize(20)
  @ArrayMinSize(2)
  @IsArray()
  @Type(() => OptimizeAssetDto)
  @ValidateNested({ each: true })
  assets: OptimizeAssetDto[];

  @IsBoolean()
  @IsOptional()
  backtest?: boolean;

  @IsNumber()
  @IsOptional()
  @Max(1000)
  @Min(60)
  backtestLookbackDays?: number;

  @IsIn(['MONTHLY', 'QUARTERLY', 'YEARLY'])
  @IsOptional()
  backtestRebalance?: PortfolioOptimizerRebalance;

  @IsNumber()
  @IsOptional()
  @Max(0.99)
  @Min(0.8)
  cvarAlpha?: number;

  @IsNumber()
  @IsOptional()
  @Max(3650)
  @Min(90)
  lookbackDays?: number;

  @IsNumber()
  @IsOptional()
  @Max(1)
  @Min(0.01)
  maxWeight?: number;

  @IsIn([
    'BLACK_LITTERMAN',
    'MAX_SHARPE',
    'MEAN_VARIANCE',
    'MIN_CVAR',
    'MIN_VARIANCE',
    'RISK_PARITY'
  ])
  method: PortfolioOptimizerMethod;

  @IsNumber()
  @IsOptional()
  @Max(50)
  @Min(0.1)
  riskAversion?: number;

  @IsNumber()
  @IsOptional()
  @Max(0.5)
  @Min(-0.05)
  riskFreeRate?: number;

  @IsNumber()
  @IsOptional()
  @Max(1)
  @Min(0.001)
  tau?: number;

  @ArrayMaxSize(10)
  @IsArray()
  @IsOptional()
  @Type(() => OptimizeViewDto)
  @ValidateNested({ each: true })
  views?: OptimizeViewDto[];
}
