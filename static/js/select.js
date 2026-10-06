// para guardar el select de región
const regionSelect = document.getElementById("region");
//para guardar el select de comuna
const comunaSelect = document.getElementById("comuna");

// obtenemos todas las comunas que vienen desde la base de datos
const opcionesComuna =
    comunaSelect.querySelectorAll("option[data-region]");


// cuando cambia la region seleccionada
regionSelect.addEventListener("change", () => {

    let regionId = regionSelect.value;

    // volvemos a la opcion inicial
    comunaSelect.value = "";

    for (let opcion of opcionesComuna) {

        // mostramos solo las comunas que pertenecen a la region seleccionada
        if (opcion.dataset.region === regionId) {
            opcion.hidden = false;
        } else {
            opcion.hidden = true;
        }
    }
});

