// Navegación entre secciones
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const carouselContainers = document.querySelectorAll('.carousel-container');
    const projectsContainer = document.getElementById('projects');
    
    // Inicializar carruseles
    initCarousel('certificates');
    
    // Configurar navegación entre secciones
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Actualizar TODOS los botones activos
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            carouselContainers.forEach(container => {
                container.classList.remove('active');
            });
            
            document.getElementById(target).classList.add('active');
        });
    });
    
    // Configurar botones de descarga
    setupDownloadButtons();
    
    // Configurar animaciones de scroll para proyectos
    setupProjectAnimations();
});

// Configurar animaciones de scroll para proyectos
function setupProjectAnimations() {
    const projectCards = document.querySelectorAll('.project-card-animated');
    
    // Crear un Intersection Observer para detectar cuando los elementos entran/salen de la vista
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Cuando el elemento entra en la vista
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                // Cuando el elemento sale de la vista
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
            }
        });
    }, {
        threshold: 0.1, // Se activa cuando el 10% del elemento es visible
        rootMargin: '0px 0px -50px 0px' // Se activa un poco antes de que el elemento entre en la vista
    });
    
    // Observar cada tarjeta de proyecto
    projectCards.forEach(card => {
        observer.observe(card);
    });
}

// CARRUSEL MEJORADO CON EFECTO INFINITO Y ANIMACIÓN MÁS LIMPIA
function initCarousel(carouselId) {
    const container = document.getElementById(carouselId);
    if (!container) return;
    
    const carousel = container.querySelector('.carousel');
    const items = Array.from(container.querySelectorAll('.carousel-item'));
    const prevBtn = container.querySelector('.carousel-btn.prev');
    const nextBtn = container.querySelector('.carousel-btn.next');
    
    if (!carousel || items.length === 0) return;
    
    let currentIndex = 0;
    const itemsPerView = getItemsPerView();
    let isAnimating = false;
    
    function getItemsPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1024) return 2;
        return 3;
    }
    
    function updateCarousel(animate = true) {
        if (isAnimating) return;
        
        const itemsPerView = getItemsPerView();
        const totalItems = items.length;
        const itemWidth = carousel.offsetWidth / itemsPerView;
        
        // Calcular desplazamiento
        const translateX = -currentIndex * itemWidth;
        
        if (animate) {
            isAnimating = true;
            carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            carousel.style.transform = `translateX(${translateX}px)`;
            
            // Resetear animación después de completar
            setTimeout(() => {
                isAnimating = false;
            }, 600);
        } else {
            carousel.style.transition = 'none';
            carousel.style.transform = `translateX(${translateX}px)`;
        }
    }
    
    // FLECHA IZQUIERDA - ANTERIOR CON EFECTO INFINITO
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const itemsPerView = getItemsPerView();
            const totalItems = items.length;
            
            if (currentIndex === 0) {
                // Si estamos en el primer elemento, ir al último
                currentIndex = totalItems - itemsPerView;
                updateCarousel(false); // Sin animación para el salto
                setTimeout(() => {
                    currentIndex = totalItems - itemsPerView;
                    updateCarousel();
                }, 50);
            } else {
                // MOVER HACIA ATRÁS - 1 ELEMENTO
                currentIndex = Math.max(0, currentIndex - 1);
                updateCarousel();
            }
        });
    }
    
    // FLECHA DERECHA - SIGUIENTE CON EFECTO INFINITO
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const itemsPerView = getItemsPerView();
            const totalItems = items.length;
            const maxIndex = totalItems - itemsPerView;
            
            if (currentIndex >= maxIndex) {
                // Si estamos en el último elemento, ir al primero
                currentIndex = 0;
                updateCarousel(false); // Sin animación para el salto
                setTimeout(() => {
                    currentIndex = 0;
                    updateCarousel();
                }, 50);
            } else {
                // MOVER HACIA ADELANTE - 1 ELEMENTO
                currentIndex = Math.min(maxIndex, currentIndex + 1);
                updateCarousel();
            }
        });
    }
    
    // Recalcular en resize
    window.addEventListener('resize', () => {
        updateCarousel(false);
    });
    
    // Inicializar
    updateCarousel(false);
}

// Configurar botones de descarga de certificados
function setupDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const pdfFile = this.getAttribute('data-pdf');
            
            if (pdfFile && !pdfFile.includes('placeholder')) {
                const link = document.createElement('a');
                link.href = pdfFile;
                link.download = pdfFile.split('/').pop();
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert('En una implementación real, este botón descargaría el archivo PDF correspondiente.');
            }
        });
    });
}