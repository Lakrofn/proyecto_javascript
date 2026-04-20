document.addEventListener('keyup', e => {
    if(e.target.matches('#myInput')){
        document.querySelectorAll('.card-dinamica .delantera').forEach(card => {
            card.textContent.toUpperCase().includes(e.target.value.toUpperCase())
            ? card.parentElement.style.display = 'block'
            : card.parentElement.style.display = 'none';   
        });
    }
});
function mostrarSeccion(id) {
    document.querySelectorAll('.seccion').forEach(sec => {
        sec.classList.remove('activa');
    });
    document.getElementById(id).classList.add('activa');

    // Cambio de enlace en el menú
    document.querySelectorAll('#menu a').forEach(a => a.classList.remove('actual'));
    const enlace = Array.from(document.querySelectorAll('#menu a'))
        .find(a => a.getAttribute('onclick')?.includes(id));
    if (enlace) enlace.classList.add('actual');
}




//  IMÁGENES DE Pilotos segun naves

const imagenesNaves = {
    "Ala‑X (X‑Wing)": "./images/ahsoka.webp",
    "Halcón Milenario": "./images/kitfisto.webp",
    "Home One (MC80)": "./images/luke.webp",
    "Tantive IV (CR90)": "./images/piloto3.jpg",
    "Ala‑A (A‑Wing)": "./images/saesee.webp",
    "Ala‑Y (Y‑Wing)": "./images/yoda.webp",
    "Fragata Nebulon‑B": "./images/piloto4.webp",
    "Profundity (MC75)": "./images/piloto5.webp",
    "Ala‑B (B‑Wing)": "./images/piloto6.webp",
    "Transporte GR‑75": "./images/piloto7.webp"
};


//  DATOS

let pilotos = [];
let pilotoEditando = null;

const naves = Object.keys(imagenesNaves);


//  CARGAR NAVES EN SELECT

function cargarNaves() {
    const select = document.getElementById("NavePiloto");
    select.innerHTML = "";

    naves.forEach(nave => {
        const option = document.createElement("option");
        option.value = nave;
        option.textContent = nave;
        select.appendChild(option);
    });
}
cargarNaves();


//  VALIDACIÓN

function validarFormulario(nombre, rango, nave, victorias, estado) {
    if (!nombre || !rango || !nave || victorias === "" || !estado) {
        alert("Todos los campos son obligatorios.");
        return false;
    }
    if (victorias < 0) {
        alert("Las victorias deben ser positivas.");
        return false;
    }
    return true;
}


//  AÑADIR / EDITAR

document.getElementById("formPilotos").addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombrePiloto").value.trim();
    const rango = document.getElementById("RangoPiloto").value.trim();
    const nave = document.getElementById("NavePiloto").value;
    const victorias = document.getElementById("VictoriasPiloto").value;
    const estado = document.getElementById("pilotoEstado").value;

    if (!validarFormulario(nombre, rango, nave, victorias, estado)) return;

    const nuevoPiloto = { nombre, rango, nave, victorias, estado };

    if (pilotoEditando !== null) {
        pilotos[pilotoEditando] = nuevoPiloto;
        pilotoEditando = null;
    } else {
        pilotos.push(nuevoPiloto);
    }

    this.reset();
    mostrarPilotos();
});


//  MOSTRAR TARJETAS

function mostrarPilotos() {
    const contenedor = document.getElementById("listaPilotos");

    if (pilotos.length === 0) {
        contenedor.innerHTML = "<p>No hay pilotos registrados.</p>";
        return;
    }

    contenedor.innerHTML = "";

    pilotos.forEach((p, index) => {

        const estadoClase =
            p.estado === "activo" ? "estado-activo" :
            p.estado === "herido" ? "estado-herido" :
            "estado-kia";

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("card-piloto");

        tarjeta.innerHTML = `
            <div class="cara delantera">
                <img src="${imagenesNaves[p.nave]}" alt="${p.nave}">
                <h3>${p.nombre}</h3>
            </div>

            <div class="cara trasera">
                <h2>${p.nombre}</h2>
                <p><strong>Rango:</strong> ${p.rango}</p>
                <p><strong>Nave:</strong> ${p.nave}</p>
                <p><strong>Victorias:</strong> ${p.victorias}</p>
                <p class="${estadoClase}"><strong>Estado:</strong> ${p.estado}</p>

                <div style="display:flex; justify-content:center; gap:10px;">
                    <button class="btn-editar" onclick="editarPiloto(${index})">Editar</button>
                    <button class="btn-eliminar" onclick="eliminarPiloto(${index})">Eliminar</button>
                </div>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });
}


//  EDITAR
function editarPiloto(index) {
    const p = pilotos[index];

    document.getElementById("nombrePiloto").value = p.nombre;
    document.getElementById("RangoPiloto").value = p.rango;
    document.getElementById("NavePiloto").value = p.nave;
    document.getElementById("VictoriasPiloto").value = p.victorias;
    document.getElementById("pilotoEstado").value = p.estado;

    pilotoEditando = index;
}


//  ELIMINAR

function eliminarPiloto(index) {
    if (confirm("¿Seguro que quieres eliminar este piloto?")) {
        pilotos.splice(index, 1);
        mostrarPilotos();
    }
}


//  CAMBIO DE SECCIONES

function mostrarSeccion(id) {
    document.querySelectorAll('.seccion').forEach(sec => sec.classList.remove('activa'));
    document.getElementById(id).classList.add('activa');
}


//  MENÚ HAMBURGUESA

function toggleMenu() {
    document.getElementById("menu").classList.toggle("menu-abierto");
}
