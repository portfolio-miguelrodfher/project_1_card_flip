document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        gsap.to(card, {duration: 0.6, rotateY: 180});
    });
});
