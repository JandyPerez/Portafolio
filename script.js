document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    // Se corrigen los selectores para incluir proyectos y certificados/habilidades.
    const allContainers = document.querySelectorAll('#projects, #certificates, #tech-skills'); 
    
    // Inicializa el carrusel de certificados
    initCarousel('certificates');
    
    // Asigna el botón 'Proyectos' como activo por defecto
    const defaultActiveBtn = document.querySelector('.nav-btn[data-target="projects"]');
    if (defaultActiveBtn) {
        defaultActiveBtn.classList.add('active');
        const defaultActiveContainer = document.getElementById('projects');
        if (defaultActiveContainer) {
             defaultActiveContainer.classList.add('active');
        }
    }
    
    // Lógica para cambiar entre Proyectos, Certificados y Tech Grid
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            allContainers.forEach(container => {
                container.classList.remove('active');
            });
            
            const targetContainer = document.getElementById(target);
            if (targetContainer) {
                targetContainer.classList.add('active');
            }
        });
    });
    
    setupDownloadButtons();
    setupProjectAnimations();
});

// Función para animar tarjetas de proyecto al hacer scroll
function setupProjectAnimations() {
    const projectCards = document.querySelectorAll('.project-card-animated');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                // Se oculta y mueve para la siguiente vez que entre en la vista
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    projectCards.forEach(card => {
        observer.observe(card);
    });
}

// Función para manejar el carrusel de certificados
function initCarousel(carouselId) {
    const container = document.getElementById(carouselId);
    if (!container) return;
    
    const carousel = container.querySelector('.carousel');
    const items = Array.from(container.querySelectorAll('.carousel-item'));
    const prevBtn = container.querySelector('.carousel-btn.prev');
    const nextBtn = container.querySelector('.carousel-btn.next');
    
    if (!carousel || items.length === 0) return;
    
    let currentIndex = 0;
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
        // Asegurar que el carrusel tenga un ancho definido por el número de items visibles
        const itemWidth = carousel.offsetWidth / itemsPerView; 
        const translateX = -currentIndex * (carousel.offsetWidth / itemsPerView);
        
        if (animate) {
            isAnimating = true;
            carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            carousel.style.transform = `translateX(${translateX}px)`;
            
            setTimeout(() => {
                isAnimating = false;
            }, 600);
        } else {
            carousel.style.transition = 'none';
            carousel.style.transform = `translateX(${translateX}px)`;
        }
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const itemsPerView = getItemsPerView();
            const totalItems = items.length;
            
            currentIndex = Math.max(0, currentIndex - 1);
            updateCarousel();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const itemsPerView = getItemsPerView();
            const totalItems = items.length;
            const maxIndex = totalItems - itemsPerView;
            
            currentIndex = Math.min(maxIndex, currentIndex + 1);
            updateCarousel();
        });
    }
    
    window.addEventListener('resize', () => {
        updateCarousel(false);
    });
    
    // Inicializar el carrusel al cargar
    updateCarousel(false);
}

// Función para configurar la descarga de PDFs
function setupDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const pdfFile = this.getAttribute('data-pdf');
            
            if (pdfFile && !pdfFile.includes('placeholder') && pdfFile !== 'certificados/certificado5.pdf') {
                const link = document.createElement('a');
                link.href = pdfFile;
                link.download = pdfFile.split('/').pop();
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert('En una implementación real, este botón descargaría el archivo PDF correspondiente. (Este es un enlace de ejemplo)');
            }
        });
    });
}