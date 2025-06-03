/**
 * ASOCIACIÓN DE INGENIEROS DE SOFTWARE
 * JavaScript Principal - Optimizado para SEO y UX
 * ==============================================
 */

// Configuración global
const CONFIG = {
    headerOffset: 80,
    animationDelay: 100,
    scrollThrottle: 16,
    counterDuration: 2000,
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phonePattern: /^[+]?[\d\s\-\(\)]{9,}$/
};

// Estado global de la aplicación
const APP_STATE = {
    isMenuOpen: false,
    hasScrolled: false,
    countersAnimated: false,
    isFormSubmitting: false
};

/**
 * ==============================================
 * INICIALIZACIÓN DE LA APLICACIÓN
 * ==============================================
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Asociación de Ingenieros de Software...');
    
    // Inicializar todos los módulos
    initNavigation();
    initScrollEffects();
    initAnimations();
    initFormHandling();
    initAccessibility();
    initPerformanceOptimizations();
    
    console.log('✅ Aplicación inicializada correctamente');
});

/**
 * ==============================================
 * NAVEGACIÓN Y MENÚ MÓVIL
 * ==============================================
 */
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const header = document.querySelector('header');
    
    if (!hamburger || !navLinks) return;

    // Toggle menú móvil
    hamburger.addEventListener('click', function() {
        toggleMobileMenu();
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            closeMobileMenu();
        }
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (APP_STATE.isMenuOpen && 
            !hamburger.contains(e.target) && 
            !navLinks.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Navegación suave
    initSmoothScrolling();
    
    // Highlight del enlace activo
    initActiveNavHighlight();
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    APP_STATE.isMenuOpen = !APP_STATE.isMenuOpen;
    
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', APP_STATE.isMenuOpen);
    
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = APP_STATE.isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    APP_STATE.isMenuOpen = false;
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

function initSmoothScrolling() {
    // Navegación suave para todos los enlaces de ancla
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - CONFIG.headerOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Actualizar URL sin hacer scroll
                history.pushState(null, null, targetId);
                
                // Cerrar menú móvil si está abierto
                closeMobileMenu();
            }
        });
    });
}

function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - CONFIG.headerOffset - 50;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && 
                window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateActiveNav, CONFIG.scrollThrottle));
}

/**
 * ==============================================
 * EFECTOS DE SCROLL
 * ==============================================
 */
function initScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    const scrollIndicator = document.getElementById('scrollIndicator');
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Ocultar/mostrar header
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        // Actualizar indicador de progreso
        updateScrollIndicator(scrollIndicator);
        
        // Efecto parallax sutil en hero
        updateParallaxEffect(scrollTop);
        
        lastScrollTop = scrollTop;
        APP_STATE.hasScrolled = scrollTop > 50;
    }
    
    window.addEventListener('scroll', throttle(handleScroll, CONFIG.scrollThrottle));
}

