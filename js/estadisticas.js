// voluntarios ficticios para mostrar las estadísticas
const voluntarios = [
    "Ana",
    "Pedro",
    "Josefa",
    "Juan",
    "Camila"
];

// avistamientos ficticios utilizados para las estadísticas
const avistamientosEstadisticas = [
    {
        fecha: "2026-09-03",
        cantidad: 2
    },


    {
        fecha: "2026-09-02",
        cantidad: 3
    },

    {
        fecha: "2026-08-11",
        cantidad: 12
    },

    {
        fecha: "2026-08-28",
        cantidad: 1
    },

    {
        fecha: "2026-08-10",
        cantidad: 2
    },

    {
        fecha: "2026-08-23",
        cantidad: 4
    },

    {
        fecha: "2026-06-15",
        cantidad: 3
    },

    {
        fecha: "2026-03-18",
        cantidad: 2
    }

];


// mostrar cantidad de voluntarios registrados
const mostrarVoluntarios = () => {

    let totalVoluntarios =
        document.getElementById("total-voluntarios");

    totalVoluntarios.innerText = voluntarios.length;
};

// mostrar cantidad de avistamientos registrados
const mostrarTotalAvistamientos = () => {

    let totalAvistamientos =
        document.getElementById("total-avistamientos");

    totalAvistamientos.innerText =
        avistamientosEstadisticas.length;
};

// calcular total de individuos observados
const mostrarTotalIndividuos = () => {

    let total = 0;
    for (let avistamiento of avistamientosEstadisticas) {
        total = total + avistamiento.cantidad;
    }

    let totalIndividuos =
        document.getElementById("total-individuos");

    totalIndividuos.innerText = total;
};

// transformamor el mes de número a palabra
const mostrarAvistamientosPorMes = () => {

    let meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ];

    // cuenta avistamientos por mes
    let cantidadesPorMes = {};

    // contar los avistamientos de cada mes
    for (let avistamiento of avistamientosEstadisticas) {

        let numeroMes = Number(avistamiento.fecha.split("-")[1]);   // para dejar fecha ["2025", "09", "03"]
        let nombreMes = meses[numeroMes - 1];   //empieza arreglos desde 0, asi que restamos 1 para obtener mes correcto
        if (!cantidadesPorMes[nombreMes]) {  // contar avistamientos por mes
            cantidadesPorMes[nombreMes] = 0;
        }

        cantidadesPorMes[nombreMes] =
            cantidadesPorMes[nombreMes] + 1;
    }

    let grafico =
        document.getElementById("grafico-avistamientos");


    // crear una fila para cada mes que tenga avistamientos
    for (let mes of meses) {

        if (cantidadesPorMes[mes]) {  // barra aparece solo cuando ese mes tenga avistamientos


        let fila = document.createElement("div");
        fila.className = "barra-fila";
        let nombre = document.createElement("span");
        nombre.innerText = mes;
        let barra = document.createElement("div");
        barra.className = "barra";
        barra.style.width =
            cantidadesPorMes[mes] * 60 + "px";

        barra.innerText =
            cantidadesPorMes[mes];
        fila.append(nombre);
        fila.append(barra);

        grafico.append(fila);
    }
}
};


mostrarVoluntarios();
mostrarTotalAvistamientos();
mostrarTotalIndividuos();
mostrarAvistamientosPorMes();

