// especies correspondientes a cada grupo de aves, guiandonos desde ebird.org

const especies = {

    "Perdices": ["Perdiz chilena"],
    "Anátidos": ["Cisne de cuello negro", "Cisne coscoroba", "Pato capuchino", "Pato colorado", "Pato cuchara", "Pato real", "Pato gargantillo", "Pato jergón grande", "Pato jergón chico", "Pato negro", "Pato rinconero", "Pato rana de pico delgado", "Pato sp."],
    "Codornices": ["Codorniz"],
    "Palomas y tórtolas": ["Paloma doméstica (Asilvestrada)", "Torcaza", "Tortolita cuyana", "Paloma de alas blancas", "Tórtola"],
    "Gallinas ciegas": ["Gallina ciega común"],
    "Picaflores": ["Picaflor chico", "Picaflor gigante"],
    "Pidenes, taguas y afines": ["Pidén común", "Tagüita común", "Tagua de frente roja", "Tagua común", "Tagua chica", "Tagua sp."],
    "Aves playeras": ["Perrito", "Queltehue común", "Becacina común", "Pitotoy chico", "Pitotoy grande", "Pitotoy chico/grande", "Playero de Baird"],   
    "Gaviotas, gaviotines y rayadores": ["Gaviota andina", "Gaviota cáhuil", "Gaviota dominicana", "Gaviota sp."],
    "Zambullidores": ["Pimpollo común", "Picurio", "Huala", "Blanquillo"],
    "Cormoranes": ["Yeco"],
    "Garzas y bandurrias": ["Cuervo de pantano común", "Bandurria común", "Huairavo común", "Garza chica", "Garza bueyera", "Garza grande", "Garza cuca"],
    "Jotes, aguiluchos y afines": ["Cóndor", "Jote de cabeza negra", "Jote de cabeza colorada", "Bailarín", "Peuquito", "Variceniciento", "Peuco", "Aguilucho común", "Águila"],
    "Búhos y lechuzas": ["Lechuza", "Tucúquere", "Chuncho austral", "Pequén", "Nuco"],
    "Carpinteros": ["Carpinterito", "Pitío austral"],
    "Halcones y caranchos": ["Tiuque", "Cernícalo", "Halcón perdiguero", "Halcón peregrino"],
    "Loros, cotorras y afines": ["Cotorra"],
    "Rhinocríptidos": ["Turca", "Tapaculo", "Churrín del norte"],
    "Mineros": ["Minero cordillerano"],
    "Furnáridos": ["Trabajador", "Bandurrilla de los bosques", "Churrete acanelado", "Churrete chico", "Churrete patagónico", "Churrete sp.", "Rayadito", "Colilarga", "Tijeral común", "Canastero sp.", "Canastero chileno"],
    "Cotingas": ["Rara"],
    "Tiránidos: fiofíos y afines": ["Siete colores", "Cachudito común", "Fío-fío"],
    "Tiránidos: benteveos y afines": ["Colegial austral", "Viudita"],
    "Golondrinas": ["Golondrina chilena", "Golondrina de dorso negro"],
    "Chercanes": ["Chercán común"],
    "Tencas": ["Tenca chilena"],
    "Zorzales": ["Zorzal patagónico"],
    "Gorriones": ["Gorrión"],
    "Bailarines chicos": ["Bailarín chico común"],
    "Jilgueros": ["Jilguero austral"],
    "Chincoles": ["Chincol"],
    "Ictéridos": ["Loica común", "Mirlo común", "Tordo", "Trile"],
    "Frigilos, chirihues y afines": ["Cometocino de Gay", "Gray-hooded/Patagonian Sierra Finch", "Diuca común", "Yal común", "Platero", "Chirihue común"],
    "Otros": ["Pájaro sp.", "Ave sp."]
};

// agregar grupos de aves al select
const poblarGrupos = () => {

    let grupoSelect = document.getElementById("grupo-ave");

    for (const grupo in especies) {

        let option = document.createElement("option");
        option.value = grupo;
        option.text = grupo;
        grupoSelect.appendChild(option);
    }
};


// especies según grupo seleccionado
const actualizarEspecies = () => {

    let grupoSelect = document.getElementById("grupo-ave");
    let especieSelect = document.getElementById("especie");
    let grupoSeleccionado = grupoSelect.value;

    especieSelect.innerHTML =
        '<option value="">Seleccione una especie</option>';

    if (especies[grupoSeleccionado]) {

        especies[grupoSeleccionado].forEach(especie => {

            let option = document.createElement("option");

            option.value = especie;
            option.text = especie;

            especieSelect.appendChild(option);
        });
    }
};


// actualizar las especies según grupo elegido
document.getElementById("grupo-ave")
    .addEventListener("change", actualizarEspecies);


// agregar grupos al cargar el archivo

poblarGrupos();