function updateScrollIndicator(indicator) {
    if (!indicator) return;
    
    const scrolled = (window.scrollY / 
        (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    indicator.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
}

function updateParallaxEffect(scrollTop) {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const speed = 0.5;
    const yPos = -(scrollTop * speed);
    hero.style.transform = `translate3d(0, ${yPos}px, 0)`;
}

/**
 * ==============================================
 * ANIMACIONES Y EFECTOS VISUALES
 * ==============================================
 */
function initAnimations() {
    // Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Animar contadores si es la sección de estadísticas
                if (entry.target.closest('.stats') && !APP_STATE.countersAnimated) {
                    animateCounters();
                    APP_STATE.countersAnimated = true;
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    document.querySelectorAll('.course-card, .stat-item, .about-text, .contact-form')
        .forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = CONFIG.counterDuration;
        const step = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Formatear número según el contenido original
            const originalText = counter.textContent;
            if (originalText.includes('%')) {
                counter.textContent = Math.floor(current) + '%';
            } else if (originalText.includes('+')) {
                counter.textContent = Math.floor(current) + '+';
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

/**
 * ==============================================
 * MANEJO DE FORMULARIOS
 * ==============================================
 */
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    // Validación en tiempo real
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Manejo del envío del formulario
    contactForm.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Validaciones específicas
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
            }
            break;
            
        case 'email':
            if (!CONFIG.emailPattern.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, introduce un email válido';
            }
            break;
            
        case 'phone':
            if (value && !CONFIG.phonePattern.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, introduce un teléfono válido';
            }
            break;
            
        case 'course':
            if (!value) {
                isValid = false;
                errorMessage = 'Por favor, selecciona un curso';
            }
            break;
    }
    
    // Campos requeridos
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    }
    
    showFieldValidation(field, isValid, errorMessage);
    return isValid;
}

function showFieldValidation(field, isValid, errorMessage) {
    // Remover mensajes de error previos
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Actualizar estilos del campo
    field.classList.toggle('error', !isValid);
    field.classList.toggle('valid', isValid && field.value.trim());
    
    // Mostrar mensaje de error si es necesario
    if (!isValid && errorMessage) {
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = errorMessage;
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'block';
        
        field.parentNode.appendChild(errorElement);
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (APP_STATE.isFormSubmitting) return;
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Validar todos los campos
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showFormMessage('Por favor, corrige los errores antes de enviar', 'error');
        return;
    }
    
    // Verificar checkbox de privacidad
    const privacyCheckbox = form.querySelector('input[name="privacy"]');
    if (privacyCheckbox && !privacyCheckbox.checked) {
        showFormMessage('Debes aceptar la política de privacidad', 'error');
        return;
    }
    
    try {
        APP_STATE.isFormSubmitting = true;
        
        // Actualizar estado del botón
        const originalText = submitButton.textContent;
        submitButton.textContent = '📤 Enviando...';
        submitButton.disabled = true;
        
        // Simular envío (aquí integrarías con tu backend)
        await simulateFormSubmission(formData);
        
        // Éxito
        showFormMessage(
            `¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto, ${formData.get('name')}.`,
            'success'
        );
        
        // Limpiar formulario
        form.reset();
        
        // Analytics/tracking (si está disponible)
        trackFormSubmission(formData);
        
    } catch (error) {
        console.error('Error al enviar formulario:', error);
        showFormMessage('Ha ocurrido un error. Por favor, inténtalo de nuevo.', 'error');
    } finally {
        APP_STATE.isFormSubmitting = false;
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

function showFormMessage(message, type = 'info') {
    // Remover mensaje previo
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crear nuevo mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Estilos básicos
    Object.assign(messageElement.style, {
        padding: '1rem',
        borderRadius: '0.5rem',
        marginTop: '1rem',
        fontWeight: '500',
        backgroundColor: type === 'success' ? '#10b981' : 
                        type === 'error' ? '#ef4444' : '#3b82f6',
        color: 'white',
        textAlign: 'center'
    });
    
    // Insertar después del formulario
    const form = document.querySelector('.contact-form');
    form.appendChild(messageElement);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

async function simulateFormSubmission(formData) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Aquí harías la petición real a tu servidor
    console.log('📧 Datos del formulario:', Object.fromEntries(formData));
    
    // Para desarrollo, siempre tiene éxito
    return { success: true };
}

function trackFormSubmission(formData) {
    // Google Analytics o similar
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            event_category: 'contact',
            event_label: formData.get('course') || 'general'
        });
    }
}

/**
 * ==============================================
 * FUNCIONES DE CURSOS
 * ==============================================
 */
function enrollCourse(courseName) {
    // Mostrar modal de información del curso
    showCourseModal(courseName);
    
    // Scroll suave al formulario de contacto
    setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const offsetTop = contactSection.offsetTop - CONFIG.headerOffset;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Pre-rellenar el formulario
            const courseSelect = document.getElementById('course');
            if (courseSelect) {
                const courseValue = courseName.toLowerCase().includes('java') ? 'java' :
                                  courseName.toLowerCase().includes('python') ? 'python' :
                                  courseName.toLowerCase().includes('javascript') ? 'javascript' : '';
                
                if (courseValue) {
                    courseSelect.value = courseValue;
                    courseSelect.dispatchEvent(new Event('change'));
                }
            }
        }
    }, 500);
}

