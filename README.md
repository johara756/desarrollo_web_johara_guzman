## Consideraciones para la corrección

- Se consideró que para registrar un avistamiento, el usuario debe registrarse previamente como voluntario. Por esta razón, al completar correctamente el formulario de registro se muestra un enlace directo al formulario de avistamiento. Sin embargo, también se dejó visible la opción Registrar avistamiento en la barra de navegación de las demás páginas, considerando que un usuario ya registrado puede revisar el listado o las estadísticas y luego querer registrar un nuevo avistamiento sin tener que volver a pasar por el formulario de registro.

- Los voluntarios registrados se almacenan en la base de datos, por lo que, al registrar un avistamiento, se puede seleccionar uno de los voluntarios anteriormente registrado.

- Para el registro de avistamientos se trabajo directamente con las aves disponibles en la base de datos. Por esto, se elimino la selección de grupo de ave (antes usado en la tarea 1) y se utilizo directamente la especie. 

- A su vez tambien se elimino la cantidad de especies observada que tenia en la tarea 1, dado que las tablas entregadas no tenían esta columna. 


- Se definió que la fecha del avistamiento no puede ser futura ni tener una antigüedad mayor a cuatro años. Si el avistamiento corresponde al día actual, tampoco se permite ingresar una hora futura.


- El listado de avistamientos permite filtrar por ave, ordenar por fecha o lugar y se decidio mostrar  5 registros por página. Esto es con el fin de poder probar el paso entre paginas y que no fuera necesario agregar tantos datos ficticios. 

- Cada avistamiento debe incluir al menos una fotografía o video. Los archivos son validados antes de ser almacenados y se guardan en la carpeta `static/uploads`. 

- En la portada se muestran los últimos dos avistamientos agregados a la base de datos. Para determinar cuáles fueron los últimos registros se utiliza el id del avistamiento y no la fecha en que fue observado, ya que un avistamiento antiguo puede haber sido ingresado recientemente.

--TAREA 3--

- Se uncluye la posibilidad de agregar comentarios a los avistamientos ya resgistrados en la página. Estos comentarios se almacenan en una nueva tabla comentario y se utilizada el avistamiento_id para identificar a que avistamiento pertenece cada comentario.

-Los comentarios se obtienen y se agregan utilizando fetch() y la validación de estos se hace tanto en JavaScript como en Flask- 

-Para mostrar los comentarios se utiliza innertext 
para evitar entradas mal intencionadas, y en caso de que esto pase, el script no se ejecute y solo se muestre como texto.

-Se agrega una página de estadísticas que utiliza los datos almacenados en la base de datos. Para realizar conteos y agrupaciones se utilizan las funciones de SQLAlchemy. 

-Las estadísticas incluyen la cantidad de avistamientos por día, la cantidad de avistamientos por ave y la cantidad de voluntarios registrados por comuna.

-Para generar los gráficos se utilizó la biblioteca Highcharts, cargada mediante https://code.highcharts.com/highcharts.js.

## Ejecución

Ejecutar el archivo `app.py` desde la carpeta principal del proyecto: `py app.py`

En el navegador: http://127.0.0.1:5000 