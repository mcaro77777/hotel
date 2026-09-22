# Aorangi Hare Rapa Nui

Sitio turístico estático construido con HTML, CSS y JavaScript nativos. No necesita Node.js ni un proceso de compilación en producción.

## Desarrollo local

Abre `index.html` directamente o sirve esta carpeta con cualquier servidor HTTP local.

Para validar la misma imagen usada en producción:

```sh
docker build -t iorana-rapa-nui .
docker run --rm -p 8080:80 iorana-rapa-nui
```

Luego abre `http://localhost:8080`.

## Despliegue en EasyPanel

1. Crea una aplicación conectada al repositorio `mcaro77777/hotel`.
2. Usa la rama `main` y la raíz `/` como directorio de construcción.
3. Selecciona despliegue mediante `Dockerfile`.
4. Expón el puerto `80`.
5. Asigna el dominio y activa HTTPS.
6. Actualiza `robots.txt`, `sitemap.xml` y el correo de contacto con los datos definitivos.

## Alcance actual

El buscador funciona localmente, valida la capacidad del alojamiento y prepara una consulta orientativa. No envía datos, no consulta disponibilidad en tiempo real y no genera reservas. El formulario de contacto también informa de forma explícita que el servicio de correo aún no está conectado.

Las fotografías de las cabañas provienen del material entregado por Aorangi Hare y se sirven desde `images/`, sin depender de proveedores externos.
