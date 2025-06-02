-- Cargar los datos limpios y estandarizados
cleaned_data = LOAD '/waze_incidents/filtered_standardized_events' USING PigStorage(',')
               AS (id:chararray, type:chararray, street:chararray, comuna:chararray,
                   lat:double, lon:double, timestamp:chararray, description:chararray);

-- 1. Agrupar incidentes por comuna para identificar patrones geográficos 
incidents_by_comuna = GROUP cleaned_data BY comuna;
count_by_comuna = FOREACH incidents_by_comuna GENERATE
                  group AS comuna,
                  COUNT(cleaned_data) AS incident_count;
STORE count_by_comuna INTO '/waze_analysis/incidents_by_comuna' USING PigStorage(',');

-- 2. Contar la frecuencia de ocurrencia de los diferentes tipos de incidentes 
incidents_by_type = GROUP cleaned_data BY type;
count_by_type = FOREACH incidents_by_type GENERATE
                group AS incident_type,
                COUNT(cleaned_data) AS type_count;
STORE count_by_type INTO '/waze_analysis/incidents_by_type' USING PigStorage(',');

-- 3. Analizar la evolución temporal de los incidentes, identificando tendencias y picos en momentos específicos
-- Extraer la hora del timestamp (requiere una UDF o funciones STRING si están disponibles)
-- Por simplicidad, extraigamos la fecha por ahora.
-- Asumiendo que el timestamp está en formato 'YYYY-MM-DD HH:MM:SS'
incidents_with_date = FOREACH cleaned_data GENERATE
                      *,
                      SUBSTRING(timestamp, 0, 10) AS event_date;

incidents_by_date_type = GROUP incidents_with_date BY (event_date, type);
count_by_date_type = FOREACH incidents_by_date_type GENERATE
                     group.event_date AS event_date,
                     group.type AS incident_type,
                     COUNT(incidents_with_date) AS daily_count;
STORE count_by_date_type INTO '/waze_analysis/temporal_trends' USING PigStorage(',');

-- Análisis adicional: Identificar áreas de alta congestión (ej., incidentes por comuna y calle)
incidents_by_comuna_street = GROUP cleaned_data BY (comuna, street);
count_by_comuna_street = FOREACH incidents_by_comuna_street GENERATE
                         group.comuna AS comuna,
                         group.street AS street,
                         COUNT(cleaned_data) AS incident_count;
STORE count_by_comuna_street INTO '/waze_analysis/congestion_areas' USING PigStorage(',');