// validación de selección

const validarSeleccion = (seleccion) => {

    if (!seleccion) return false;

    return true;
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
    fechaMinima.setFullYear(fechaActual.getFullYear() - 4);

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

    let voluntario = document.getElementById("voluntario").value;
    let ave = document.getElementById("ave").value;
    let region = document.getElementById("region").value;
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


    if (!validarSeleccion(voluntario)) {
        agregarInvalido("Voluntario");
    }

    if (!validarSeleccion(ave)) {
        agregarInvalido("Ave");
    }

    if (!validarSeleccion(region)) {
        agregarInvalido("Región");
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

    valList.textContent = "";

    // mostrar campos que falta por completar
    if (!esValido) {
        for (let error of camposInvalidos) {
            let li = document.createElement("li");
            li.innerText = error;
            valList.append(li);
        }

        valBox.hidden = false;
    } else {
        // oculta los errores
        valBox.hidden = true;

        // envio del formulario
        document.getElementById("form-avistamiento").submit();
    }

};


// ejecuta validación
document.getElementById("avistamiento-btn")
    .addEventListener("click", validarFormularioAvistamiento);