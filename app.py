#render_template sirve para mostrar un archivo html de la carpeta templates
from flask import Flask, render_template, request, url_for, redirect

#importamos el db dado que ahi esta figurada la conexion con la base de datos
#y definidos los modelos SQLAlchemy
from database import db

from datetime import datetime
import re
import os
import uuid
import filetype

#crear aplicacion
app = Flask(__name__)

# carpeta en donde se guardaran las fotos y videos
UPLOAD_FOLDER = "static/uploads"

# crea la carpeta en caso de que no exista
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ruta pagina de inicio
@app.route("/")
def index():
    database = db.SessionLocal()

    # obtenemos el mensaje enviado mediante la URL
    mensaje = request.args.get("mensaje")

    # obtenemos los dos ultimos avistamientos agregados
    ultimos_avistamientos = database.query(db.Avistamiento).order_by(
        db.Avistamiento.id.desc()
    ).limit(2).all()

    respuesta = render_template(
        "index.html",
        mensaje=mensaje,
        ultimos_avistamientos=ultimos_avistamientos
    )
    database.close()
    return respuesta


# ruta del registro de voluntario
@app.route("/registro-voluntario", methods=["GET", "POST"])
def registro_voluntario():
    database = db.SessionLocal()

    # obtenemos las regiones de la tabla region y la guardamos en la var
    regiones = database.query(db.Region).all()

    #obtenemos las comunas de la tabla comuna
    comunas = database.query(db.Comuna).all()

    # listamos los errores encontrados en Flask
    errores = []

    # indica si el formulario esta bien registrado
    registro_exitoso = False

    # si el formulario fue enviado
    if request.method == "POST":
        # obtenemos los datos enviados desde el formulario
        nombre = request.form["nombre"].strip()
        apellido = request.form["apellido"].strip()
        email = request.form["email"].strip()
        celular = request.form["celular"].strip()
        region = request.form["region"]
        comuna = request.form["comuna"]

        # validación de nombre
        if len(nombre) < 3:
            errores.append("Nombres")

        # validación de apellido
        if len(apellido) < 3:
            errores.append("Apellidos")

        # validación email
        formato_email = r"^[^\s@]+@([^\s@]{2,}\.)+[a-zA-Z]{2,}$"
        if not re.match(formato_email, email):
            errores.append("Email")

        # validación del celular
        formato_telefono = r"^\+569[0-9]{8}$"
        if not re.match(formato_telefono, celular):
            errores.append("Teléfono Móvil")

        # validación de región
        if region == "" or not region.isdigit():
            errores.append("Región")

        # validación de comuna
        if comuna == "" or not comuna.isdigit():
            errores.append("Comuna")

        # si no hay errores, guardamos al voluntario
        if len(errores) == 0:
            # la tabla tiene un solo campo nombre, por lo que unimos nombre y apellido
            nombre_completo = nombre + " " + apellido

            nuevo_voluntario = db.Voluntario(
                nombre=nombre_completo,
                email=email,
                telefono=celular,
                fecha_registro=datetime.now(),
                comuna_id=int(comuna)
            )

            try:
                database.add(nuevo_voluntario)
                database.commit()
                registro_exitoso = True
            except Exception as e:
                database.rollback()
                errores.append("No se pudo registrar al voluntario")

    #pasar informacion de las regiones y comunas desde python al html.
    respuesta = render_template(
        "registro-voluntario.html",
        regiones=regiones, #HTML=python
        comunas=comunas,
        errores=errores,
        registro_exitoso=registro_exitoso
    )

    #cierra la sesion
    database.close()
    return respuesta


