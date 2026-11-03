#render_template sirve para mostrar un archivo html de la carpeta templates
from flask import Flask, request, render_template, redirect, url_for, jsonify

#importamos el db dado que ahi esta figurada la conexion con la base de datos
#y definidos los modelos SQLAlchemy
from database import db
from sqlalchemy import func
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


# ruta para obtener los comentarios asociados a un avistamiento
@app.route("/comentarios/<int:avistamiento_id>", methods=["GET"])
def obtener_comentarios(avistamiento_id):
    database = db.SessionLocal()

    # verificar que el avistamiento exista
    avistamiento = database.query(db.Avistamiento).filter(
        db.Avistamiento.id == avistamiento_id
    ).first()

    if avistamiento is None:
        database.close()
        return jsonify({
            "status": "error",
            "data": []
        }), 404

    # obtenemos  comentarios asociados al avistamiento
    comentarios = database.query(db.Comentario).filter(
        db.Comentario.avistamiento_id == avistamiento_id
    ).order_by(db.Comentario.fecha.asc()).all()

    # guardamos los datos que enviaremos a Javascript
    datos = []

    for comentario in comentarios:
        datos.append({
            "id": comentario.id,
            "nombre": comentario.nombre,
            "texto": comentario.texto,
            "fecha": comentario.fecha.strftime("%d-%m-%Y %H:%M")
        })

    database.close()

    return jsonify({
        "status": "ok",
        "data": datos
    })


#get -> pedir comentario
#post-> guardar comentario 

# ruta para guardar un comentario
@app.route("/comentarios/<int:avistamiento_id>", methods=["POST"])
def guardar_comentario(avistamiento_id):
    database = db.SessionLocal()

    # verificamos que el avistamiento exista
    avistamiento = database.query(db.Avistamiento).filter(
        db.Avistamiento.id == avistamiento_id
    ).first()

    if avistamiento is None:
        database.close()
        return jsonify({
            "status": "error",
            "mensaje": "El avistamiento no existe"
        }), 404

    # obtenemos los datos enviados desde Javascript
    data = request.get_json()

    if data is None:
        database.close()
        return jsonify({
            "status": "error",
            "mensaje": "Datos inválidos"
        }), 400

    # se deja con "", para que en caso de que se intente mandar un json sintexto, esto quede vacio y falle la validación
    nombre = data.get("nombre", "").strip()
    texto = data.get("texto", "").strip()

    # validamos el nombre
    if len(nombre) < 3 or len(nombre) > 50:
        database.close()
        return jsonify({
            "status": "error",
            "mensaje": "El nombre debe tener entre 3 y 50 caracteres"
        }), 400
    
    #validamos el comentario
    if len(texto) < 5 or len(texto) > 300:
        database.close()
        return jsonify({
            "status": "error",
            "mensaje": "El comentario debe tener entre 5 y 300 caracteres"
        }), 400

    # crear el comentario
    nuevo_comentario = db.Comentario(
        nombre=nombre,
        texto=texto,
        fecha=datetime.now(),
        avistamiento_id=avistamiento_id
    )

    try:
        database.add(nuevo_comentario)
        database.commit()

    except Exception as e:
        database.rollback()
        database.close()

        return jsonify({
            "status": "error",
            "mensaje": "No se pudo guardar el comentario"
        }), 500

    database.close()

    return jsonify({
        "status": "ok"
    })

# ruta para estadisticas
@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")


# ruta para obtener los datos que utilizaremos en los graficos 
@app.route("/datos-estadisticas", methods=["GET"])
def obtener_datos_estadisticas():

    database = db.SessionLocal()

    # cantidad de avistamientos registrados por dia
    consulta_dias = database.query(
        #para quedarnos solo con la fecha
        func.date(db.Avistamiento.fecha_hora),
        #contamos cant de id por avistamientos
        func.count(db.Avistamiento.id)
        #agrupamos los registros por fecha y ordenamos 
    ).group_by(
        func.date(db.Avistamiento.fecha_hora)
    ).order_by(
        func.date(db.Avistamiento.fecha_hora)
    ).all()


    avistamientos_dia = []

    for fecha, total in consulta_dias:
        avistamientos_dia.append({
            "fecha": fecha.strftime("%Y-%m-%d"),
            "total": total
        })


    # cantidad de avistamientos registrados por ave
    consulta_aves = database.query(
        db.Ave.nombre,
        func.count(db.Avistamiento.id)
        #unimos las tablas
    ).join(
        db.Avistamiento,
        db.Avistamiento.ave_id == db.Ave.id
    ).group_by(
        db.Ave.id,
        db.Ave.nombre

        #ordenamos las aves alfabeticamente
    ).order_by(
        db.Ave.nombre.asc()
    ).all()


    avistamientos_ave = []

    for ave, total in consulta_aves:
        avistamientos_ave.append({
            "ave": ave,
            "total": total
        })


    # cantidad de voluntarios registrados por comuna
    consulta_comunas = database.query(
        db.Comuna.nombre,
        func.count(db.Voluntario.id)

     #unimos tablas
    ).join(
        db.Voluntario,
        db.Voluntario.comuna_id == db.Comuna.id
    ).group_by(
        db.Comuna.id,
        db.Comuna.nombre
    ).order_by(
        db.Comuna.nombre.asc()
    ).all()


    voluntarios_comuna = []

    for comuna, total in consulta_comunas:
        voluntarios_comuna.append({
            "comuna": comuna,
            "total": total
        })

#cerramos la sesión de datosgen
    database.close()


    return jsonify({
        "avistamientos_dia": avistamientos_dia,
        "avistamientos_ave": avistamientos_ave,
        "voluntarios_comuna": voluntarios_comuna
    })



if __name__ == "__main__":
    app.run(debug=True)
