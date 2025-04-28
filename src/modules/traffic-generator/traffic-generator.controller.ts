import { Controller, Get, Query } from '@nestjs/common';
import { TrafficGeneratorService } from './traffic-generator.service';


@Controller('traffic')
export class TrafficGeneratorController {
  constructor(private readonly trafficGeneratorService: TrafficGeneratorService) {}

  @Get('simulate')
  async simulate(
    @Query('dist') dist: 'poisson' | 'uniforme' = 'poisson',
    @Query('count') count = '100'
  ) {
    const num = parseInt(count);
    await this.trafficGeneratorService.generateTraffic(dist, num);
    return { message: `Simulacion completada con distribucion ${dist}` };
  }
}
