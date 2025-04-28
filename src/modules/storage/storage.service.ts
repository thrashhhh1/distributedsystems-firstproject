import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Alert } from './entities/alert.entity';

@Injectable()
export class StorageService {

  constructor(
    @InjectModel(Alert.name)
    private readonly alertModel: Model<Alert>,
  ) { }

  async create(results: any) {

    const allAlerts = results.flatMap(result => {
      const alerts = result.data?.alerts;

      if (!alerts || !Array.isArray(alerts)) return [];

      return alerts.map(alert => ({
        alertId: alert.uuid,
        country: alert.country || 'CL',
        nThumbsUp: alert.nThumbsUp || 0,
        reportBy: alert.reportBy || 'desconocido',
        reportByMunicipalityUser: alert.reportByMunicipalityUser || false,
        type: alert.type || 'desconocida',
        subtype: alert.subtype || 'desconocido',
        roadType: alert.roadType || 0,
        location: {
          x: alert.location?.x || 0,
          y: alert.location?.y || 0,
        },
        street: alert.street || 'desconocida',
        fromNodeId: alert.fromNodeId || 0,
        toNodeId: alert.toNodeId || 0,
        speed: alert.speed || 0,
        pubMillis: alert.pubMillis || Date.now(),
        additionalInfo: result.comuna,
      }));
    });


    // Limitar a 10.000
    const limitedAlerts = allAlerts.slice(0, 10_000);

    const insertedAlerts = await this.alertModel.insertMany(limitedAlerts);
    return insertedAlerts;
  }



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
