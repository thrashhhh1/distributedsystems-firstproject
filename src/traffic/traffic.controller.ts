import { Controller, Get, Query } from '@nestjs/common';
import { TrafficService } from './traffic.service';

@Controller('traffic')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get('simulate')
  async simulate(
    @Query('dist') dist: 'poisson' | 'uniforme' = 'poisson',
    @Query('count') count = '100'
  ) {
    const num = parseInt(count);
    await this.trafficService.generarTrafico(dist, num);
    return { message: `Simulación completada con distribución ${dist}` };
  }
}
