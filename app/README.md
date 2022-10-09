# Ejecución en Docker

1. Hacemos el build de la imagen estando posicionados en /app:
```docker build . -t node-app-tp1```

2. Creamos un container:
```docker run --publish 3000:3000 --detach --name node-app-tp1 node-app-tp1```