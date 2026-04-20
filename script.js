// MENU
function toggleMenu() {  
    const menu = document.querySelector('#menu');  
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";  
}

// BUSCADOR
document.addEventListener('keyup', e => {
    if(e.target.matches('#myInput')){
        document.querySelectorAll('.card-dinamica .delantera').forEach(card => {
            card.textContent.toUpperCase().includes(e.target.value.toUpperCase())
            ? card.parentElement.style.display = 'block'
            : card.parentElement.style.display = 'none';   
        });
    }
});

// SECCIONES
function mostrarSeccion(id) {
    document.querySelectorAll('.seccion').forEach(sec => {
        sec.classList.remove('activa');
    });
    document.getElementById(id).classList.add('activa');

    document.querySelectorAll('#menu a').forEach(a => a.classList.remove('actual'));
    const enlace = Array.from(document.querySelectorAll('#menu a'))
        .find(a => a.getAttribute('onclick')?.includes(id));
    if (enlace) enlace.classList.add('actual');

    if (id === "mandoAlianza") {
        actualizarDashboard();
    }
}

// IMÁGENES
const imagenesNaves = {
    "Ala-X (X-Wing)": "./images/ahsoka.webp",
    "Halcón Milenario": "./images/kitfisto.webp",
    "Home One (MC80)": "./images/luke.webp",
    "Tantive IV (CR90)": "./images/piloto3.jpg",
    "Ala-A (A-Wing)": "./images/saesee.webp",
    "Ala-Y (Y-Wing)": "./images/yoda.webp",
    "Fragata Nebulon-B": "./images/piloto4.webp",
    "Profundity (MC75)": "./images/piloto5.webp",
    "Ala-B (B-Wing)": "./images/piloto6.webp",
    "Transporte GR-75": "./images/piloto7.webp"
};

// LOCALSTORAGE PILOTOS
let pilotos = JSON.parse(localStorage.getItem("pilotos")) || [];
let pilotoEditando = null;

function guardarPilotos() {
    localStorage.setItem("pilotos", JSON.stringify(pilotos));
}

// NAVES
const naves = Object.keys(imagenesNaves);

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

// VALIDACIÓN
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

// PILOTOS
document.getElementById("formPilotos").addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombrePiloto").value.trim();
    const rango = document.getElementById("RangoPiloto").value.trim();
    const nave = document.getElementById("NavePiloto").value;
    const victorias = parseInt(document.getElementById("VictoriasPiloto").value);
    const estado = document.getElementById("pilotoEstado").value;

    if (!validarFormulario(nombre, rango, nave, victorias, estado)) return;

    const nuevoPiloto = { nombre, rango, nave, victorias, estado };

    if (pilotoEditando !== null) {
        pilotos[pilotoEditando] = nuevoPiloto;
        pilotoEditando = null;
    } else {
        pilotos.push(nuevoPiloto);
    }

    guardarPilotos();
    this.reset();
    mostrarPilotos();
});

// MOSTRAR PILOTOS
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
                <img src="${imagenesNaves[p.nave] || './images/default.jpg'}">
                <h3>${p.nombre}</h3>
            </div>

            <div class="cara trasera">
                <h2>${p.nombre}</h2>
                <p><strong>Rango:</strong> ${p.rango}</p>
                <p><strong>Nave:</strong> ${p.nave}</p>
                <p><strong>Victorias:</strong> ${p.victorias}</p>
                <p class="${estadoClase}"><strong>Estado:</strong> ${p.estado}</p>

                <div style="display:flex; gap:10px; justify-content:center;">
                    <button onclick="editarPiloto(${index})">Editar</button>
                    <button onclick="eliminarPiloto(${index})">Eliminar</button>
                </div>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });
}

// EDITAR / ELIMINAR
function editarPiloto(index) {
    const p = pilotos[index];

    document.getElementById("nombrePiloto").value = p.nombre;
    document.getElementById("RangoPiloto").value = p.rango;
    document.getElementById("NavePiloto").value = p.nave;
    document.getElementById("VictoriasPiloto").value = p.victorias;
    document.getElementById("pilotoEstado").value = p.estado;

    pilotoEditando = index;
}

function eliminarPiloto(index) {
    if (confirm("¿Seguro que quieres eliminar este piloto?")) {
        pilotos.splice(index, 1);
        guardarPilotos();
        mostrarPilotos();
    }
}

window.editarPiloto = editarPiloto;
window.eliminarPiloto = eliminarPiloto;

