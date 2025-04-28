import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CacheService } from '../../modules/cache/cache.service'; // Ajusta la ruta a tu AppCacheService
import { StorageService } from '../storage/storage.service'; // Ajusta la ruta a tu StorageService
import { Alert } from '../storage/entities/alert.entity'; // Ajusta la ruta a tu entidad Alert
import { getPoissonInterval } from './distribution/distribution.poisson'; // Asegúrate que este archivo/función exista
import { getUniformInterval } from './distribution/distribution.uniform'; // Asegúrate que este archivo/función exista

// Opcional: Importar decoradores de Schedule si prefieres ejecución periódica en lugar de solo al inicio
// import { Cron, CronExpression } from '@nestjs/schedule'; 

@Injectable()
// Implementa OnApplicationBootstrap para ejecutar automáticamente al inicio.
// Alternativamente, podrías quitar 'implements OnApplicationBootstrap' y usar @Cron en un método.
export class TrafficGeneratorService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TrafficGeneratorService.name);

  // Numero de consultas a simular
  private readonly SIMULATION_QUERY_COUNT = 1000; // 

  constructor(
    // Inyecta los servicios necesarios
    private cacheService: CacheService,
    private storageService: StorageService,
  ) { }

  async onApplicationBootstrap() {
    this.logger.log('--- Iniciando simulacion de trafico ---');

    try {
      this.logger.log('--- Simulacion Poisson activa ---');
      await this.generateTraffic('poisson', this.SIMULATION_QUERY_COUNT);
      this.cacheService.printAndResetCacheStats('Poisson');

      // await new Promise(resolve => setTimeout(resolve, 2000)); 

      this.logger.log('-- Iniciando simulacion con distribucion uniforme ---');
      await this.generateTraffic('uniforme', this.SIMULATION_QUERY_COUNT);

      this.cacheService.printAndResetCacheStats('Uniforme');

      this.logger.log('Simulacion finalizada.');

    } catch (error) {
      this.logger.error('La simulacion de trafico fallo:', error.stack);
    }
  }

  private getInterval(type: 'poisson' | 'uniforme'): number {
    // Asegúrate que las funciones importadas devuelvan el intervalo en milisegundos.
    if (type === 'poisson') {
      return getPoissonInterval(/* Puedes pasar parámetros si tus funciones lo requieren */);
    }
    // Asume 'uniforme' como default si no es 'poisson'
    return getUniformInterval(/* Puedes pasar parámetros si tus funciones lo requieren */);
  }

  private async simulateSingleQuery(): Promise<Alert | null> {
    let alertData: Alert | null = null;
    let alertId: string | null = null;

    try {
      const randomAlertFromDb = await this.storageService.findRandom();

      if (!randomAlertFromDb || !randomAlertFromDb.alertId) {
        this.logger.warn("Np se pudo obtener una alerta random del almacenamiento.");
        return null;
      }

      alertId = randomAlertFromDb.alertId;
      const cacheKey = `alert:${alertId}`;
      alertData = await this.cacheService.get<Alert>(cacheKey);

      if (!alertData) {
        alertData = randomAlertFromDb;
        await this.cacheService.set(cacheKey, alertData);
      }

    } catch (error) {
      this.logger.error(`Error en una sola simulacion de la query (Intento AlertID: ${alertId}): ${error.message}`, error.stack);
      return null;
    }

    return alertData;
  }

  async generateTraffic(type: 'poisson' | 'uniforme', count: number): Promise<void> {
    this.logger.log(`--- Iniciando generacion de trafico con distribucion: ${type} y ${count} queries ---`);

    for (let i = 0; i < count; i++) {
      const result = await this.simulateSingleQuery();
      const waitTime = this.getInterval(type);
      if (waitTime > 0) {
        await new Promise((res) => setTimeout(res, waitTime));
      }
    }

    this.logger.log(`--- Ciclo de generacion de trafico con distribucion ${type} finalizado ---`);
  }

}