import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Alert } from './entities/alert.entity';
import { AlertData } from './interfaces/alert-data.interface';

interface ScraperResult { comuna: string; data?: { alerts?: AlertData[]; }; }

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(
    @InjectModel(Alert.name)
    private readonly alertModel: Model<Alert>,
  ) { }

  async create(results: ScraperResult[]): Promise<number> {
    this.logger.log(`${results.length} resultados del scraping.`);

    const allAlerts = results.flatMap(result => {
      const alerts = result?.data?.alerts;

      if (!alerts || !Array.isArray(alerts) || alerts.length === 0) {
        return [];
      }

      return alerts.map(alert => ({
        alertId: alert.uuid ?? `generated_${Date.now()}_${Math.random()}`,
        country: alert.country ?? 'CL',
        nThumbsUp: alert.nThumbsUp ?? 0,
        reportBy: alert.reportBy ?? 'desconocido',
        reportByMunicipalityUser: alert.reportByMunicipalityUser ?? false,
        type: alert.type ?? 'desconocida',
        subtype: alert.subtype ?? 'desconocido',
        roadType: alert.roadType ?? 0,
        location: {
          x: alert.location?.x ?? 0,
          y: alert.location?.y ?? 0,
        },
        street: alert.street ?? 'desconocida',
        fromNodeId: alert.fromNodeId ?? 0,
        toNodeId: alert.toNodeId ?? 0,
        speed: alert.speed ?? 0,
        pubMillis: alert.pubMillis ?? Date.now(),
        additionalInfo: result.comuna,
      }));
    });

    if (allAlerts.length === 0) {
      this.logger.warn("No hay alertas disponibles para insertar en este ciclo.");
      return 0;
    }

    try {
      const insertResult = await this.alertModel.insertMany(allAlerts, { ordered: false });
      this.logger.log(`Se han insertado un total de ${insertResult.length} eventos a la base de datos.`);
      return insertResult.length;
    } catch (error) {
      if (error.code === 11000) {
        this.logger.warn(`Error. Evento duplicado.`);
        return error.result?.nInserted || 0;
      } else {
        this.logger.error('Error al insertar los eventos a la base de datos:', error.stack);
        throw error;
      }
    }
  }

  async countAll(): Promise<number> {
    try {
      const count = await this.alertModel.countDocuments().exec();
      this.logger.debug(`Total de eventos en la base de datos: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error calculando eventos totales:', error.stack);
      throw error; 
    }
  }

  // Metodo solo para ver si se estan insertando bien las consultas, no tiene relevancia durante la ejecucion.
  findAll() {
    return this.alertModel.find();
  }

  async findRandom() {
    const count = await this.alertModel.estimatedDocumentCount();
    if (count === 0) return null;

    const random = Math.floor(Math.random() * count);
    const [doc] = await this.alertModel.find().skip(random).limit(1);
    return doc;
  }

}
