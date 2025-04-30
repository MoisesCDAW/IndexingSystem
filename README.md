DEPENDENCIAS

1. JDK 17 o superior
2. Maven v3.9.9 o superior
3. Node JS v22.14.0 o superior


DESPLIEGUE

Ejecutar desde la raíz del proyecto:

1. ./scripts/build_mac.sh
    * Esto ejecutará los test y creará el .jar del programa
    * Los resultados de las pruebas se pueden ver en: backend/target/site/jacoco/index.html

2. java -jar backend/target/IndexingSystem-1.0.0.jar
    * Para levantar el servicio, el cual usará el puerto 80
    * "http://localhost"


ENDPOINTS

Ruta base: localhost:80/IndexingSystem/api/v1

1. GET /api/v1/content
    * Devuelve todas las páginas que fueron indexadas

2. GET /api/v1/content/url
    * Formato: {"url": "https://www.example.com"}
    * Para poder buscar una URl en la base de datos

3. POST /api/v1/content/check
    * Formato: {"url": "https://www.example.com", "words": ["una", "palabra"]}
    * Permite validar el contenido de una URL buscando que las palabras pasadas en la 
      petición no se encuentren para poder ser indexadas

4. DELETE /api/v1/content
    * Formato: {"url": "https://www.example.com"}
    * Elimina una URL de la base de datos