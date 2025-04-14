import { Injectable, Logger } from '@nestjs/common';
import { getPoissonInterval } from './distribution/distribution.poisson';
import { getUniformInterval } from './distribution/distribution.uniform';
import * as http from 'http';

@Injectable()
export class TrafficService {
  private logger = new Logger(TrafficService.name);
  private apiUrl = 'http://localhost:3000/alert';

  private getInterval(type: 'poisson' | 'uniforme'): number {
    if (type === 'poisson') return getPoissonInterval();
    return getUniformInterval();
  }

  private makeRequest(): Promise<any> {
    return new Promise((resolve, reject) => {
      http.get(this.apiUrl, (res) => {
        let data = '';

        // Escucha datos en partes
        res.on('data', (chunk) => {
          data += chunk;
        });

        // Cuando termina de recibir la respuesta
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (err) {
            reject(`Error al parsear JSON: ${err}`);
          }
        });
      }).on('error', (err) => {
        reject(`Error en la petición HTTP: ${err.message}`);
      });
    });
  }

  async generarTrafico(type: 'poisson' | 'uniforme', count: number) {
    for (let i = 0; i < count; i++) {
      try {
        const result = await this.makeRequest();
        this.logger.log(`Consulta #${i + 1}: ${JSON.stringify(result)}`);
      } catch (error) {
        this.logger.error(`Error en consulta #${i + 1}: ${error}`);
      }

      await new Promise((res) => setTimeout(res, this.getInterval(type)));
    }
  }
}
