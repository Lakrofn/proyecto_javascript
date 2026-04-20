function toggleMenu() { 
    const menu = document.querySelector('#menu'); 
    menu.style.display = menu.style.display === "flex" ? "none" : "flex"; 
}

// 🔍 BUSCADOR (CORREGIDO)
document.addEventListener('keyup', e => {
    if (e.target.matches('#myInput')) {
        document.querySelectorAll('.card-piloto .delantera').forEach(card => {
            card.textContent.toUpperCase().includes(e.target.value.toUpperCase())
                ? card.parentElement.style.display = 'block'
                : card.parentElement.style.display = 'none';
        });
    }
});

// ✅ SOLO UNA FUNCIÓN mostrarSeccion
function mostrarSeccion(id) {
    document.querySelectorAll('.seccion').forEach(sec => {
        sec.classList.remove('activa');
    });
    document.getElementById(id).classList.add('activa');

    // Menú activo
    document.querySelectorAll('#menu a').forEach(a => a.classList.remove('actual'));
    const enlace = Array.from(document.querySelectorAll('#menu a'))
        .find(a => a.getAttribute('onclick')?.includes(id));
    if (enlace) enlace.classList.add('actual');
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


// DATOS
let pilotos = [];
let pilotoEditando = null;

const naves = Object.keys(imagenesNaves);


// CARGAR NAVES
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


// AÑADIR / EDITAR
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

    this.reset();
    mostrarPilotos();
});


// MOSTRAR TARJETAS
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
                <img src="${imagenesNaves[p.nave] || './images/default.jpg'}" alt="${p.nave}">
                <h3>${p.nombre}</h3>
            </div>

            <div class="cara trasera">
                <h2>${p.nombre}</h2>
                <p><strong>Rango:</strong> ${p.rango}</p>
                <p><strong>Nave:</strong> ${p.nave}</p>
                <p><strong>Victorias:</strong> ${p.victorias}</p>
                <p class="${estadoClase}"><strong>Estado:</strong> ${p.estado}</p>

                <div style="display:flex; justify-content:center; gap:10px;">
                    <button onclick="editarPiloto(${index})">Editar</button>
                    <button onclick="eliminarPiloto(${index})">Eliminar</button>
                </div>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });
}


// EDITAR
function editarPiloto(index) {
    const p = pilotos[index];

    document.getElementById("nombrePiloto").value = p.nombre;
    document.getElementById("RangoPiloto").value = p.rango;
    document.getElementById("NavePiloto").value = p.nave;
    document.getElementById("VictoriasPiloto").value = p.victorias;
    document.getElementById("pilotoEstado").value = p.estado;

    pilotoEditando = index;
}
window.editarPiloto = editarPiloto;
window.eliminarPiloto = eliminarPiloto;


// ELIMINAR
function eliminarPiloto(index) {
    if (confirm("¿Seguro que quieres eliminar este piloto?")) {
        pilotos.splice(index, 1);
        mostrarPilotos();
    }
}



//  MISIONES (DRAG & DROP)


function crearMision() {
    const pendiente = document.getElementById("pendiente");

    const nombre = document.getElementById("nombreMision").value;
    const descripcion = document.getElementById("DescripcionMision").value;
    const piloto = document.getElementById("PilotoAsignado").value;
    const nivelDificultad = document.getElementById("NivelDificultad").value;
    const fecha = document.getElementById("fechaInicio").value;

    if (!nombre) {
        alert("El nombre es obligatorio");
        return;
    }

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("mision");
    tarjeta.setAttribute("draggable", "true");

    tarjeta.innerHTML = `
        <h3>${nombre}</h3>
        <div class="info-general">
            <p>${piloto}</p>
            <p>${nivelDificultad}</p>
            <p>${fecha}</p>
        </div>
        <div class="info-descripcion" style="display: none;">
            <p>${descripcion}</p>
        </div>
        <div>
            <button onclick="mostrarDescripcion(this)">Descripción</button>
            <button onclick="borrarMision(this)">Borrar</button>
        </div>
    `;

    // DRAG SOLO A ESTA TARJETA
    tarjeta.addEventListener('dragstart', () => {
        tarjeta.classList.add('arrastrando');
        setTimeout(() => tarjeta.style.display = 'none', 0);
    });

    tarjeta.addEventListener('dragend', () => {
        tarjeta.classList.remove('arrastrando');
        tarjeta.style.display = 'block';
    });

    pendiente.appendChild(tarjeta);

    // LIMPIAR FORM
    document.getElementById("nombreMision").value = "";
    document.getElementById("DescripcionMision").value = "";
    document.getElementById("PilotoAsignado").value = "";
    document.getElementById("NivelDificultad").value = "";
    document.getElementById("fechaInicio").value = "";
}


// COLUMNAS (SOLO UNA VEZ)
document.querySelectorAll('.misiones').forEach(columna => {

    columna.addEventListener('dragover', (e) => {
        e.preventDefault();
        columna.classList.add('hover-columna');
    });

    columna.addEventListener('dragleave', () => {
        columna.classList.remove('hover-columna');
    });

    columna.addEventListener('drop', (e) => {
        e.preventDefault();
        columna.classList.remove('hover-columna');

        const mision = document.querySelector('.arrastrando');
        columna.appendChild(mision);
    });
});


// BORRAR MISIÓN
function borrarMision(boton){
    boton.closest(".mision").remove();
}


// MOSTRAR DESCRIPCIÓN
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