function showCourseModal(courseName) {
    const modalContent = getCourseDetails(courseName);
    
    // Crear modal simple
    const modal = document.createElement('div');
    modal.className = 'course-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeCourseModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeCourseModal()" aria-label="Cerrar modal">×</button>
            <h3>¡Excelente elección! 🎉</h3>
            <div class="modal-body">
                <h4>Curso de ${courseName}</h4>
                ${modalContent}
                <div class="modal-actions">
                    <button onclick="closeCourseModal()" class="btn-secondary">Más información</button>
                    <button onclick="closeCourseModal()" class="btn-primary">¡Inscribirme ahora!</button>
                </div>
            </div>
        </div>
    `;
    
    // Estilos del modal
    Object.assign(modal.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    });
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Auto-cerrar después de 10 segundos
    setTimeout(() => {
        if (document.body.contains(modal)) {
            closeCourseModal();
        }
    }, 10000);
}

function getCourseDetails(courseName) {
    const details = {
        'Java': `
            <p><strong>💰 Precio:</strong> 495€ - Pago único</p>
            <p><strong>⏱️ Duración:</strong> 120 horas lectivas</p>
            <p><strong>📚 Modalidad:</strong> Online con soporte 24/7</p>
            <p><strong>🎓 Certificación:</strong> Oficial Java Developer</p>
            <p><strong>🚀 Inserción laboral:</strong> 95% garantizada</p>
        `,
        'Python': `
            <p><strong>💰 Precio:</strong> 495€ - Pago único</p>
            <p><strong>⏱️ Duración:</strong> 100 horas lectivas</p>
            <p><strong>📚 Modalidad:</strong> Online con proyectos reales</p>
            <p><strong>🎓 Certificación:</strong> Python Developer + Data Science</p>
            <p><strong>🚀 Inserción laboral:</strong> 95% garantizada</p>
        `,
        'JavaScript Frontend': `
            <p><strong>💰 Precio:</strong> 495€ - Pago único</p>
            <p><strong>⏱️ Duración:</strong> 140 horas lectivas</p>
            <p><strong>📚 Modalidad:</strong> Online con portfolio incluido</p>
            <p><strong>🎓 Certificación:</strong> Frontend Developer</p>
            <p><strong>🚀 Inserción laboral:</strong> 95% garantizada</p>
        `
    };
    
    return details[courseName] || details['Java'];
}

function closeCourseModal() {
    const modal = document.querySelector('.course-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

/**
 * ==============================================
 * CHAT Y FUNCIONES ADICIONALES
 * ==============================================
 */
function openChat() {
    // Simular apertura de chat
    alert('💬 Chat en vivo próximamente disponible.\n\nMientras tanto, puedes contactarnos por:\n📧 Email: info@asociacion-de-ingenierios-de-software.es\n📞 Teléfono: 900 123 456');
}

/**
 * ==============================================
 * ACCESIBILIDAD
 * ==============================================
 */
function initAccessibility() {
    // Manejo de navegación por teclado
    document.addEventListener('keydown', function(e) {
        // Cerrar modal con Escape
        if (e.key === 'Escape') {
            closeCourseModal();
            closeMobileMenu();
        }
        
        // Navegación por teclado en menú móvil
        if (e.key === 'Tab' && APP_STATE.isMenuOpen) {
            trapFocusInMenu(e);
        }
    });
    
    // Focus trap para modales
    function trapFocusInMenu(e) {
        const navLinks = document.querySelectorAll('.nav-links a, .hamburger');
        const firstFocusable = navLinks[0];
        const lastFocusable = navLinks[navLinks.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }
    
    // Anunciar cambios de página para lectores de pantalla
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionTitle = entry.target.querySelector('h1, h2, h3');
                if (sectionTitle) {
                    // Actualizar el título de la página dinámicamente
                    document.title = `${sectionTitle.textContent} | Asociación de Ingenieros de Software`;
                }
            }
        });
    }, { threshold: 0.7 });
    
    sections.forEach(section => observer.observe(section));
}

/**
 * ==============================================
 * OPTIMIZACIONES DE RENDIMIENTO
 * ==============================================
 */
function initPerformanceOptimizations() {
    // Lazy loading para imágenes
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Prefetch de recursos críticos
    const linkPrefetch = document.createElement('link');
    linkPrefetch.rel = 'prefetch';
    linkPrefetch.href = '/api/courses';
    document.head.appendChild(linkPrefetch);
    
    // Service Worker registration (si está disponible)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('🔧 Service Worker registrado:', registration);
                })
                .catch(error => {
                    console.log('❌ Error al registrar Service Worker:', error);
                });
        });
    }
}

/**
 * ==============================================
 * UTILIDADES
 * ==============================================
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * ==============================================
 * ANALYTICS Y SEGUIMIENTO
 * ==============================================
 */
function initAnalytics() {
    // Seguimiento de clics en CTAs
    document.querySelectorAll('.cta-button, .course-button').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            const section = this.closest('section')?.id || 'unknown';
            
            // Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    event_category: 'engagement',
                    event_label: buttonText,
                    custom_parameter_1: section
                });
            }
            
            console.log('📊 CTA Click:', { buttonText, section });
        });
    });
    
    // Seguimiento de tiempo en página
    let timeOnPage = 0;
    const timeTracker = setInterval(() => {
        timeOnPage += 10;
        
        // Enviar evento cada minuto
        if (timeOnPage % 60 === 0) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'time_on_page', {
                    event_category: 'engagement',
                    value: timeOnPage
                });
            }
        }
    }, 10000);
    
    // Limpiar al salir de la página
    window.addEventListener('beforeunload', () => {
        clearInterval(timeTracker);
    });
}

/**
 * ==============================================
 * MANEJO DE ERRORES
 * ==============================================
 */
window.addEventListener('error', function(e) {
    console.error('❌ Error JavaScript:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
    
    // Enviar error a servicio de monitoreo (opcional)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: e.message,
            fatal: false
        });
    }
});

/**
 * ==============================================
 * FUNCIONES ADICIONALES PARA MEJOR UX
 * ==============================================
 */

// Mostrar notificación de cookies (RGPD)
function showCookieNotice() {
    if (localStorage.getItem('cookies-accepted') === 'true') {
        return;
    }
    
    const notice = document.createElement('div');
    notice.className = 'cookie-notice';
    notice.innerHTML = `
        <div class="cookie-content">
            <p>🍪 Utilizamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestra 
            <a href="/politica-cookies" target="_blank">política de cookies</a>.</p>
            <div class="cookie-actions">
                <button onclick="acceptCookies()" class="btn-primary">Aceptar</button>
                <button onclick="rejectCookies()" class="btn-secondary">Rechazar</button>
            </div>
        </div>
    `;
    
    // Estilos para la notificación
    Object.assign(notice.style, {
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '1rem',
        zIndex: '9999',
        transform: 'translateY(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notice);
    
    // Animar entrada
    setTimeout(() => {
        notice.style.transform = 'translateY(0)';
    }, 100);
}

function acceptCookies() {
    localStorage.setItem('cookies-accepted', 'true');
    hideCookieNotice();
    
    // Inicializar analytics si se aceptan las cookies
    initAnalytics();
}

function rejectCookies() {
    localStorage.setItem('cookies-accepted', 'false');
    hideCookieNotice();
}

function hideCookieNotice() {
    const notice = document.querySelector('.cookie-notice');
    if (notice) {
        notice.style.transform = 'translateY(100%)';
        setTimeout(() => {
            notice.remove();
        }, 300);
    }
}

// Mostrar indicador de carga
function showLoadingIndicator() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="spinner"></div>
            <p>Cargando...</p>
        </div>
    `;
    
    Object.assign(loader.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '10001'
    });
    
    document.body.appendChild(loader);
}

