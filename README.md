-Para esta tarea se implemento lo pedido y se utilizo la misma base de datos de la tarea 2, por lo que se mantiene los datos de voluntarios y avistamientos que ya estaban refistrados. 

-Se agrego la tabla nota utilizando lo que se entrego en la tarea y los datos de conexión a la base de datos, son los mismo que en la tarea 2

Consideraciones: 
-La búsqueda no distingue entre mayúsculas y minúsculas, pero es sensible a los tildes.

-Las notas aceptadas son números enteros entre el 1 y el 7.

-El promedio de notas se actualiza mediante solicitud asíncrona, por lo que no es necesario recargar la página. 

-El voluntario que tiene nota, es aquel que se llama Luciano

Ejecuación: 

Para ejecutar la aplicación, desde la carpeta donde se encuentra pom.xml se debe utilizar:

.\mvnw.cmd spring-boot:run

Luego se puede acceder desde:

http://localhost:8080/

Como consideración, el proyecto quedó guardado dentro de tarea4_java/tarea4, por lo que para ejecutarlo es necesario entrar primero a la carpeta tarea4, donde se encuentra el archivo pom.xml.