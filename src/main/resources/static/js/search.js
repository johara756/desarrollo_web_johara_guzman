let inputSearch = document.getElementById("search-input");
let searchResults = document.getElementById("search-results");


let evaluarAvistamiento = (avistamientoId, promedioElemento, resultado) => {

    let contenedorEvaluacion = document.createElement("div");

    let selectNota = document.createElement("select");

    for (let i = 1; i <= 7; i++) {

        let opcion = document.createElement("option");

        opcion.value = i;
        opcion.innerText = i;

        selectNota.appendChild(opcion);
    }


    let botonGuardar = document.createElement("button");

    botonGuardar.innerText = "Guardar nota";


    botonGuardar.addEventListener("click", () => {

        let notaSeleccionada =
            parseInt(selectNota.value);


        fetch(
            `${window.origin}/evaluar/${avistamientoId}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    nota: notaSeleccionada
                })
            }
        )

            .then((response) => {

                if (!response.ok) {

                    throw new Error(
                        "Error al guardar la nota"
                    );
                }

                return response.json();
            })

            .then((respuesta) => {

                promedioElemento.innerText =
                    "Nota: "
                    + respuesta.promedio.toFixed(1);

                contenedorEvaluacion.remove();

            })

            .catch((error) => {

                console.error(
                    "Error al evaluar el avistamiento:",
                    error
                );

            });
    });


    contenedorEvaluacion.appendChild(selectNota);
    contenedorEvaluacion.appendChild(botonGuardar);

    resultado.appendChild(contenedorEvaluacion);
};

let crearTextoResaltado = (prefijo, texto, busqueda) => {

    let contenedor = document.createElement("span");

    contenedor.appendChild(
        document.createTextNode(prefijo)
    );

    let textoMinuscula = texto.toLowerCase();
    let busquedaMinuscula = busqueda.toLowerCase();

    let posicion =
        textoMinuscula.indexOf(busquedaMinuscula);

    if (posicion === -1) {

        contenedor.appendChild(
            document.createTextNode(texto)
        );

        return contenedor;
    }

    let antes =
        texto.substring(0, posicion);

    let coincidencia =
        texto.substring(
            posicion,
            posicion + busqueda.length
        );

    let despues =
        texto.substring(
            posicion + busqueda.length
        );

    contenedor.appendChild(
        document.createTextNode(antes)
    );

    let resaltado =
        document.createElement("mark");

    resaltado.innerText = coincidencia;

    contenedor.appendChild(resaltado);

    contenedor.appendChild(
        document.createTextNode(despues)
    );

    return contenedor;
};

let mostrarResultados = (avistamientos) => {

    while (searchResults.firstChild) {
        searchResults.removeChild(searchResults.firstChild);
    }


    if (avistamientos.length === 0) {

        let mensaje = document.createElement("p");

        mensaje.innerText =
            "No se encontraron avistamientos.";

        searchResults.appendChild(mensaje);

        return;
    }


    for (let avistamiento of avistamientos) {

        let resultado = document.createElement("div");


        let voluntario = document.createElement("p");

        voluntario.appendChild(
            crearTextoResaltado(
                "Voluntario: ",
                avistamiento.voluntario,
                inputSearch.value.trim()
             )
        );

        let fecha = document.createElement("p");

        let fechaAvistamiento =
            new Date(avistamiento.fechaHora);

        fecha.innerText =
            "Fecha: "
            + fechaAvistamiento.toLocaleDateString("es-CL");


        let ave = document.createElement("p");

        ave.appendChild(
            crearTextoResaltado(
                "Ave: ",
                avistamiento.ave,
                inputSearch.value.trim()
         )
        );


        let comuna = document.createElement("p");

        comuna.appendChild(
            crearTextoResaltado(
                "Comuna: ",
                avistamiento.comuna,
                inputSearch.value.trim()
            )
        );


        let promedio = document.createElement("p");

        if (avistamiento.promedio === null) {

            promedio.innerText = "Nota: -";

        } else {

            promedio.innerText =
                "Nota: "
                + avistamiento.promedio.toFixed(1);
        }


        let botonEvaluar = document.createElement("button");

        botonEvaluar.innerText = "Evaluar";


        botonEvaluar.addEventListener("click", () => {

            evaluarAvistamiento(
                avistamiento.id,
                promedio,
                resultado
            );

            botonEvaluar.disabled = true;
        });


        resultado.appendChild(voluntario);
        resultado.appendChild(fecha);
        resultado.appendChild(ave);
        resultado.appendChild(comuna);
        resultado.appendChild(promedio);
        resultado.appendChild(botonEvaluar);

        searchResults.appendChild(resultado);
    }
};


let buscarAvistamientos = (event) => {

    let texto = event.target.value.trim();


    while (searchResults.firstChild) {
        searchResults.removeChild(searchResults.firstChild);
    }


    if (texto.length === 0) {
        return;
    }


    fetch(
        `${window.origin}/buscar-avistamientos/${encodeURIComponent(texto)}`
    )

        .then((response) => {

            if (!response.ok) {

                throw new Error(
                    "Error al buscar los avistamientos"
                );
            }

            return response.json();
        })

        .then((respuesta) => {

            mostrarResultados(
                respuesta["data"]
            );

        })

        .catch((error) => {

            console.error(
                "Error al realizar la búsqueda:",
                error
            );

        });
};


inputSearch.addEventListener(
    "input",
    buscarAvistamientos
);