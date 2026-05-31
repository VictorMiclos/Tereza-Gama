document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Navbar Scroll Effect
    // ==========================================================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // Mobile Menu Toggle
    // ==========================================================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // ==========================================================================
    // Scroll Reveal Animations
    // ==========================================================================
    const revealElements = document.querySelectorAll('.fade-in, .reveal-up, .reveal-left, .reveal-right');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Trigger animations for elements already in viewport on load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .fade-in');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('active');
            }, index * 200); // Stagger effect
        });
    }, 100);

    // ==========================================================================
    // News Slider (Drag & Buttons)
    // ==========================================================================
    const newsTrack = document.getElementById('news-track');
    const newsPrev = document.getElementById('news-prev');
    const newsNext = document.getElementById('news-next');

    if (newsTrack) {
        // Clone cards for infinite effect
        const cards = Array.from(newsTrack.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            newsTrack.appendChild(clone);
        });

        // Start from the middle (which is the beginning of the cloned set) to allow left scroll immediately
        setTimeout(() => {
            newsTrack.style.scrollBehavior = 'auto';
            newsTrack.scrollLeft = newsTrack.scrollWidth / 2;
            newsTrack.style.scrollBehavior = 'smooth';
        }, 100);

        // Button controls
        const getCardWidth = () => {
            const card = newsTrack.querySelector('.news-card');
            const style = window.getComputedStyle(newsTrack);
            const gap = parseFloat(style.gap) || 0;
            return card.offsetWidth + gap;
        };

        newsPrev?.addEventListener('click', () => {
            newsTrack.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        });

        newsNext?.addEventListener('click', () => {
            newsTrack.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        });

        // Prevent default browser dragging of links and images inside track
        newsTrack.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });

        // Mouse Drag to Scroll
        let isDown = false;
        let startX;
        let scrollLeft;

        newsTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            newsTrack.style.cursor = 'grabbing';
            newsTrack.style.scrollSnapType = 'none'; // disable snap during drag
            newsTrack.style.scrollBehavior = 'auto'; // disable smooth scroll while dragging
            startX = e.pageX - newsTrack.offsetLeft;
            scrollLeft = newsTrack.scrollLeft;
        });

        newsTrack.addEventListener('mouseleave', () => {
            if (!isDown) return;
            isDown = false;
            newsTrack.style.cursor = 'grab';
            newsTrack.style.scrollSnapType = 'x mandatory';
            newsTrack.style.scrollBehavior = 'smooth';
        });

        newsTrack.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            newsTrack.style.cursor = 'grab';
            newsTrack.style.scrollSnapType = 'x mandatory';
            newsTrack.style.scrollBehavior = 'smooth';
        });

        newsTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - newsTrack.offsetLeft;
            const walk = (x - startX) * 2; // scroll-fast multiplier
            newsTrack.scrollLeft = scrollLeft - walk;
        });

        // Infinite Loop Logic
        newsTrack.addEventListener('scroll', () => {
            const maxScroll = newsTrack.scrollWidth / 2;
            
            // Allow a small buffer before jumping so it feels seamless
            if (newsTrack.scrollLeft >= maxScroll + getCardWidth()) {
                newsTrack.style.scrollBehavior = 'auto';
                newsTrack.scrollLeft -= maxScroll;
                if (isDown) scrollLeft -= maxScroll; // Update drag reference
                newsTrack.style.scrollBehavior = 'smooth';
            } else if (newsTrack.scrollLeft <= 0) {
                newsTrack.style.scrollBehavior = 'auto';
                newsTrack.scrollLeft += maxScroll;
                if (isDown) scrollLeft += maxScroll; // Update drag reference
                newsTrack.style.scrollBehavior = 'smooth';
            }
        });
    }

    // ==========================================================================
    // Particle Canvas Animation
    // ==========================================================================
    initParticleCanvas();
});