function hideLoadingIndicator() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
}

// Detección de dispositivo móvil
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Optimización para móviles
function initMobileOptimizations() {
    if (isMobileDevice()) {
        // Prevenir zoom en inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
            });
            
            input.addEventListener('blur', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                viewport.content = 'width=device-width, initial-scale=1.0';
            });
        });
        
        // Mejorar rendimiento de scroll en móviles
        document.body.style.webkitOverflowScrolling = 'touch';
    }
}

/**
 * ==============================================
 * INICIALIZACIÓN FINAL
 * ==============================================
 */

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar indicador de carga
    showLoadingIndicator();
    
    // Inicializar optimizaciones móviles
    initMobileOptimizations();
    
    // Mostrar notificación de cookies después de un delay
    setTimeout(showCookieNotice, 2000);
    
    // Ocultar indicador de carga cuando todo esté listo
    window.addEventListener('load', () => {
        setTimeout(hideLoadingIndicator, 500);
    });
});

// Manejo de redimensionado de ventana
window.addEventListener('resize', debounce(() => {
    // Cerrar menú móvil si se cambia a desktop
    if (window.innerWidth > 768 && APP_STATE.isMenuOpen) {
        closeMobileMenu();
    }
    
    // Recalcular alturas si es necesario
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth <= 768) {
        hero.style.minHeight = `${window.innerHeight}px`;
    }
}, 250));

// Manejo de visibilidad de la página
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👋 Usuario salió de la página');
    } else {
        console.log('👀 Usuario volvió a la página');
    }
});

// Exportar funciones globales necesarias
window.enrollCourse = enrollCourse;
window.openChat = openChat;
window.closeCourseModal = closeCourseModal;
window.acceptCookies = acceptCookies;
window.rejectCookies = rejectCookies;

console.log('🎉 JavaScript de la Asociación de Ingenieros de Software cargado correctamente');

/**
 * ==============================================
 * FUNCIONES DE DESARROLLO Y DEBUG
 * ==============================================
 */

// Solo en desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Consola de debug
    console.log('🔧 Modo desarrollo activado');
    
    // Función para testear animaciones
    window.testAnimations = function() {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('animated');
        });
        animateCounters();
    };
    
    // Función para testear formulario
    window.testForm = function() {
        const form = document.querySelector('.contact-form');
        if (form) {
            form.querySelector('#name').value = 'Test User';
            form.querySelector('#email').value = 'test@example.com';
            form.querySelector('#course').value = 'java';
            form.querySelector('#message').value = 'Mensaje de prueba';
        }
    };
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('📊 Performance metrics:', {
                    'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    'Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
                    'Total Load Time': perfData.loadEventEnd - perfData.navigationStart
                });
            }, 1000);
        });
    }
}