// MISIONES
function crearMision() {
    const pendiente = document.getElementById("pendiente");

    const nombre = document.getElementById("nombreMision").value;
    const descripcion = document.getElementById("DescripcionMision").value;
    const piloto = document.getElementById("PilotoAsignado").value;
    const nivel = document.getElementById("NivelDificultad").value;
    const fecha = document.getElementById("fechaInicio").value;

    if (!nombre) return alert("El nombre es obligatorio");

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("mision");
    tarjeta.setAttribute("draggable", "true");

    tarjeta.innerHTML = `
        <h3>${nombre}</h3>
        <div class="info-general">
            <p>${piloto}</p>
            <p>${nivel}</p>
            <p>${fecha}</p>
        </div>
        <div class="info-descripcion" style="display:none;">
            <p>${descripcion}</p>
        </div>
        <div>
            <button onclick="mostrarDescripcion(this)">Descripción</button>
            <button onclick="borrarMision(this)">Borrar</button>
        </div>
    `;

    tarjeta.addEventListener("dragstart", () => tarjeta.classList.add("arrastrando"));
    tarjeta.addEventListener("dragend", () => tarjeta.classList.remove("arrastrando"));

    pendiente.appendChild(tarjeta);

    document.getElementById("nombreMision").value = "";
    document.getElementById("DescripcionMision").value = "";
}

// DROP ZONES
document.querySelectorAll('.misiones').forEach(columna => {

    columna.addEventListener('dragover', e => {
        e.preventDefault();
        columna.classList.add('hover-columna');
    });

    columna.addEventListener('dragleave', () => {
        columna.classList.remove('hover-columna');
    });

    columna.addEventListener('drop', e => {
        e.preventDefault();
        columna.classList.remove('hover-columna');

        const mision = document.querySelector('.arrastrando');
        if (!mision) return;

        columna.appendChild(mision);
    });
});

// ACCIONES MISIONES
function borrarMision(boton){
    boton.closest(".mision")?.remove();
}

function mostrarDescripcion(boton) {
    const tarjeta = boton.closest('.mision');

    const infoGeneral = tarjeta.querySelector('.info-general');
    const infoDesc = tarjeta.querySelector('.info-descripcion');

    if (infoGeneral.style.display !== "none") {
        infoGeneral.style.display = "none";
        infoDesc.style.display = "block";
        boton.textContent = "Volver";
    } else {
        infoGeneral.style.display = "block";
        infoDesc.style.display = "none";
        boton.textContent = "Descripción";
    }
}

// =====================
// 🧠 DASHBOARD (SECCIÓN 4)
// =====================
function actualizarDashboard() {

    const pilotos = JSON.parse(localStorage.getItem("pilotos")) || [];
    const misiones = Array.from(document.querySelectorAll(".mision"));

    const activos = pilotos.filter(p => p.estado === "activo").length;
    const heridos = pilotos.filter(p => p.estado === "herido").length;
    const kia = pilotos.filter(p => p.estado === "kia").length;

    const pendientes = document.querySelectorAll(".pendiente .mision").length;
    const curso = document.querySelectorAll(".en-curso .mision").length;
    const hechas = document.querySelectorAll(".completada .mision").length;

    const mejor = pilotos.reduce((max, p) =>
        (!max || p.victorias > max.victorias) ? p : max
    , null);

    const totalMisiones = misiones.length;
    const porcentaje = totalMisiones === 0 ? 0 : Math.round((hechas / totalMisiones) * 100);

    document.getElementById("totalPilotos").textContent = "Total: " + pilotos.length;
    document.getElementById("pilotosActivos").textContent = "Activos: " + activos;
    document.getElementById("pilotosHeridos").textContent = "Heridos: " + heridos;
    document.getElementById("pilotosKia").textContent = "KIA: " + kia;

    document.getElementById("totalMisiones").textContent = "Total: " + totalMisiones;
    document.getElementById("misionesPendientes").textContent = "Pendientes: " + pendientes;
    document.getElementById("misionesCurso").textContent = "En curso: " + curso;
    document.getElementById("misionesHechas").textContent = "Completadas: " + hechas;

    document.getElementById("mejorPiloto").textContent =
        mejor ? mejor.nombre : "Ninguno";

    document.getElementById("mejorVictorias").textContent =
        mejor ? mejor.victorias + " victorias" : "-";

    document.getElementById("barraProgreso").style.width = porcentaje + "%";

    document.getElementById("porcentajeMisiones").textContent =
        porcentaje + "% completadas";
}

// INIT
mostrarPilotos();