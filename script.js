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
