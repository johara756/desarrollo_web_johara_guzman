

// obtenemos los elementos a utilizar desde el HTML- (desde detalle-avistamiento)
let avistamientoId = document.getElementById("avistamiento-id").value;
let formularioComentario = document.getElementById("form-comentario");
let nombreComentario = document.getElementById("nombre-comentario");
let textoComentario = document.getElementById("texto-comentario");
let errorComentario = document.getElementById("error-comentario");
let listaComentarios = document.getElementById("lista-comentarios");


// mostramos los comentarios obtenidos desde Flask
let mostrarComentarios = (comentarios) => {

    // eliminamos los comentarios que estaban mostrados anteriormente para que no se dupliquen
    while (listaComentarios.firstChild) {
        listaComentarios.removeChild(listaComentarios.firstChild);
    }

    // mostramos un mensaje cuando no existe un comentario
    if (comentarios.length === 0) {
        let mensaje = document.createElement("p");
        mensaje.innerText = "No hay comentarios para este avistamiento.";
        listaComentarios.append(mensaje);
        return;
    }

    // mostrar cada comentario
    for (let comentario of comentarios) {

        let contenedor = document.createElement("div");
        contenedor.className = "comentario";

        // juntamos en un texto sin formato la fecha y el nombre de quien puso el comentario
        let datosComentario = document.createElement("p");
        datosComentario.innerText =
            comentario.fecha + " - " + comentario.nombre;

        let texto = document.createElement("p");
        texto.innerText = comentario.texto;

        //pone ambos parrafos dentro del div
        contenedor.append(datosComentario);
        contenedor.append(texto);

        //se agrega al HTML
        listaComentarios.append(contenedor);
    }
};


// obtenemos los comentarios desde Flask
let cargarComentarios = () => {

    fetch(`${window.origin}/comentarios/${avistamientoId}`)
        .then((response) => {

            if (!response.ok) {
                throw new Error("No se pudieron obtener los comentarios");
            }
            //si todo sale bien, esto convierte la respuesta en un objeto que javascript pueda utilizar
            return response.json();
        })
        .then((data) => {
            mostrarComentarios(data["data"]);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};


// validamos los datos antes de que sean enviados
let validarComentario = (nombre, texto) => {
    // || es un o 
    if (nombre.length < 3 || nombre.length > 50) {
        return "El nombre debe tener entre 3 y 50 caracteres.";
    }

    if (texto.length < 5) {
        return "El comentario debe tener al menos 5 caracteres.";
    }

    // la tabla comentario permite como max 300 caracteres
    if (texto.length > 300) {
        return "El comentario debe tener máximo 300 caracteres.";
    }

    // si no se encuentran errores, devuelve un texto vacio
    return "";
};


// enviamos el nuevo comentario a Flask. Luego de apretar el "Agregar comentario"
let agregarComentario = (event) => {

    // evitamos que el formulario recargue la pagina, dado que se pide hacerlo de manera asíncrona
    event.preventDefault();

    //obtenemos lo que escribio el usuario
    let nombre = nombreComentario.value.trim();
    let texto = textoComentario.value.trim();

    //antes de validar, eliminamos cualquier mensaje de error de antes
    errorComentario.innerText = "";

    // validamos los datos
    let error = validarComentario(nombre, texto);

    if (error !== "") {
        errorComentario.innerText = error;
        return;
    }

    // si todo esta bien: 
    fetch(`${window.origin}/comentarios/${avistamientoId}`, {
        method: "POST", // post para enviar datos
        body: JSON.stringify({
            nombre: nombre,
            texto: texto
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {

            // si Flask encuentra un error 
            if (data["status"] !== "ok") {
                errorComentario.innerText = data["mensaje"];
                return;
            }

            // limpiamos el formulario
            formularioComentario.reset();

            // actualizamos el listado sin recargar la pagina
            cargarComentarios();
        })
        .catch((error) => {
            console.error("Error:", error);
            errorComentario.innerText =
                "No se pudo agregar el comentario.";
        });
};


// enviamos el comentario cuando se hace submit
formularioComentario.addEventListener(
    "submit",
    agregarComentario
);


// cargamos los comentarios cuando se abre la pagina
cargarComentarios();