FROM bde2020/hadoop-base:2.0.0-hadoop3.2.1-java8

ENV PIG_VERSION=0.17.0
ENV PIG_URL=https://archive.apache.org/dist/pig/pig-${PIG_VERSION}/pig-${PIG_VERSION}.tar.gz

ENV PIG_HOME=/opt/pig
ENV PATH=$PATH:$PIG_HOME/bin

RUN sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    sed -i 's/security.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    # Eliminar líneas de stretch-updates que a menudo causan problemas en archivos
    sed -i '/stretch-updates/d' /etc/apt/sources.list && \
    # Añadir la línea de backports si es necesaria, o simplemente para tenerla disponible
    echo "deb http://archive.debian.org/debian stretch-backports main" >> /etc/apt/sources.list

# Instalar wget y ca-certificates (para asegurar que las descargas HTTPS funcionen)
RUN apt-get update && apt-get install -y --no-install-recommends wget ca-certificates && \
    rm -rf /var/lib/apt/lists/*
# --- FIN DE LA CORRECCIÓN ---

# Descargar, extraer y configurar Pig
RUN mkdir -p /tmp/pig_install && \
    wget -qO- ${PIG_URL} | tar -xz -C /tmp/pig_install && \
    mv /tmp/pig_install/pig-${PIG_VERSION} ${PIG_HOME} && \
    rm -rf /tmp/pig_install

# CMD por defecto
CMD ["/bin/bash"]