function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height, particles;
    
    // Brand Colors for particles
    const colors = [
        'rgba(214, 222, 237, 0.6)', // Azul Claro (#d6deed)
        'rgba(250, 165, 54, 0.6)',  // Laranja (#faa536)
        'rgba(255, 255, 255, 0.4)'  // Branco
    ];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    function init() {
        resize();
        particles = [];
        // Calculate particle count based on screen size (prevent lag on mobile)
        const particleCount = Math.min(Math.floor((width * height) / 10000), 100);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    // Line opacity based on distance
                    const opacity = 1 - (distance / 150);
                    // Mix colors or use a faint cyan
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(214, 222, 237, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        drawConnections();
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', init);
    init();
    animate();
}


// ==========================================================================
// News Modal Logic
// ==========================================================================

const newsData = [
    {
        title: "O Papel da Consultoria Estratégica",
        image: "imgs/1- O Papel da Consultoria Estratégica.png",
        date: "15 de Maio, 2026",
        readTime: "2 min leitura",
        content: `
            <p>No cenário corporativo atual, extremamente competitivo e em constante transformação, a consultoria estratégica deixou de ser um luxo para se tornar uma necessidade vital. Muitas vezes, empresas enfrentam gargalos invisíveis aos olhos de quem está imerso na rotina diária das operações. É exatamente aí que entra o valor inestimável de uma visão externa e especializada.</p>
            <p>O papel fundamental de uma consultoria estratégica é diagnosticar a saúde do negócio através de uma análise profunda de processos, mercado, concorrência e cultura organizacional. Ao trazer uma perspectiva isenta de vícios operacionais, consultores conseguem identificar oportunidades de otimização de recursos, mitigação de riscos e, principalmente, caminhos para a inovação.</p>
            <h4>Alinhamento entre Visão e Execução</h4>
            <p>Um dos maiores desafios das empresas é traduzir a visão dos fundadores em ações práticas e mensuráveis. A consultoria atua desenhando um mapa claro (roadmap) para conectar metas audaciosas à execução diária, definindo KPIs precisos e frameworks de gestão.</p>
            <p>Além disso, ao investir em uma consultoria, a empresa absorve conhecimento de alto nível, prepara suas lideranças para cenários de crise e acelera seu crescimento de forma sustentável, garantindo que o negócio não apenas sobreviva, mas lidere o mercado nos próximos anos.</p>
        `
    },
    {
        title: "A Revolução da IA nos Negócios",
        image: "imgs/2- A Revolução da IA nos Negócios.png",
        date: "18 de Maio, 2026",
        readTime: "2 min leitura",
        content: `
            <p>A Inteligência Artificial (IA) já não é uma promessa futurista; ela é a força motriz por trás da maior revolução corporativa deste século. Desde o atendimento ao cliente até a complexa análise preditiva de mercado, a IA está redefinindo o que significa ser uma empresa eficiente e inovadora.</p>
            <p>Historicamente, negócios dependiam inteiramente da capacidade humana de analisar planilhas e relatórios para tomar decisões. Hoje, algoritmos de Machine Learning processam terabytes de dados em segundos, revelando padrões de consumo, prevendo demandas sazonais e otimizando a logística de ponta a ponta com precisão cirúrgica.</p>
            <h4>Hiperpersonalização e Experiência do Cliente</h4>
            <p>Para o consumidor, a IA significa jornadas hiperpersonalizadas. Sistemas inteligentes aprendem com cada interação, oferecendo recomendações de produtos altamente relevantes, antecipando necessidades e resolvendo problemas através de chatbots que operam 24 horas por dia, 7 dias por semana.</p>
            <p>Empresas que adotam a IA ganham uma vantagem competitiva desleal. Elas reduzem custos operacionais, minimizam erros humanos e libertam seus colaboradores de tarefas repetitivas para focarem em criatividade e estratégia. O futuro pertence às organizações que souberem integrar inteligência artificial ao núcleo de seus modelos de negócios.</p>
        `
    },
    {
        title: "E-commerce: Estratégias de Venda",
        image: "imgs/3- E-commerce Estratégias de Venda.png",
        date: "20 de Maio, 2026",
        readTime: "2 min leitura",
        content: `
            <p>O mercado de e-commerce nunca esteve tão saturado. Com barreiras de entrada cada vez menores, ter apenas uma loja virtual bonita já não garante vendas. Para se destacar e construir um negócio digital altamente rentável, é preciso dominar estratégias avançadas de conversão e retenção.</p>
            <p>Um dos pilares modernos do e-commerce é a jornada do usuário (UX). Cada clique extra ou segundo de lentidão na sua página pode custar milhares de reais em vendas perdidas. O checkout deve ser fluido, idealmente em uma única etapa, e oferecer múltiplas opções de pagamento e frete com total transparência.</p>
            <h4>O Poder do Remarketing e da Prova Social</h4>
            <p>As estatísticas mostram que a maioria dos usuários não compra na primeira visita. Campanhas de remarketing dinâmico — mostrando exatamente o produto que o cliente abandonou no carrinho — são essenciais. Aliado a isso, a prova social, através de avaliações com fotos e vídeos de clientes reais, aumenta a confiança e destrói objeções de compra de forma instantânea.</p>
            <p>Além da tecnologia, o sucesso no e-commerce depende de logística impecável e um serviço de pós-venda que transforme compradores esporádicos em verdadeiros fãs e promotores da sua marca.</p>
        `
    },
    {
        title: "O que esperar da Web 3.0?",
        image: "imgs/4- O que esperar da Web 3.0.png",
        date: "22 de Maio, 2026",
        readTime: "1 min leitura",
        content: `
            <p>A internet está passando por sua terceira grande evolução. Se a Web 1.0 era focada em leitura (páginas estáticas) e a Web 2.0 em leitura e escrita (redes sociais e interação), a Web 3.0 introduz a camada da propriedade e descentralização através da tecnologia blockchain.</p>
            <p>Nesta nova fase, o controle dos dados volta para as mãos dos usuários. Redes descentralizadas eliminam a necessidade de grandes intermediários (as "Big Techs"), criando ecossistemas onde a privacidade e a segurança são garantidas por criptografia avançada e contratos inteligentes (Smart Contracts).</p>
            <h4>Tokenização e Novos Modelos de Negócio</h4>
            <p>A Web 3.0 abre portas para economias baseadas em tokens, onde criadores de conteúdo e usuários são recompensados diretamente pela sua participação e engajamento. Organizações Autônomas Descentralizadas (DAOs) estão surgindo como novas formas de estruturar empresas comunitárias, onde decisões são tomadas por consenso dos detentores de tokens.</p>
            <p>Embora ainda existam desafios de usabilidade e regulamentação, as empresas que começarem a explorar a Web 3.0 agora estarão na vanguarda da próxima revolução da internet, criando relações muito mais transparentes e justas com seus consumidores.</p>
        `
    },
    {
        title: "Design Centrado no Usuário",
        image: "imgs/5- Design Centrado no Usuário.png",
        date: "25 de Maio, 2026",
        readTime: "2 min leitura",
        content: `
            <p>Muitas empresas cometem o erro fatal de projetar produtos e serviços baseados unicamente em suas próprias suposições ou limitações técnicas. O Design Centrado no Usuário (User-Centered Design - UCD) inverte essa lógica: ele coloca as necessidades, comportamentos e emoções do cliente no coração de todas as decisões de projeto.</p>
            <p>O processo começa com empatia. Através de pesquisas profundas, entrevistas e mapeamento de jornadas, os designers buscam entender as reais dores dos usuários antes de desenhar qualquer tela. Não se trata apenas de estética (UI), mas da lógica de funcionamento (UX) que torna a navegação intuitiva e fluida.</p>
            <h4>Retorno sobre Investimento (ROI) em Design</h4>
            <p>Investir em UX não é um custo, mas uma alavanca de crescimento. Um design bem executado reduz drasticamente as taxas de abandono, diminui a necessidade de suporte técnico e aumenta a lealdade à marca. Quando um aplicativo ou site funciona perfeitamente, o usuário sente que a empresa respeita o seu tempo.</p>
            <p>Empresas modernas implementam ciclos de testes de usabilidade e prototipagem rápida, garantindo que falhas sejam descobertas ainda na fase de rascunho. O resultado final? Produtos que as pessoas não apenas usam, mas amam e recomendam.</p>
        `
    },
    {
        title: "A Importância de um Site Rápido",
        image: "imgs/6- A Importância de um Site Rápido.png",
        date: "27 de Maio, 2026",
        readTime: "1 min leitura",
        content: `
            <p>Na era digital moderna, a paciência do usuário mede-se em milissegundos. Estudos apontam que mais de 50% dos visitantes abandonam uma página se ela demorar mais de 3 segundos para carregar. A velocidade de um site deixou de ser apenas um aspecto técnico para se tornar uma métrica crucial de negócios.</p>
            <p>Um site lento afeta diretamente a experiência do usuário (UX), gerando frustração e associando uma imagem de amadorismo à sua marca. Pior do que perder a venda imediata é perder a confiança do consumidor, que dificilmente retornará.</p>
            <h4>Impacto no SEO (Google)</h4>
            <p>Além de afastar clientes, a lentidão é severamente punida pelo Google. Os algoritmos de busca utilizam os "Core Web Vitals" (indicadores de velocidade, estabilidade visual e interatividade) como fatores primários de ranqueamento. Se o seu concorrente tiver um site mais rápido, ele inevitavelmente aparecerá primeiro nas buscas.</p>
            <p>Otimizar imagens, minificar códigos, usar redes de distribuição de conteúdo (CDNs) e adotar servidores de alta performance são investimentos obrigatórios. Em resumo: velocidade é conversão, e cada segundo economizado se traduz diretamente em receita para a sua empresa.</p>
        `
    },
    {
        title: "Protegendo Seus Dados na Nuvem",
        image: "imgs/7- Protegendo Seus Dados na Nuvem.png",
        date: "28 de Maio, 2026",
        readTime: "2 min leitura",
        content: `
            <p>A migração em massa para o armazenamento e processamento em nuvem (Cloud Computing) trouxe agilidade e escalabilidade sem precedentes para empresas de todos os tamanhos. No entanto, essa comodidade também expandiu exponencialmente a superfície de ataques cibernéticos. Proteger dados confidenciais na nuvem é hoje o desafio número um dos gestores de TI.</p>
            <p>Muitos líderes assumem equivocadamente que a segurança é responsabilidade exclusiva do provedor de nuvem (AWS, Azure, Google Cloud). Na verdade, vigora o modelo de "Responsabilidade Compartilhada". O provedor protege a infraestrutura física, mas a gestão de acessos, criptografia e configuração segura dos dados é dever da sua empresa.</p>
            <h4>Estratégias de Cibersegurança Essenciais</h4>
            <p>Para manter-se seguro, é crucial implementar a arquitetura Zero Trust (Confiança Zero), onde nenhum usuário ou sistema é confiável por padrão, exigindo verificação contínua. A autenticação multifator (MFA) deve ser obrigatória para todos os acessos corporativos.</p>
            <p>Além disso, backups automatizados, auditorias regulares de permissões e a criptografia de dados (tanto em repouso quanto em trânsito) formam o escudo necessário contra vazamentos e ataques de ransomware. A segurança na nuvem não é um produto que se compra, mas um processo contínuo que deve estar enraizado na cultura da empresa.</p>
        `
    },
    {
        title: "O Futuro do Marketing Digital",
        image: "imgs/8- O Futuro do Marketing Digital.png",
        date: "29 de Maio, 2026",
        readTime: "2 min leitura",
        content: `
            <p>O marketing digital está em um ponto de inflexão crítico. A era de bombardear usuários com anúncios genéricos acabou. Com o endurecimento das leis de privacidade (como GDPR e LGPD) e a morte iminente dos cookies de terceiros, as marcas estão sendo forçadas a reinventar a forma como se conectam com o público.</p>
            <p>O futuro pertence ao "First-Party Data" — dados que o cliente compartilha voluntariamente com a sua empresa em troca de valor real. Isso exige a construção de comunidades engajadas, produção de conteúdo hiper-relevante e estratégias de captação de leads muito mais sofisticadas e transparentes.</p>
            <h4>Automação e Criação Impulsionada por IA</h4>
            <p>A Inteligência Artificial está assumindo o papel de co-piloto nas campanhas. Desde ferramentas que geram variações infinitas de copywriting até algoritmos de mídia programática que compram espaços publicitários com máxima eficiência, a tecnologia está democratizando o alcance de alta precisão.</p>
            <p>As marcas que vencerão nesta nova era serão aquelas que equilibrarem a hiper-automação tecnológica com a humanização da marca, criando experiências autênticas e contando histórias que ressoem verdadeiramente com seus clientes em múltiplos canais simultâneos.</p>
        `
    },
    {
        title: "Metodologias Ágeis em TI",
        image: "imgs/9- Metodologias Ágeis em TI.png",
        date: "30 de Maio, 2026",
        readTime: "2 min leitura",
        content: `
            <p>Durante décadas, projetos de tecnologia eram desenvolvidos usando o modelo tradicional (Waterfall ou Cascata): planejamento engessado de meses, seguido por um longo desenvolvimento, onde o resultado final muitas vezes já nascia obsoleto ou desalinhado com o mercado. As metodologias ágeis surgiram para estilhaçar esse paradigma.</p>
            <p>O modelo ágil (como Scrum e Kanban) propõe o desenvolvimento iterativo e incremental. Ao invés de entregar tudo de uma vez após um ano, a equipe faz entregas funcionais a cada duas semanas (Sprints). Isso permite testes rápidos, coleta imediata de feedback e a capacidade de pivotar a estratégia sem desperdiçar milhões em desenvolvimento inútil.</p>
            <h4>Cultura Acima da Ferramenta</h4>
            <p>A verdadeira força do Ágil não está nas reuniões diárias ou nos post-its na parede, mas na mudança cultural. Ele promove a autonomia das equipes multidisciplinares (squads), a comunicação transparente e a eliminação do microgerenciamento. Errar rápido para aprender mais rápido torna-se o lema principal.</p>
            <p>Para empresas tradicionais, a transformação ágil exige coragem para descentralizar o poder e mudar a forma como medem sucesso — focando no valor entregue ao cliente, e não apenas no cumprimento de cronogramas irreais. É a chave para a sobrevivência na era da inovação acelerada.</p>
        `
    },
    {
        title: "Automação: Menos esforço, mais lucro",
        image: "imgs/10- Automação Menos esforço, mais lucro.png",
        date: "31 de Maio, 2026",
        readTime: "1 min leitura",
        content: `
            <p>Em um mundo onde a velocidade é crucial, desperdiçar o talento e o tempo da sua equipe em tarefas burocráticas e repetitivas é um dos maiores ralos de dinheiro de qualquer organização. A automação de processos não é sobre substituir humanos por máquinas, mas sobre elevar o trabalho humano a um nível estratégico.</p>
            <p>Ferramentas de RPA (Robotic Process Automation) e plataformas de integração (como Zapier e Make) permitem que softwares conversem entre si sem intervenção manual. Emissão de notas fiscais, atualização de CRMs, triagem de e-mails de suporte e rotinas financeiras podem ser totalmente programadas para rodar no piloto automático, com margem de erro zero.</p>
            <h4>O Verdadeiro Retorno sobre o Investimento</h4>
            <p>Os benefícios da automação são duplos: de um lado, corta-se radicalmente os custos operacionais e o tempo de resposta aos clientes. Do outro, a equipe, liberta das tarefas braçais digitais, ganha espaço mental para inovar, planejar e focar em fechamentos de vendas e relacionamento.</p>
            <p>A pergunta para os empresários hoje já não é "devemos automatizar?", mas sim "o que mais podemos automatizar hoje para aumentar nossas margens amanhã?".</p>
        `
    }
];

function openNewsModal(index) {
    const modal = document.getElementById('news-modal');
    if (!modal) return;
    
    const article = newsData[index];
    
    // Populate data
    document.getElementById('news-modal-img').src = article.image;
    document.getElementById('news-modal-img').alt = article.title;
    document.getElementById('news-modal-title').textContent = article.title;
    document.getElementById('news-modal-date').textContent = article.date;
    document.getElementById('news-modal-readtime').textContent = article.readTime;
    document.getElementById('news-modal-text').innerHTML = article.content;
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    
    // Show modal
    modal.classList.remove('hidden');
    // small delay to allow display block to apply before animating opacity
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeNewsModal() {
    const modal = document.getElementById('news-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    
    // Re-enable body scroll
    document.body.style.overflow = 'auto';
    
    // Wait for transition before hiding
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 400); // matches the 0.4s transition in CSS
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeNewsModal();
    }
});