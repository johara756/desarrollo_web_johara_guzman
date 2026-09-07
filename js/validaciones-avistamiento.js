// validación de selección

const validarSeleccion = (seleccion) => {

    if (!seleccion) return false;

    return true;
};


// validación de cantidad de individuos observados 
// la cantidad debe ser mayor a 0 y menor o igual a 1000, para evitar que un usuario ingrese una cantidad sin sentido
const validarCantidad = (cantidad) => {

    if (!cantidad) return false;

    let numero = Number(cantidad);

    let cantidadValida =
        numero >= 1 &&
        numero <= 1000 &&
        numero % 1 === 0;

    return cantidadValida;
};

// validación del lugar
const validarLugar = (lugar) => {

    if (!lugar) return false;

    let largoValido = lugar.trim().length >= 3;

    return largoValido;
};

// validación de la fecha de la observación
const validarFecha = (fecha) => {

    if (!fecha) return false;

    let fechaAvistamiento = new Date(fecha);
    let fechaActual = new Date();

    let fechaMinima = new Date();
    fechaMinima.setFullYear(fechaActual.getFullYear() - 1);

    let fechaValida =
        fechaAvistamiento <= fechaActual &&
        fechaAvistamiento >= fechaMinima;

    return fechaValida;
};

// validación de la hora
const validarHora = (hora) => {
    if (!hora) return false;

    return true;
};

//validación de fecha y hora en conjunto, para que no se pueda poner una hora mayor a la hora
//en que esta registrando el avistamiento (suponiendo que es un avistamiento del mismo dia)
const validarFechaHora = (fecha, hora) => {

    if (!fecha || !hora) return false;

    let fechaHoraAvistamiento = new Date(fecha + "T" + hora);
    let fechaHoraActual = new Date();

    let fechaHoraValida =
        fechaHoraAvistamiento <= fechaHoraActual;

    return fechaHoraValida;
};

// validación de foto o video
const validarArchivos = (archivos) => {

    if (!archivos || archivos.length === 0) return false;

    for (let archivo of archivos) {

        let tipoValido =
            archivo.type.startsWith("image/") ||
            archivo.type.startsWith("video/");

        if (!tipoValido) return false;
    }

    return true;
};
//campo opcional, pero no puede superar las 200 palabras
const validarObservaciones = (observaciones) => {

    if (!observaciones) return true;
    let palabras = observaciones.trim().split(/\s+/);
    return palabras.length <= 200;
};

// validación formulario completo
const validarFormularioAvistamiento = () => {

    // obtener valores que fueron ingresados al formulario

    let grupo = document.getElementById("grupo-ave").value;
    let especie = document.getElementById("especie").value;
    let cantidad = document.getElementById("cantidad").value;
    let region = document.getElementById("region").value;
    let provincia = document.getElementById("provincia").value;
    let comuna = document.getElementById("comuna").value;
    let lugar = document.getElementById("lugar").value;
    let fecha = document.getElementById("fecha").value;
    let hora = document.getElementById("hora").value;
    let archivos = document.getElementById("archivo").files;
    let observaciones = document.getElementById("observaciones").value;

    // guardar los errore
    let camposInvalidos = [];
    let esValido = true;

    // agregar los campos invalidos
    const agregarInvalido = (campo) => {
        camposInvalidos.push(campo);
        esValido = false;
    };


    if (!validarSeleccion(grupo)) {
        agregarInvalido("Grupo de Ave");
    }

    if (!validarSeleccion(especie)) {
        agregarInvalido("Especie");
    }

    if (!validarCantidad(cantidad)) {
        agregarInvalido("Cantidad de individuos");
    }

    if (!validarSeleccion(region)) {
        agregarInvalido("Región");
    }

    if (!validarSeleccion(provincia)) {
        agregarInvalido("Provincia");
    }

    if (!validarSeleccion(comuna)) {
        agregarInvalido("Comuna");
    }

    if (!validarLugar(lugar)) {
        agregarInvalido("Lugar específico");
    }

    if (!validarFecha(fecha)) {
        agregarInvalido("Fecha del Avistamiento");
    }

    if (!validarHora(hora)) {
        agregarInvalido("Hora del Avistamiento");
    }
    if (validarFecha(fecha) && validarHora(hora)) {

    if (!validarFechaHora(fecha, hora)) {
        agregarInvalido("La fecha y hora del avistamiento no pueden estar en el futuro");
    }
}

    if (!validarArchivos(archivos)) {
        agregarInvalido("Foto o Video");
    }

    if (!validarObservaciones(observaciones)) {
        agregarInvalido("Comentarios: máximo 200 palabras");
    }


    let valBox = document.getElementById("val-box-avistamiento");
    let valList = document.getElementById("val-list-avistamiento");
    let successBox = document.getElementById("success-box-avistamiento");
    valList.textContent = "";


    // mostrar campos que falta por completar
    if (!esValido) {
        for (let error of camposInvalidos) {
            let li = document.createElement("li");
            li.innerText = error;
            valList.append(li);
        }

        valBox.hidden = false;
        successBox.hidden = true;
    } else {

        valBox.hidden = true;
        successBox.hidden = false;
    }

};


// ejecuta validación
document.getElementById("avistamiento-btn")
    .addEventListener("click", validarFormularioAvistamiento);