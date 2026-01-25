/**
 * Executa todo o código JavaScript após o carregamento completo do DOM,
 * garantindo que todos os elementos HTML estejam disponíveis.
 */
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Configura a funcionalidade de acordeão para a seção de FAQ.
     */
    function setupFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        if (!faqQuestions.length) return; // Não faz nada se não houver FAQ

        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentNode;
                const answer = item.querySelector('.faq-answer');
                
                item.classList.toggle('active');

                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    answer.style.maxHeight = 0;
                }
            });
        });
    }

    /**
     * Configura o menu de navegação móvel (hamburger).
     */
    function setupMobileMenu() {
        const hamburger = document.querySelector('.menu-hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
            
            // Bloqueia ou libera a rolagem da página quando o menu abre/fecha
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // Opcional: Fechar o menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-list li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = ''; // Libera a rolagem
                }
            });
        });
    }

    /**
     * Configura a animação de "revelar ao rolar" para elementos na página.
     * Usa a API IntersectionObserver para performance.
     */
    function setupScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (!revealElements.length) return;

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // A animação dispara quando 10% do elemento estiver visível
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    /**
     * Inicializa o carrossel de depoimentos usando a biblioteca Swiper.js.
     */
    function initSwiper() {
        if (typeof Swiper === 'undefined') return; // Não executa se a biblioteca não carregou

        new Swiper('.testimonial-swiper', {
            loop: true,             // Cria um loop infinito de slides.
            slidesPerView: 1,       // Começa com 1 slide visível no celular.
            spaceBetween: 20,       // Espaço de 20px entre os slides.
            grabCursor: true,       // Mostra um ícone de "mão" ao passar o mouse.
            pagination: {
              el: '.swiper-pagination',
              clickable: true,      // Permite clicar nas bolinhas para navegar.
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            breakpoints: {
              768: { slidesPerView: 2, spaceBetween: 30 }, // 2 slides para tablets.
              1024: { slidesPerView: 3, spaceBetween: 30 }, // 3 slides para desktops.
            }
        });
    }

    /**
     * Configura o botão de pausa/play do marquee de serviços.
     */
    function setupMarqueeControl() {
        const toggleBtn = document.getElementById('marquee-toggle');
        const marqueeContent = document.querySelector('.marquee-content');
        
        if (!toggleBtn || !marqueeContent) return;

        // Ícones SVG para Play e Pause
        const pauseIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
        const playIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';

        toggleBtn.addEventListener('click', () => {
            const isPaused = marqueeContent.classList.toggle('paused');
            
            if (isPaused) {
                toggleBtn.innerHTML = playIcon;
                toggleBtn.setAttribute('aria-label', 'Reproduzir animação');
            } else {
                toggleBtn.innerHTML = pauseIcon;
                toggleBtn.setAttribute('aria-label', 'Pausar animação');
            }
        });
    }

    /**
     * Monitora a rolagem para evitar que o botão do WhatsApp cubra o rodapé.
     */
    function setupWhatsAppScroll() {
        const footer = document.querySelector('footer');
        const whatsappBtn = document.querySelector('.whatsapp-float');
        
        if (!footer || !whatsappBtn) return;

        function checkScroll() {
            const scrollY = window.scrollY || window.pageYOffset;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const footerHeight = footer.offsetHeight;
            
            const distanceToBottom = docHeight - (scrollY + windowHeight);

            // Troca para absoluto exatamente quando o rodapé tocaria o botão
            if (distanceToBottom <= footerHeight) {
                whatsappBtn.style.position = 'absolute';
                whatsappBtn.style.bottom = (footerHeight + 20) + 'px';
            } else {
                whatsappBtn.style.position = 'fixed';
                whatsappBtn.style.bottom = '20px';
            }
        }

        window.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        checkScroll(); // Chama no início para ajustar se já estiver no fim
    }

    // Chama todas as funções de inicialização
    setupFAQ();
    setupMobileMenu();
    setupScrollReveal();
    initSwiper();
    setupMarqueeControl();
    setupWhatsAppScroll();
});
