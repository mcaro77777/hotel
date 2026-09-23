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

## Experiencia actual

- Catálogo de siete alojamientos con filtros combinados de tipo y capacidad, tarifas y detalles de camas/equipamiento.
- Galerías con ampliación, navegación por teclado y deslizamiento táctil en las tarjetas.
- Consulta de un alojamiento con fechas, adultos y niños. Valida capacidad y fechas, calcula noches y un total referencial en CLP.
- Resumen editable antes de abrir WhatsApp o correo con el mensaje completo. El visitante decide si lo envía en la aplicación elegida.
- Sección «Tu estadía» con búsqueda de la dirección en Maps, coordinación de llegada y ayuda por WhatsApp.
- Diseño adaptable, acceso rápido en móvil, preguntas frecuentes y movimiento reducido según preferencias del dispositivo.

No consulta disponibilidad en tiempo real, no cobra ni confirma reservas. «Tu estadía» es una guía pública de ayuda, no un portal privado con información de reservas. No almacena datos del visitante ni utiliza analítica o cookies.

Las fotografías de las cabañas provienen del material entregado por Aorangi Hare y se sirven desde `images/`. El hostal utiliza tarjetas gráficas hasta contar con fotografías verificadas de esas habitaciones.

## Datos que requieren confirmación antes de publicar

- Confirmar que el número de contacto publicado atiende WhatsApp.
- Revisar tarifas, capacidades, distribución de camas y dirección con el alojamiento.
- Añadir horarios y condiciones definitivas de pagos, modificaciones y cancelación cuando se proporcionen.
- Completar el dominio público en `sitemap.xml`, `robots.txt`, canonical y la imagen social con URL absoluta. No se inventó un dominio.
- Agregar reseñas únicamente con contenido real y su fuente verificable.

## Validación del rediseño

Se verificaron sintaxis JavaScript, estructura HTML, sintaxis CSS, archivos referenciados, anclas y comportamiento en un DOM simulado: filtros, selección, capacidad, fechas inválidas, años bisiestos, cálculo de noches/total, edición, mensajes de WhatsApp/correo, galería y menú.

La revisión visual en un navegador real queda pendiente: la herramienta de navegador bloqueó la apertura del archivo local. El DOM simulado no comprueba disposición, apariencia, selector nativo de fechas ni apertura real de aplicaciones externas.
