PASOS DESPUÉS DEL CLONADO

1. mvn clean install
    * Esto ejecutará los test y creará el .jar del programa
    * Los resultados de las pruebas se pueden ver en: target/site/jacoco/index.html

2. java -jar target/IndexingSystem-1.0.0.jar
    * Para levantar el servicio, el cual usará el puerto 80