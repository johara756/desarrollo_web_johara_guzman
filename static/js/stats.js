
// obtenemos los datos desde Flask
fetch(`${window.origin}/datos-estadisticas`)
    .then((response) => {

        if (!response.ok) {
            throw new Error("No se pudieron obtener los datos de estadisticas");
        }

        return response.json();
    })
    .then((data) => {

// grafico de avistamientos por dia       

        let datosDias = data["avistamientos_dia"].map((item) => {

            let partesFecha = item.fecha.split("-");

            // convertimos la fecha en número
            let year = parseInt(partesFecha[0]);
            let month = parseInt(partesFecha[1]);
            let day = parseInt(partesFecha[2]);

            return [
                Date.UTC(year, month - 1, day),
                item.total
            ];
        });


        Highcharts.chart("grafico-avistamientos-dia", {

            chart: {
                type: "line"
            },

            title: {
                text: "Cantidad de avistamientos por día"
            },

            xAxis: {
                type: "datetime",
                title: {
                    text: "Fecha"
                }
            },

            yAxis: {
                title: {
                    text: "Cantidad de avistamientos"
                },
                allowDecimals: false
            },

            series: [
                {
                    name: "Avistamientos",
                    data: datosDias
                }
            ]

        });

// grafico de avistamientos por ave

        let datosAves = data["avistamientos_ave"].map((item) => {

            return {
                name: item.ave,
                y: item.total
            };

        });

        Highcharts.chart("grafico-avistamientos-ave", {

            chart: {
                type: "pie"
            },

            title: {
                text: "Cantidad de avistamientos por ave"
            },

            series: [
                {
                    name: "Avistamientos",
                    data: datosAves
                }
            ]

        });


  
 // grafico de voluntarios por comuna

        let nombresComunas = [];
        let cantidadVoluntarios = [];

        for (let item of data["voluntarios_comuna"]) {
            nombresComunas.push(item.comuna);
            cantidadVoluntarios.push(item.total);
        }


        Highcharts.chart("grafico-voluntarios-comuna", {

            chart: {
                type: "column"
            },

            title: {
                text: "Cantidad de voluntarios por comuna"
            },

            xAxis: {
                categories: nombresComunas,
                title: {
                    text: "Comuna"
                }
            },

            yAxis: {
                title: {
                    text: "Cantidad de voluntarios"
                },
                allowDecimals: false
            },

            series: [
                {
                    name: "Voluntarios",
                    data: cantidadVoluntarios
                }
            ]

        });

    })
    .catch((error) => {
        console.error("Error:", error);
    });