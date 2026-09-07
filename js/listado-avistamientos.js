// creamos unos avistamientos fiticios para mostrar en la página
const avistamientos = [
    {
        grupo: "Picaflores",
        especie: "Picaflor chico",
        cantidad: 2,
        lugar: "Providencia",
        fecha: "2026-09-03",
        hora: "10:30"
    },

    {
        grupo: "Jotes, aguiluchos y afines",
        especie: "Cóndor",
        cantidad: 3,
        lugar: "Cajón del Maipo",
        fecha: "2026-09-02",
        hora: "12:15"
    },

    {
        grupo: "Anátidos",
        especie: "Cisne de cuello negro",
        cantidad: 12,
        lugar: "Valdivia",
        fecha: "2026-08-11",
        hora: "09:20"
    },

    {
        grupo: "Búhos y lechuzas",
        especie: "Tucúquere",
        cantidad: 1,
        lugar: "Pirque",
        fecha: "2026-08-28",
        hora: "21:10"
    },

    {
        grupo: "Carpinteros",
        especie: "Pitío austral",
        cantidad: 2,
        lugar: "Temuco",
        fecha: "2026-08-10",
        hora: "11:00"
    },

    {
        grupo: "Ictéridos",
        especie: "Loica común",
        cantidad: 4,
        lugar: "Talca",
        fecha: "2026-08-23",
        hora: "08:40"
    },
    
    {
        grupo: "Golondrinas",
        especie: "Golondrina chilena",
        cantidad: 3,
        lugar: "Curicó",
        fecha: "2026-06-15",
        hora: "17:30"
    },

    {
        grupo: "Palomas y tórtolas",
        especie: "Tórtola",
        cantidad: 2,
        lugar: "Rancagua",
        fecha: "2026-03-18",
        hora: "14:10"
    }

];


// avistamientos que se van a mostrar en la tabla
let avistamientosMostrados = avistamientos;

// cantidad de avistamientos que se muestran por página
const registrosPorPagina = 3;

// página que se está mostrando
let paginaActual = 1;

// mostrar los avistamientos en la tabla. (crear filas)
const mostrarAvistamientos = () => {

    //buscamos los elementos en HTML y lo guardamos en cuerpoTabla
    let cuerpoTabla = document.getElementById("cuerpo-tabla");

    cuerpoTabla.textContent = "";

    //muestra los avistamientos que se debe mostrar en ese momento
    let inicio = (paginaActual - 1) * registrosPorPagina; //para calcular en que página partimos
    let fin = inicio + registrosPorPagina;

    for (
        let i = inicio;
        i < fin && i < avistamientosMostrados.length;
        i++
    ) {

        let avistamiento = avistamientosMostrados[i];

        // crear una fila
        let fila = document.createElement("tr");

        // crear la celda del grupo
        let grupo = document.createElement("td");
        grupo.innerText = avistamiento.grupo;

        // crear la celda de la especie
        let especie = document.createElement("td");
        especie.innerText = avistamiento.especie;

        // crear la celda de cantidad
        let cantidad = document.createElement("td");
        cantidad.innerText = avistamiento.cantidad;

        // crear la celda del lugar
        let lugar = document.createElement("td");
        lugar.innerText = avistamiento.lugar;

        // crear la celda de fecha
        let fecha = document.createElement("td");
        fecha.innerText = avistamiento.fecha;

        // crear la celda de hora
        let hora = document.createElement("td");
        hora.innerText = avistamiento.hora;

        // agregar las celdas a la fila
        fila.append(grupo);
        fila.append(especie);
        fila.append(cantidad);
        fila.append(lugar);
        fila.append(fecha);
        fila.append(hora);

        // agregar la fila a la tabla
        cuerpoTabla.append(fila);
    }

    // mostrar el número de página
    document.getElementById("numero-pagina").innerText =
        "Página " + paginaActual;

};

// función que filtra los avistamiento según el grupo seleccionado
const filtrarAvistamientos = () => {

    let grupoSeleccionado =
        document.getElementById("filtro-grupo").value;

    avistamientosMostrados = [];

    for (let avistamiento of avistamientos) {

        if (
        // agrega el avisatimiento si usuario selecciona todos o si el grupo coincide con aquel que fue seleccionado
            grupoSeleccionado === "" ||
            avistamiento.grupo === grupoSeleccionado
        ) {
            avistamientosMostrados.push(avistamiento);
        }
    }

    // volver a la primera página después de filtrar
    paginaActual = 1;

    //mostrar tabla despues del filtro
    ordenarAvistamientos();
};

// función que ordena los avistamientos según la opción seleccionada (por fecha o según orden alfabético)
const ordenarAvistamientos = () => {

    let ordenSeleccionado =
        document.getElementById("orden").value;

    // volver a la primera página después de cambiar el orden
    paginaActual = 1;

    //sort es para ordenar un arreglo

    if (ordenSeleccionado === "fecha-reciente") {
        avistamientosMostrados.sort((a, b) => {
        //fecha más reciente queda primero
            if (a.fecha < b.fecha) return 1;
            if (a.fecha > b.fecha) return -1;
            return 0;
        });
    }

    if (ordenSeleccionado === "fecha-antigua") {
        avistamientosMostrados.sort((a, b) => {
        
            if (a.fecha > b.fecha) return 1;
            if (a.fecha < b.fecha) return -1;
            return 0;
        });

    }

    // ordenar  columna lugar de la A a la Z
    if (ordenSeleccionado === "lugar-az") {
        avistamientosMostrados.sort((a, b) => {
            if (a.lugar > b.lugar) return 1;
            if (a.lugar < b.lugar) return -1;
            return 0;
        });
    }

    // ordenar  columna lugar de la Z a la A
    if (ordenSeleccionado === "lugar-za") {
        avistamientosMostrados.sort((a, b) => {
            if (a.lugar < b.lugar) return 1;
            if (a.lugar > b.lugar) return -1;
            return 0;
        });

    }

    mostrarAvistamientos();
};

// función para ir a la página anterior
const paginaAnterior = () => {
    if (paginaActual > 1) {
        // se puede retroceder en caso de que este en una página mayor a 1
        paginaActual = paginaActual - 1;

        mostrarAvistamientos();
    }
};

// función para ir a la página siguiente
const paginaSiguiente = () => {

    let ultimoRegistro =
        paginaActual * registrosPorPagina;

    if (ultimoRegistro < avistamientosMostrados.length) {

        paginaActual = paginaActual + 1;

        mostrarAvistamientos();
    }
};


// cuando cambia el grupo seleccionado se ejecuta la función de filtro
document.getElementById("filtro-grupo")
    .addEventListener("change", filtrarAvistamientos);

// cuando cambia la opción de orden se ejecuta la función
document.getElementById("orden")
    .addEventListener("change", ordenarAvistamientos);


// cambiar a la página anterior
document.getElementById("anterior-btn")
    .addEventListener("click", paginaAnterior);

// cambiar a la página siguiente
document.getElementById("siguiente-btn")
    .addEventListener("click", paginaSiguiente);


// mostrar los registros al cargar la página. Ejecutamos la función
ordenarAvistamientos();
