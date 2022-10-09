FROM node:16

# Creo la carpeta de la app en el contenedor
RUN mkdir /opt/app
# Todos los comandos que te tire son en la carpeta /opt/app
WORKDIR /opt/app

COPY app.js package.json package-lock.json ./

RUN npm install

ENTRYPOINT [ "node", "app.js" ]