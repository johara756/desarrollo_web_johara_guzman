## Consideraciones para la corrección

- Se consideró que para registrar un avistamiento, el usuario debe registrarse previamente como voluntario. Por esta razón, al completar correctamente el formulario de registro se muestra un enlace directo al formulario de avistamiento. Sin embargo, también se dejó visible la opción Registrar avistamiento en la barra de navegación de las demás páginas, considerando que un usuario ya registrado puede revisar el listado o las estadísticas y luego querer registrar un nuevo avistamiento sin tener que volver a pasar por el formulario de registro.

(Al tratarse de un prototipo sin almacenamiento de datos, no se implementó un control de sesión para distinguir entre usuarios registrados y no registrados.)

- Para voluntarios, avistamientos y estadísticas se agregaron de manera manual datos ficticios de voluntarios, dado que la tarea es prototipo y no requiere guardar los datos.

- Para el registro de aves se utilizó una clasificación por grupo y especie, tomando como referencia eBird Chile. Al seleccionar un grupo, se muestran solamente las especies correspondientes y no se consideró el nombre cientifico de la especie por simplicidad. 

https://ebird.org/home?continue

- La cantidad de individuos observados debe ser un número entero entre 1 y 1000, con el fin de evitar valores inválidos o poco razonables.

- Se definió que la fecha del avistamiento no puede ser futura ni tener una antigüedad mayor a un año. Si el avistamiento corresponde al día actual, tampoco se permite ingresar una hora futura.

- El campo de comentarios es opcional pero tiene un limite de palabras, para evitar que un usuario ingrese un comentario más largo de lo necesario. 

- El listado de avistamientos permite filtrar por grupo de ave, ordenar por fecha o lugar y se decidio mostrar 3 registros por página. Esto es con el fin de poder probar el paso entre paginas y que no fuera necesario agregar tantos datos ficticios. 

## Ejecución

Abrir `index.html` en un navegador web para iniciar el sistema.