# ruta del registro de avistamiento
@app.route("/registro-avistamiento", methods=["GET", "POST"])
def registro_avistamiento():
    database = db.SessionLocal()

    # obtenemos datos de la base de datos
    voluntarios = database.query(db.Voluntario).all()
    aves = database.query(db.Ave).all()
    regiones = database.query(db.Region).all()
    comunas = database.query(db.Comuna).all()

    # guardamos los errores encontrados en Flask
    errores = []

    # si el formulario fue enviado
    if request.method == "POST":
        # obtenemos los datos enviados desde el formulario
        voluntario = request.form["voluntario"]
        ave = request.form["ave"]
        region = request.form["region"]
        comuna = request.form["comuna"]
        lugar = request.form["lugar"].strip()
        fecha = request.form["fecha"]
        hora = request.form["hora"]
        observaciones = request.form["observaciones"].strip()

        # obtenemos todos los archivos enviados
        archivos = request.files.getlist("archivo")

        # validación del voluntario
        if voluntario == "" or not voluntario.isdigit():
            errores.append("Voluntario")
        else:
            voluntario_bd = database.query(db.Voluntario).filter(
                db.Voluntario.id == int(voluntario)
            ).first()
            if voluntario_bd is None:
                errores.append("Voluntario")

        # validación del ave
        if ave == "" or not ave.isdigit():
            errores.append("Ave")
        else:
            ave_bd = database.query(db.Ave).filter(
                db.Ave.id == int(ave)
            ).first()
            if ave_bd is None:
                errores.append("Ave")

        # validación de región
        if region == "" or not region.isdigit():
            errores.append("Región")
            region_bd = None
        else:
            region_bd = database.query(db.Region).filter(
                db.Region.id == int(region)
            ).first()
            if region_bd is None:
                errores.append("Región")

        # validación de comuna
        if comuna == "" or not comuna.isdigit():
            errores.append("Comuna")
            comuna_bd = None
        else:
            comuna_bd = database.query(db.Comuna).filter(
                db.Comuna.id == int(comuna)
            ).first()
            if comuna_bd is None:
                errores.append("Comuna")

        # verificamos que la comuna pertenezca a la region seleccionada
        if region_bd is not None and comuna_bd is not None:
            if comuna_bd.region_id != region_bd.id:
                errores.append("Comuna")

        # validación del lugar
        if len(lugar) < 3:
            errores.append("Lugar específico")

        # validación de fecha y hora
        fecha_hora_avistamiento = None
        try:
            fecha_hora_avistamiento = datetime.strptime(
                fecha + " " + hora,
                "%Y-%m-%d %H:%M"
            )
            fecha_actual = datetime.now()
            fecha_minima = fecha_actual.replace(year=fecha_actual.year - 4)

            if fecha_hora_avistamiento > fecha_actual:
                errores.append("La fecha y hora del avistamiento no pueden estar en el futuro")
            elif fecha_hora_avistamiento < fecha_minima:
                errores.append("Fecha del Avistamiento")
        except ValueError:
            errores.append("Fecha u Hora del Avistamiento")

        # validación de los comentarios
        if observaciones:
            palabras = observaciones.split()
            if len(palabras) > 200:
                errores.append("Comentarios: máximo 200 palabras")

        # validación de archivos
        if len(archivos) == 0 or archivos[0].filename == "":
            errores.append("Foto o Video")
        else:
            for archivo in archivos:
                # leemos una parte del archivo para conocer su tipo real
                contenido = archivo.read(261)

                # volvemos al comienzo para poder guardarlo despues
                archivo.seek(0)
                tipo = filetype.guess(contenido)

                if tipo is None:
                    errores.append("Foto o Video")
                    break

                if not (tipo.mime.startswith("image/") or tipo.mime.startswith("video/")):
                    errores.append("Foto o Video")
                    break

        # si no hay errores guardamos el avistamiento
        if len(errores) == 0:
            # construimos el lugar completo usando los datos seleccionados
            lugar_completo = lugar + ", " + comuna_bd.nombre + ", " + region_bd.nombre

            nuevo_avistamiento = db.Avistamiento(
                voluntario_id=int(voluntario),
                ave_id=int(ave),
                fecha_hora=fecha_hora_avistamiento,
                lugar=lugar_completo,
                descripcion=observaciones
            )

            try:
                database.add(nuevo_avistamiento)

                # flush permite obtener el id antes del commit
                database.flush()

                # guardamos cada archivo
                for archivo in archivos:
                    contenido = archivo.read(261)
                    archivo.seek(0)
                    tipo = filetype.guess(contenido)

                    # nombre creado para evitar archivos repetidos
                    nombre_seguro = uuid.uuid4().hex + "." + tipo.extension

                    # ruta utilizada para guardar el archivo
                    ruta_guardado = os.path.join(UPLOAD_FOLDER, nombre_seguro)
                    archivo.save(ruta_guardado)

                    # ruta que se guarda en la base de datos
                    ruta_archivo = "uploads/" + nombre_seguro

                    nuevo_registro = db.Registro(
                        ruta_archivo=ruta_archivo,
                        nombre_archivo=archivo.filename,
                        avistamiento_id=nuevo_avistamiento.id
                    )
                    database.add(nuevo_registro)

                database.commit()
                database.close()
                return redirect(
                    url_for("index", mensaje="Avistamiento registrado correctamente.")
                )

            except Exception as e:
                database.rollback()
                errores.append("No se pudo registrar el avistamiento")

    # mostramos nuevamente el formulario
    respuesta = render_template(
        "registro-avistamiento.html",
        voluntarios=voluntarios,
        aves=aves,
        regiones=regiones,
        comunas=comunas,
        errores=errores
    )
    database.close()
    return respuesta


