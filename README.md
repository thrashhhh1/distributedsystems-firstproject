# Proyecto Sistemas Distribuidos: Plataforma de análisis de tráfico
Tecnologías: NestJS como framework de backend, MongoDB como sistema de almacenamiento y Redis como sistema de caché. Toda la aplicación está contenerizada usando Docker y Docker Compose.

**Funcionalidades:**

* **Scraper:** Extrae datos de alertas de tráfico desde el Live Map de Waze para diversas comunas de la RM de forma automática al iniciar. Continúa ejecutándose en ciclos hasta almacenar al menos 10.000 eventos en la base de datos.
* **Almacenamiento:** Guarda los eventos de Waze obtenidos en una base de datos MongoDB.
* **Generador de Tráfico:** Simula automáticamente consultas hacia el sistema de caché utilizando los datos almacenados, aplicando distribuciones de llegada Poisson y/o Uniforme (configurable).
* **Caché:** Utiliza Redis para almacenar en caché los eventos consultados frecuentemente por el generador de tráfico. Implementa métricas de rendimiento (Hits, Misses, Hit Rate) y permite experimentar con diferentes políticas de remoción y tamaños configurando el servicio Redis.

## Prerequisitos

Para ejecutar este proyecto, se necesita instalado:

* **Docker** 
* **Docker Compose** 

(No es estrictamente necesario tener Node.js o npm instalados en la máquina host si solo se va a ejecutar via Docker).

## Configuración

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/thrashhhh1/distributedsystems-firstproject
    cd distributedsystems-firstproject
    ```

2.  **Crear Archivo de Entorno (`.env`):**
    Este proyecto utiliza un archivo `.env` en la raíz para configurar variables esenciales. Crea un archivo llamado `.env` y copia/pega el siguiente contenido, ajustando si es necesario (aunque los valores por defecto deberían funcionar con Docker Compose):

    ```dotenv
    # .env

    # Puerto en el que correrá la aplicación NestJS dentro del contenedor
    PORT=3000

    # URL de conexión a MongoDB
    # Importante: Usa el nombre del servicio 'mongodb' definido en docker-compose.yaml
    MONGODB_URL=mongodb://mongodb:27017/mongo-distributedsystems 

    # Configuración de Redis
    # Importante: Usa el nombre del servicio 'redis' definido en docker-compose.yaml
    REDIS_HOST=redis
    REDIS_PORT=6379

    # TTL por defecto para la caché en segundos (1 minuto)
    CACHE_TTL=60

    # Número de consultas a simular por cada distribución en el generador de tráfico
    SIMULATION_QUERY_COUNT=1000 
    ```

3.  **Configuración de Experimentos de Caché (Opcional):**
    Para evaluar diferentes políticas de remoción y tamaños de caché de Redis como pide la Tarea 1, edita el archivo `docker-compose.yaml`. Busca la sección del servicio `redis` y descomenta **SOLO UNA** de las líneas `command:` según el experimento que quieras realizar. Por defecto, una estará descomentada.

    ```yaml
    # Ejemplo dentro de docker-compose.yaml, servicio redis:
      redis:
        # ... (image, ports, etc.) ...
        # --- Comando para configurar Redis (¡ELIGE UNA LÍNEA y descoméntala!) ---
        # command: redis-server --save "" --appendonly no --maxmemory 128mb --maxmemory-policy volatile-lru 
        command: redis-server --save "" --appendonly no --maxmemory 150kb --maxmemory-policy allkeys-lru
        # command: redis-server --save "" --appendonly no --maxmemory 128mb --maxmemory-policy allkeys-lfu
        # command: redis-server --save "" --appendonly no --maxmemory 64mb --maxmemory-policy allkeys-lru 
    ```

## Ejecución (Usando Docker Compose)

1.  **Abrir Terminal:** Navegar a la carpeta raíz del proyecto donde se encuentran los archivos `docker-compose.yaml` y `Dockerfile`.
2.  **Construir e Iniciar Servicios:** Ejecuta el siguiente comando. La primera vez, el paso de `build` puede tardar unos minutos.
    ```bash
    docker-compose up -d --build
    ```

3.  **Verificar Contenedores:** Puedes ver los contenedores corriendo con:
    ```bash
    docker ps
    ```
    Deben estar los contenedores para `app`, `mongodb` y `redis`.

4.  **Ver Logs de la Aplicación:** Para ver qué está haciendo la aplicación NestJS (incluyendo el scraper, generador de tráfico y estadísticas de caché), usa:
    ```bash
    docker-compose logs -f app
    ```
    * `-f`: Seguir los logs en tiempo real (Ctrl+C para salir).
    * `app`: Nombre del servicio de tu aplicación en `docker-compose.yaml`.
    * **Qué buscar:** Mensajes de inicio de NestJS, logs del `ScraperService` indicando conteo de eventos y esperas, logs del `TrafficGeneratorService` indicando inicio de simulaciones, y logs del `CacheService` con las estadísticas de HIT/MISS/Hit Rate para cada distribución probada.


## Ejecución de Experimentos de Caché

Para comparar diferentes configuraciones de caché:

1.  Asegurar de que los contenedores estén corriendo (`docker-compose up -d`).
2.  Deja que la simulación de tráfico se ejecute (monitoriza con `docker-compose logs -f app`).
3.  Cuando termine, se imprimiran las estadisticas en consola. 
4.  Detén y elimina los contenedores: `docker-compose down`.
5.  Edita `docker-compose.yaml`, comenta la línea `command:` de Redis anterior y descomenta la nueva configuración que quieres probar. Guarda el archivo.
6.  Inicia de nuevo: `docker-compose up -d` (no siempre necesitas `--build` si solo cambiaste el `command` de Redis).


## Detener la Aplicación

Para detener y eliminar los contenedores, redes y volúmenes (excepto los nombrados como `mongo_data`):

```bash
docker-compose down