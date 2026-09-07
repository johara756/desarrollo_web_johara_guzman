
// provincias correspondientes a cada región
const provincias = {
    "Arica y Parinacota": ["Arica", "Parinacota"],
    "Tarapacá": ["Iquique", "El Tamarugal"],
    "Antofagasta": ["Antofagasta", "El Loa", "Tocopilla"],
    "Atacama": ["Copiapó", "Chañaral", "Huasco"],
    "Coquimbo": ["Elqui", "Limarí", "Choapa"],
    "Valparaíso":[ "Valparaíso", "Quillota", "San Antonio", 
        "Petorca", "Los Andes", "San Felipe de Aconcagua", "Marga Marga", "Isla de Pascua"],
    "Metropolitana" : ["Santiago", "Cordillera", "Maipo", "Talagante", "Melipilla", "Chacabuco"],
    "O'Higgins": ["Cachapoal","Colchagua","Cardenal Caro"],
    "Maule": ["Curicó","Talca","Linares","Cauquenes"],
    "Ñuble": ["Diguillín","Punilla","Itata"],
    "Biobío": ["Concepción","Biobío","Arauco"],
    "La Araucanía": ["Malleco","Cautín"],
    "Los Ríos": ["Valdivia","Ranco"],
    "Los Lagos": ["Osorno","Llanquihue","Chiloé","Palena"],
    "Aysén": ["Coyhaique","Aysén","General Carrera","Capitán Prat"],
    "Magallanes": ["Magallanes","Última Esperanza","Tierra del Fuego","Antártica Chilena"]
};

