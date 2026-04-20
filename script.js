document.addEventListener('keyup', e => {
    if(e.target.matches('#myInput')){
        document.querySelectorAll('.card-dinamica .delantera').forEach(card => {
            card.textContent.toUpperCase().includes(e.target.value.toUpperCase())
            ? card.parentElement.style.display = 'block'
            : card.parentElement.style.display = 'none';   
        });
    }
});