# ruta listado de avistamientos
@app.route("/listado-avistamientos")
def listado_avistamientos():
    database = db.SessionLocal() #abrir sesión con la base de datos

    # obtenemos los filtros enviados mediante la URL
    filtro_ave = request.args.get("ave", "")
    orden = request.args.get("orden", "fecha-reciente")
    pagina = request.args.get("pagina", "1") #inicialmente parte en la pagina 1

    # verificamos que el numero de pagina sea valido
    if not pagina.isdigit() or int(pagina) < 1:
        pagina = 1
    else:
        pagina = int(pagina)

    # cantidad de avistamientos mostrados por pagina
    por_pagina = 5

    # obtenemos los avistamientos desde la base de datos
    consulta = database.query(db.Avistamiento)

    # filtramos por ave. En caso de que el filtro este vacio, se muestran todos los avistamientos
    if filtro_ave.isdigit():
        consulta = consulta.filter(db.Avistamiento.ave_id == int(filtro_ave))

    # ordenamos/filtramos los avistamientos
    if orden == "fecha-antigua":
        consulta = consulta.order_by(db.Avistamiento.fecha_hora.asc())
    elif orden == "lugar-az":
        consulta = consulta.order_by(db.Avistamiento.lugar.asc())
    elif orden == "lugar-za":
        consulta = consulta.order_by(db.Avistamiento.lugar.desc())
    else:
        orden = "fecha-reciente"
        consulta = consulta.order_by(db.Avistamiento.fecha_hora.desc())

    # cant total de avistamientos encontrados despues de aplicar el filtro
    total_avistamientos = consulta.count()

    # calculamos la cant de paginas
    total_paginas = (total_avistamientos + por_pagina - 1) // por_pagina

    # si no existen avistamientos dejamos una pagina
    if total_paginas == 0:
        total_paginas = 1

    # evitamos solicitar una pagina que no existe (si la pide un usuario en la URL)
    if pagina > total_paginas:
        pagina = total_paginas

    # calculamos desde que registro comienza la pagina
    inicio = (pagina - 1) * por_pagina

    # obtenemos solamente los registros de la pagina actual
    avistamientos = consulta.offset(inicio).limit(por_pagina).all()

    # obtenemos las aves para mostrarlas en el filtro
    aves = database.query(db.Ave).all()

    #mandamos los datos al HTML
    respuesta = render_template(
        "listado-avistamientos.html",
        avistamientos=avistamientos,
        aves=aves,
        filtro_ave=filtro_ave,
        orden=orden,
        pagina=pagina,
        total_paginas=total_paginas
    )
    database.close()
    return respuesta


#ruta para mostrar el detalle de un avistamiento
@app.route("/detalle-avistamiento/<int:avistamiento_id>")
def detalle_avistamiento(avistamiento_id):
    database = db.SessionLocal()

    # buscamos el id en la tabla avistamiento
    avistamiento = database.query(db.Avistamiento).filter(
        db.Avistamiento.id == avistamiento_id
    ).first()

    # si el avistamiento no existe, volvemos al listado
    if avistamiento is None:
        database.close()
        return redirect(url_for("listado_avistamientos"))

    # mostramos la info del avistamiento
    respuesta = render_template("detalle-avistamiento.html", avistamiento=avistamiento)

    database.close()
    return respuesta


if __name__ == "__main__":
    app.run(debug=True)