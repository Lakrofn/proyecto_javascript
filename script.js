function toggleMenu() {
    const menu = document.querySelector('#menu');
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

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

    // Crear tarjeta
    const tarjeta = document.createElement("div"); // Creamos el elemento
    tarjeta.classList.add("mision"); // Agregamos la clase
    tarjeta.setAttribute("draggable", "true"); // Agregamos el atributo
    tarjeta.innerHTML = `
        <h3>${nombre}</h3>
        <div class="info-general">
            <p class="nombrePiloto">${piloto}</p>
            <p class="nivelDificultad">${nivelDificultad}</p>
            <p class="fecha">${fecha}</p>
        </div>
        <div class="info-descripcion" style="display: none;">
            <p class="descripcion">${descripcion}</p>
        </div>
        <div>
            <button onclick="mostrarDescripcion(this)">Descripción</button>
            <button onclick="borrarMision(this)">Borrar</button>
        </div>
        `;
    
    // Agregar a columna Pendiente
    pendiente.appendChild(tarjeta);

        // borrar formulario
        document.getElementById("nombreMision").value = "";
        document.getElementById("DescripcionMision").value = "";
        document.getElementById("PilotoAsignado").value = "";
        document.getElementById("NivelDificultad").value = "";
        document.getElementById("fechaInicio").value = "";

        // 1. Seleccionamos todas las misiones y las columnas
    const misiones = document.querySelectorAll('.mision');
    const columnas = document.querySelectorAll('.misiones');

    // 2. Eventos para el elemento que se arrastra
    misiones.forEach(mision => {
    mision.addEventListener('dragstart', (e) => {
        mision.classList.add('arrastrando');
        // Opcional: un pequeño retraso para el efecto visual
        setTimeout(() => mision.style.display = 'none', 0);
    });

    mision.addEventListener('dragend', () => {
        mision.classList.remove('arrastrando');
        mision.style.display = 'block';
    });
    });
columnas.forEach(columna => {
    columna.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necesario para permitir soltar
        columna.classList.add('hover-columna'); // Clase opcional para feedback visual
    });

    columna.addEventListener('dragleave', () => {
        columna.classList.remove('hover-columna');
    });

    columna.addEventListener('drop', (e) => {
        e.preventDefault();
        columna.classList.remove('hover-columna');
        
        // Obtenemos el elemento que estamos arrastrando
        const misionSiendoArrastrada = document.querySelector('.arrastrando');
        
        // Lo movemos a la nueva columna
        columna.appendChild(misionSiendoArrastrada);
    });
    });

}

function borrarMision(boton){
    const tarjeta = boton.closest(".mision");
    tarjeta.remove();
}
    

function mostrarDescripcion(boton) {
    // Subimos al contenedor padre común (el div class="mision")
    const tarjetaMision = boton.closest('.mision');
    
    // Buscamos las dos capas dentro de ESTA tarjeta
    const infoGeneral = tarjetaMision.querySelector('.info-general');
    const infoDesc = tarjetaMision.querySelector('.info-descripcion');

    // Si la info general se ve, la ocultamos y mostramos la descripción
    if (infoGeneral.style.display !== "none") {
        infoGeneral.style.display = "none";
        infoDesc.style.display = "block";
        boton.textContent = "Volver"; // Cambiamos el texto del botón
    } else {
        // Si ya estaba la descripción, volvemos al estado inicial
        infoGeneral.style.display = "block";
        infoDesc.style.display = "none";
        boton.textContent = "Descripción";
    }
}
