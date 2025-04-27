import { Injectable } from '@nestjs/common';
import { CreateScraperDto } from './dto/create-scraper.dto';
import { UpdateScraperDto } from './dto/update-scraper.dto';

type BoundingBox = {
  comuna: string;
  top: number;
  bottom: number;
  left: number;
  right: number;
};

@Injectable()
export class ScraperService {
  async findAll() {
    const results: any[] = [];
    const comunas: BoundingBox[] = [
      { comuna: 'Santiago Centro', top: -33.430, bottom: -33.470, left: -70.690, right: -70.620 },
      { comuna: 'Ñuñoa', top: -33.440, bottom: -33.490, left: -70.630, right: -70.570 },
      { comuna: 'Providencia', top: -33.410, bottom: -33.450, left: -70.640, right: -70.580 },
      { comuna: 'Las Condes', top: -33.340, bottom: -33.420, left: -70.580, right: -70.460 },
      { comuna: 'Vitacura', top: -33.350, bottom: -33.390, left: -70.610, right: -70.510 },
      { comuna: 'La Reina', top: -33.450, bottom: -33.500, left: -70.570, right: -70.510 },
      { comuna: 'Peñalolén', top: -33.460, bottom: -33.540, left: -70.570, right: -70.490 },
      { comuna: 'Macul', top: -33.470, bottom: -33.510, left: -70.630, right: -70.590 },
      { comuna: 'San Joaquín', top: -33.470, bottom: -33.500, left: -70.650, right: -70.610 },
      { comuna: 'La Florida', top: -33.500, bottom: -33.610, left: -70.590, right: -70.470 },
      { comuna: 'Puente Alto', top: -33.540, bottom: -33.700, left: -70.600, right: -70.440 },
      { comuna: 'Maipú', top: -33.470, bottom: -33.570, left: -70.820, right: -70.710 },
      { comuna: 'Cerrillos', top: -33.470, bottom: -33.520, left: -70.730, right: -70.680 },
      { comuna: 'Estación Central', top: -33.450, bottom: -33.500, left: -70.720, right: -70.660 },
      { comuna: 'Lo Prado', top: -33.420, bottom: -33.470, left: -70.730, right: -70.680 },
      { comuna: 'Pudahuel', top: -33.400, bottom: -33.520, left: -70.820, right: -70.670 },
      { comuna: 'Quinta Normal', top: -33.420, bottom: -33.460, left: -70.700, right: -70.660 },
      { comuna: 'Recoleta', top: -33.390, bottom: -33.450, left: -70.660, right: -70.620 },
      { comuna: 'Independencia', top: -33.400, bottom: -33.440, left: -70.670, right: -70.630 },
      { comuna: 'Huechuraba', top: -33.330, bottom: -33.440, left: -70.680, right: -70.560 },
      { comuna: 'El Bosque', top: -33.530, bottom: -33.600, left: -70.720, right: -70.650 },
      { comuna: 'Colina', top: -33.150, bottom: -33.350, left: -70.800, right: -70.580 },
      { comuna: 'Lampa', top: -33.200, bottom: -33.450, left: -70.950, right: -70.730 },
      { comuna: 'Tiltil', top: -32.900, bottom: -33.300, left: -71.050, right: -70.700 },
      { comuna: 'Buin', top: -33.650, bottom: -33.780, left: -70.820, right: -70.650 },
      { comuna: 'Paine', top: -33.700, bottom: -34.000, left: -70.950, right: -70.600 },
      { comuna: 'San Bernardo', top: -33.580, bottom: -33.670, left: -70.780, right: -70.650 },
      { comuna: 'Pirque', top: -33.570, bottom: -33.750, left: -70.600, right: -70.380 },
      { comuna: 'San José de Maipo', top: -33.480, bottom: -34.000, left: -70.600, right: -70.150 },
      { comuna: 'Melipilla', top: -33.500, bottom: -34.050, left: -71.350, right: -70.700 },
      { comuna: 'Curacaví', top: -33.300, bottom: -33.620, left: -71.100, right: -70.650 },
      { comuna: 'Alhué', top: -33.950, bottom: -34.230, left: -71.150, right: -70.600 },
      { comuna: 'María Pinto', top: -33.350, bottom: -33.600, left: -71.150, right: -70.880 },
      { comuna: 'Isla de Maipo', top: -33.660, bottom: -33.800, left: -70.950, right: -70.730 },
      { comuna: 'El Monte', top: -33.600, bottom: -33.720, left: -70.950, right: -70.750 },
      { comuna: 'Peñaflor', top: -33.550, bottom: -33.660, left: -70.950, right: -70.750 },
      { comuna: 'Padre Hurtado', top: -33.540, bottom: -33.620, left: -70.880, right: -70.740 },
      { comuna: 'Talagante', top: -33.590, bottom: -33.700, left: -70.930, right: -70.780 }
    ];





    for (const bbox of comunas) {
      const url = `https://www.waze.com/live-map/api/georss?top=${bbox.top}&bottom=${bbox.bottom}&left=${bbox.left}&right=${bbox.right}&env=row&types=alerts,traffic`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error en ${bbox.comuna}: ${res.status}`);
      const data = await res.json();
      const result = { comuna: bbox.comuna, data }
      results.push(result);

      // opcional: evita saturar la API
      await new Promise((res) => setTimeout(res, 500));
    }

    // Aquí puedes guardar los resultados en un archivo, base de datos, etc.
    console.log(JSON.stringify(results, null, 2));


    return results;
  }



}