-- Cargar datos brutos de incidentes de Waze. Ajustar el esquema según tus datos.
-- Asumiendo un archivo CSV con campos como: id, tipo, calle, ciudad, lat, lon, timestamp, description
raw_incidents = LOAD '/waze_incidents/raw_waze_events.csv' USING PigStorage(',')
                AS (id:chararray, type:chararray, street:chararray, city:chararray,
                    lat:double, lon:double, timestamp:chararray, description:chararray);

-- 1. Filtrar registros incompletos o erróneos (ejemplo: tipo o descripción faltantes) 
-- Este es un ejemplo simplificado; necesitarás cheques más robustos basados en tus problemas de calidad de datos.
filtered_incidents = FILTER raw_incidents BY (type IS NOT NULL AND description IS NOT NULL);

-- 2. Eliminar duplicados (ejemplo: basados en ID o una combinación de atributos) 
-- Si 'id' es único por evento:
unique_incidents = DISTINCT filtered_incidents;


-- 3. Estandarizar tipos de incidentes y comuna (ejemplo: mapear varios términos a uno unificado) 
-- Esto a menudo requiere una UDF (Función Definida por el Usuario) escrita en Java/Python para mapeo complejo.
-- Para demostración, un caso simple:
standardized_types = FOREACH unique_incidents GENERATE
                     id,
                     (type == 'ACCIDENTE' ? 'ACCIDENT' :
                     (type == 'ATASCO' ? 'JAM' :
                     (type == 'CORTE' ? 'ROAD_CLOSURE' : 'OTHER'))) AS standardized_type,
                     street,
                     city, -- Asumiendo que 'city' se mapea directamente a 'comuna' por ahora
                     lat, lon, timestamp, description;

-- Normalizar nombres de comuna si es necesario (ej., "Santiago Centro" -> "Santiago") 
standardized_communes = FOREACH standardized_types GENERATE
                        id, standardized_type, street,
                        (city == 'Santiago Centro' ? 'Santiago' : city) AS comuna,
                        lat, lon, timestamp, description;

-- Podrías querer categorizar incidentes por tipo y comuna aquí, o en el siguiente paso. 
-- Almacenar los datos limpios y estandarizados 
STORE standardized_communes INTO '/waze_incidents/filtered_standardized_events' USING PigStorage(',');