// comunas correspondientes a cada provincia
const comunas = {
    "Arica": ["Arica","Camarones"],
    "Parinacota": ["Putre","General Lagos"],
    "Iquique": ["Iquique","Alto Hospicio"],
    "El Tamarugal": ["Pozo Almonte","Camiña","Colchane","Huara","Pica"],
    "Antofagasta": ["Antofagasta","Mejillones","Sierra Gorda","Taltal"],
    "El Loa": ["Calama","Ollagüe","San Pedro de Atacama"],
    "Tocopilla": ["Tocopilla","María Elena"],
    "Chañaral": ["Chañaral","Diego de Almagro"],
    "Copiapó": ["Copiapó","Caldera","Tierra Amarilla"],
    "Huasco": ["Vallenar","Alto del Carmen","Freirina","Huasco"],
    "Elqui":["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña"], 
    "Limarí": ["Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Choapa": ["Illapel", "Canela", "Los Vilos", "Salamanca"],
    "Petorca": ["La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar"],
    "Los Andes": ["Los Andes", "Calle Larga", "Rinconada", "San Esteban"],
    "San Felipe de Aconcagua": ["San Felipe", "Catemu", "Llay-Llay", "Panquehue", "Putaendo", "Santa María"],
    "Quillota": ["Quillota", "La Calera", "Hijuelas", "La Cruz", "Nogales"],
    "Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar"],
    "San Antonio": ["San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo"],
    "Isla de Pascua": ["Isla de Pascua"],
    "Marga Marga": ["Quilpué", "Limache", "Olmué", "Villa Alemana"],
    "Santiago": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Santiago", "Vitacura"],
    "Cordillera": ["Puente Alto", "Pirque", "San José de Maipo"],
    "Chacabuco": ["Colina", "Lampa", "Tiltil"],
    "Maipo": ["San Bernardo", "Buin", "Calera de Tango", "Paine"],
    "Melipilla": ["Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro"],
    "Talagante": ["Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
    "Cachapoal": ["Codegua", "Coínco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rancagua", "Requínoa", "Rengo", "San Vicente"],
    "Colchagua": ["Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "San Fernando", "Santa Cruz"],
    "Cardenal Caro": ["La Estrella", "Litueche", "Marchigüe", "Navidad", "Paredones", "Pichilemu"],
    "Curicó": ["Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén"],
    "Talca": ["Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Talca"],
    "Linares": ["Colbún", "Linares", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
    "Cauquenes": ["Cauquenes", "Chanco", "Pelluhue"],
    "Diguillín": ["Bulnes", "Chillán", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay"],
    "Punilla": ["Coihueco", "Ñiquén", "San Carlos", "San Fabián", "San Nicolás"],
    "Itata": ["Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Trehuaco"],
    "Concepción": ["Chiguayante", "Concepción", "Coronel", "Florida", "Hualpén", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé"],
    "Biobío": ["Alto Biobío", "Antuco", "Cabrero", "Laja", "Los Ángeles", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel"],
    "Arauco": ["Arauco", "Cañete", "Contulmo", "Curanilahue", "Lebu", "Los Álamos", "Tirúa"],
    "Malleco": ["Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
    "Cautín": ["Carahue", "Cholchol", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Temuco", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica"],
    "Valdivia": ["Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "Valdivia"],
    "Ranco": ["Futrono", "La Unión", "Lago Ranco", "Río Bueno"],
    "Osorno": ["Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo"],
    "Llanquihue": ["Calbuco", "Cochamó", "Fresia", "Frutillar", "Llanquihue", "Los Muermos", "Maullín", "Puerto Montt", "Puerto Varas"],
    "Chiloé": ["Ancud", "Castro", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao"],
    "Palena": ["Chaitén", "Futaleufú", "Hualaihué", "Palena"],
    "Coyhaique": ["Coyhaique", "Lago Verde"],
    "Aysén": ["Aysén", "Cisnes", "Guaitecas"],
    "General Carrera": ["Chile Chico", "Río Ibáñez"],
    "Capitán Prat": ["Cochrane", "O'Higgins", "Tortel"],
    "Magallanes": ["Laguna Blanca", "Punta Arenas", "Río Verde", "San Gregorio"],
    "Última Esperanza": ["Natales", "Torres del Paine"],
    "Tierra del Fuego": ["Porvenir", "Primavera", "Timaukel"],
    "Antártica Chilena": ["Antártica", "Cabo de Hornos"]

};


// agregar regiones al select

const poblarRegiones = () => {

    let regionSelect = document.getElementById("region");

    for (const region in provincias) {

        let option = document.createElement("option");

        option.value = region;
        option.text = region;

        regionSelect.appendChild(option);  // la agrega al select 
    }
};

//provincias según región seleccionada

const actualizarProvincias = () => {

    let regionSelect = document.getElementById("region");
    let provinciaSelect = document.getElementById("provincia");
    let comunaSelect = document.getElementById("comuna");

    let regionSeleccionada = regionSelect.value;

    provinciaSelect.innerHTML =
        '<option value="">Seleccione una Provincia</option>';

    comunaSelect.innerHTML =
        '<option value="">Seleccione primero una Provincia</option>';

    if (provincias[regionSeleccionada]) {

        provincias[regionSeleccionada].forEach(provincia => {

            let option = document.createElement("option");

            option.value = provincia;
            option.text = provincia;

            provinciaSelect.appendChild(option);
        });
    }
};
// comunas según provincia 
const actualizarComunas = () => {

    let provinciaSelect = document.getElementById("provincia");
    let comunaSelect = document.getElementById("comuna");

    let provinciaSeleccionada = provinciaSelect.value;

    comunaSelect.innerHTML =
        '<option value="">Seleccione una Comuna</option>';

    if (comunas[provinciaSeleccionada]) {

        comunas[provinciaSeleccionada].forEach(comuna => {

            let option = document.createElement("option");

            option.value = comuna;
            option.text = comuna;

            comunaSelect.appendChild(option);
        });
    }
};


document.getElementById("region")
    .addEventListener("change", actualizarProvincias);

document.getElementById("provincia")
    .addEventListener("change", actualizarComunas);

window.onload = () => {
    poblarRegiones();
};

