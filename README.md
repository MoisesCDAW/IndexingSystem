DESPLIEGUE

1. mvn clean install
    * Esto ejecutará los test y creará el .jar del programa
    * Los resultados de las pruebas se pueden ver en: target/site/jacoco/index.html

2. java -jar target/IndexingSystem-1.0.0.jar
    * Para levantar el servicio, el cual usará el puerto 80


ENDPOINTS

Ruta base: localhost:80/IndexingSystem/api/v1

1. GET /content
    * Devuelve todas las páginas que fueron indexadas

2. GET /content/url
    * Formato: {"url": "https://www.example.com"}
    * Para poder buscar una URl en la base de datos

3. POST /content/check
    * Formato: {"url": "https://www.example.com", "words": ["una", "palabra"]}
    * Permite validar el contenido de una URL buscando que las palabras pasadas en la 
      petición no se encuentren para poder ser indexadas

4. DELETE /content
    * Formato: {"url": "https://www.example.com"}
    * Elimina una URL de la base de datos