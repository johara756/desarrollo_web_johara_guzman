## Consideraciones para la corrección

- Se consideró que para registrar un avistamiento, el usuario debe registrarse previamente como voluntario. Por esta razón, al completar correctamente el formulario de registro se muestra un enlace directo al formulario de avistamiento. Sin embargo, también se dejó visible la opción Registrar avistamiento en la barra de navegación de las demás páginas, considerando que un usuario ya registrado puede revisar el listado o las estadísticas y luego querer registrar un nuevo avistamiento sin tener que volver a pasar por el formulario de registro.

- Los voluntarios registrados se almacenan en la base de datos, por lo que, al registrar un avistamiento, se puede seleccionar uno de los voluntarios anteriormente registrado.

- Para el registro de avistamientos se directamente con las aves disponibles en la base de datos. Por esto, se elimino la selección de grupo de ave (antes usado en la tarea 1) y se utilizo directamente la especie. 

- A su vez tambien se elimino la cantidad de especies observada que tenia en la tarea 1, dado que las tablas entregadas no tenían esta columna. 


- Se definió que la fecha del avistamiento no puede ser futura ni tener una antigüedad mayor a un año. Si el avistamiento corresponde al día actual, tampoco se permite ingresar una hora futura.

- El campo de comentarios es opcional pero tiene un limite de palabras, para evitar que un usuario ingrese un comentario más largo de lo necesario. 

- El listado de avistamientos permite filtrar por ave, ordenar por fecha o lugar y se decidio mostrar  5 registros por página. Esto es con el fin de poder probar el paso entre paginas y que no fuera necesario agregar tantos datos ficticios. 

- Cada avistamiento debe incluir al menos una fotografía o video. Los archivos son validados antes de ser almacenados y se guardan en la carpeta `static/uploads`. 

- En la portada se muestran los últimos dos avistamientos agregados a la base de datos. Para determinar cuáles fueron los últimos registros se utiliza el identificador del avistamiento y no la fecha en que fue observado, ya que un avistamiento antiguo puede haber sido ingresado recientemente.

- La opción Estadísticas se mantiene visible en la barra de navegación, pero su funcionalidad no fue implementada, tal y como se indica en las intrucciones de la tarea. 



## Ejecución

Ejecutar el archivo `app.py` desde la carpeta principal del proyecto: `py app.py`