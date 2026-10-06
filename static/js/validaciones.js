// validación de nombre y apellido

const validarNombre = (nombre) => {

    if (!nombre) return false;
    let largoValido = nombre.trim().length >= 3;  // para aceptar el nombre Ana
    return largoValido;

};


// validación del email: se deja de esta manera para que acepte email tipo: @uchile.cl , con al menos 2 caracteres luego del punto.
const validarEmail = (email) => {

    if (!email) return false;

    let formatoValido =
        /^[^\s@]+@([^\s@]{2,}\.)+[a-zA-Z]{2,}$/.test(email);

    return formatoValido;

};


// validación del número celular. 

// se deja como fijo el código del país (+56), junto con exigir que parta con 9 y luego 8 dígitos. 

const validarTelefono = (telefono) => {

    if (!telefono) return false;

    let formatoValido =
        /^\+569[0-9]{8}$/.test(telefono.trim());

    return formatoValido;

};

const validarSeleccion = (seleccion) => {

    if (!seleccion) return false;

    return true;

};


// validación del formulario completo
const validarFormulario = () => {

    // obtener los valores ingresados al formulario
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let email = document.getElementById("email").value;
    let celular = document.getElementById("celular").value;
    let region = document.getElementById("region").value;
    let comuna = document.getElementById("comuna").value;

    // guardar los errores
    let camposInvalidos = [];
    let esValido = true;

    // agregar los campos invalidos
    const agregarInvalido = (campo) => {

        camposInvalidos.push(campo);
        esValido = false;

    };

    if (!validarNombre(nombre)) {
        agregarInvalido("Nombres");
    }

    if (!validarNombre(apellido)) {
        agregarInvalido("Apellidos");
    }

    if (!validarEmail(email)) {
        agregarInvalido("Email");
    }

    if (!validarTelefono(celular)) {
        agregarInvalido("Teléfono Móvil");
    }

    if (!validarSeleccion(region)) {
        agregarInvalido("Región");
    }

    if (!validarSeleccion(comuna)) {
        agregarInvalido("Comuna");
    }

    let valBox = document.getElementById("val-box");
    let valList = document.getElementById("val-list");
    let successBox = document.getElementById("success-box");

    valList.textContent = "";


// mostrar campos que no han sido completados o fueron completados con error.

    if (!esValido) {

        for (let error of camposInvalidos) {
            let li = document.createElement("li");
            li.innerText = error;
            valList.append(li);
        }

        valBox.hidden = false;

        successBox.hidden = true;

    } else {

        // oculta los errores 
        valBox.hidden = true;
         // envio de el formulario
        document.getElementById("form-voluntario").submit();

    }
    return esValido;
    };


// recuperamos el boton que envia el form
let submitBtn = document.getElementById("registro-btn");

// ejecuta la validación luego de apretar el boton. 
submitBtn.addEventListener("click", validarFormulario);