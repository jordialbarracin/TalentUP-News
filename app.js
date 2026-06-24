document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('news-grid');
    const loader = document.getElementById('loader');
    const summaryContainer = document.getElementById('executive-summary');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sectionTitle = document.getElementById('section-title');
    let allNews = [];

    // Carga de Datos
    if (typeof window_news_data !== 'undefined') {
        allNews = window_news_data;
        loader.style.display = 'none';
        renderNews(allNews, 'todas');
    } else {
        loader.innerHTML = `
            <div class="text-center p-12 bg-white/80 backdrop-blur-md rounded-[2rem] border border-slate-200 shadow-xl">
                <div class="text-6xl mb-6">⚠️</div>
                <h3 class="text-2xl font-bold text-slate-900 mb-2">Base de datos inactiva</h3>
                <p class="text-slate-500 font-mono text-sm">Ejecuta el script de rastreo (python rastreador.py) para inyectar datos.</p>
            </div>
        `;
    }

    // Eliminar bloque de resumen y KPIs (Ir directo al grano)
    function generateSummary(newsArray, categoryName) {
        return '';
    }

    // Pintar Tarjetas Estilo Bento Box
    function renderNews(newsArray, categoryName = 'todas') {
        grid.innerHTML = '';
        
        // Ordenar por fecha de más reciente a más antigua
        let sortedArray = [...newsArray].sort((a, b) => {
            const dateA = new Date(a.fecha).getTime();
            const dateB = new Date(b.fecha).getTime();
            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;
            return dateB - dateA;
        });
        
        if (summaryContainer) {
            summaryContainer.innerHTML = generateSummary(sortedArray, categoryName);
        }
        
        if (sortedArray.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-24 bg-white/50 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-slate-300">
                    <p class="text-slate-500 font-mono text-sm tracking-widest uppercase">No data found in cluster.</p>
                </div>`;
            return;
        }

        sortedArray.forEach((item, index) => {
            const tmp = document.createElement("DIV");
            tmp.innerHTML = item.resumen;
            const cleanSummary = tmp.textContent || tmp.innerText || "";

            let formattedDate = item.fecha;
            try {
                const d = new Date(item.fecha);
                if (!isNaN(d.getTime())) {
                    formattedDate = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase();
                }
            } catch(e) {}

            // Colores Neón Google I/O en modo claro
            let badgeColor = "text-slate-600 bg-slate-100 border-slate-200";
            let dotColor = "bg-slate-400";
            let hoverGlow = "group-hover:border-slate-400";
            
            if (item.categoria === "Legislación") {
                badgeColor = "text-google-yellow bg-google-yellow/10 border-google-yellow/20";
                dotColor = "bg-google-yellow";
                hoverGlow = "hover:border-google-yellow/50 hover:shadow-google-yellow/10";
            } else if (item.categoria === "Mercado") {
                badgeColor = "text-google-blue bg-google-blue/10 border-google-blue/20";
                dotColor = "bg-google-blue";
                hoverGlow = "hover:border-google-blue/50 hover:shadow-google-blue/10";
            } else if (item.categoria === "ETTs") {
                badgeColor = "text-google-green bg-google-green/10 border-google-green/20";
                dotColor = "bg-google-green";
                hoverGlow = "hover:border-google-green/50 hover:shadow-google-green/10";
            }

            let cardNlpTags = '';
            if (item.empresa && item.empresa !== 'Desconocida') {
                cardNlpTags += `<span class="inline-flex items-center px-2 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-200 mr-2 mb-2">🏢 ${item.empresa}</span>`;
            }
            if (item.ubicacion && item.ubicacion !== 'Nacional') {
                cardNlpTags += `<span class="inline-flex items-center px-2 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-200 mr-2 mb-2">📍 ${item.ubicacion}</span>`;
            }
            let tagsHtml = cardNlpTags ? `<div class="flex flex-wrap mb-3 mt-[-4px] relative z-20 pointer-events-none">${cardNlpTags}</div>` : '';

            const card = document.createElement('article');
            card.className = `relative bg-white/80 backdrop-blur-md rounded-[2rem] p-6 md:p-8 border border-slate-200 transition-all duration-500 flex flex-col group overflow-hidden shadow-sm hover:shadow-xl ${hoverGlow} cursor-pointer`;
            card.style.animation = `fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards ${index * 0.05}s`;
            card.style.opacity = '0';
            
            card.addEventListener('click', () => {
                openModal(item, badgeColor, dotColor, cardNlpTags, cleanSummary, formattedDate);
            });
            
            card.innerHTML = `
                <!-- Efecto resplandor sutil interior -->
                <div class="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div class="relative z-10 w-full flex-1">
                    <div class="flex justify-between items-center mb-6">
                        <span class="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border ${badgeColor}">
                            <span class="w-1.5 h-1.5 rounded-full mr-2 ${dotColor} shadow-[0_0_8px_currentColor]"></span>
                            ${item.categoria}
                        </span>
                        <span class="text-xs font-mono text-slate-400 tracking-wider">${formattedDate}</span>
                    </div>
                    
                    <h2 class="text-xl md:text-2xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-google-blue transition-colors duration-300">
                        <span class="absolute inset-0 z-10" aria-hidden="true"></span>
                        ${item.titulo}
                    </h2>
                    
                    ${tagsHtml}
                    
                    <p class="text-sm md:text-base text-slate-600 leading-relaxed mb-8 font-light line-clamp-3">${cleanSummary}</p>
                    
                    <div class="pt-6 border-t border-slate-100 flex items-center mt-auto">
                        <div class="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center mr-3 border border-slate-200 group-hover:border-slate-300 transition-colors">
                            <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-google-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        </div>
                        <span class="text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest">${item.fuente}</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Función de filtrado centralizada
    function applyFilter(category) {
        // Limpiar estilos activos
        filterBtns.forEach(b => {
            b.classList.remove('active');
            if (b.closest('nav')) {
                b.className = "filter-btn text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 text-slate-500 hover:text-slate-900 hover:bg-slate-100";
            } else {
                b.className = "filter-btn text-xs font-bold px-5 py-3 rounded-full transition-all duration-300 text-slate-500 whitespace-nowrap hover:bg-slate-100";
            }
        });
        
        // Aplicar estilos activos al botón correcto (si no es 'todas')
        if (category !== 'todas') {
            filterBtns.forEach(b => {
                if (b.getAttribute('data-categoria') === category) {
                    b.classList.add('active');
                    if (b.closest('nav')) {
                        b.className = "filter-btn text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 bg-slate-900 text-white shadow-md border border-slate-800 active";
                    } else {
                        b.className = "filter-btn text-xs font-bold px-5 py-3 rounded-full transition-all duration-300 bg-slate-900 text-white whitespace-nowrap active";
                    }
                }
            });
        }

        // Título dinámico
        if (sectionTitle) {
            if (category === 'todas') {
                sectionTitle.innerHTML = 'Inteligencia de <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-google-blue via-google-red to-google-yellow">Recursos Humanos</span>';
            } else {
                sectionTitle.innerHTML = `Cluster de Datos: <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-google-blue to-google-green">${category}</span>`;
            }
        }
        
        // Renderizar noticias
        if (category === 'todas') {
            renderNews(allNews, 'todas');
        } else {
            const filtered = allNews.filter(n => n.categoria === category);
            renderNews(filtered, category);
        }
    }

    // Filtros de navegación (Botones)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.currentTarget.getAttribute('data-categoria');
            applyFilter(category);
        });
    });

    // Filtros de navegación (Logos)
    const logoDesktop = document.getElementById('logo-desktop');
    const logoMobile = document.getElementById('logo-mobile');
    
    if (logoDesktop) {
        logoDesktop.addEventListener('click', () => applyFilter('todas'));
    }
    if (logoMobile) {
        logoMobile.addEventListener('click', () => applyFilter('todas', 'todas'));
    }

    // --- LOGICA DEL MODAL INMERSIVO ---
    const modal = document.getElementById('news-modal');
    const modalBox = document.getElementById('modal-content-box');
    const closeBtn = document.getElementById('close-modal');
    const backdrop = document.getElementById('modal-backdrop');

    function openModal(item, badgeColor, dotColor, tagsHtml, cleanSummary, formattedDate) {
        if (!modal) return;
        
        // Rellenar datos
        document.getElementById('modal-meta').innerHTML = `
            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border ${badgeColor}">
                <span class="w-1.5 h-1.5 rounded-full mr-2 ${dotColor} shadow-[0_0_8px_currentColor]"></span>
                ${item.categoria}
            </span>
            <span class="text-xs font-mono text-slate-400 tracking-wider">${formattedDate}</span>
        `;
        document.getElementById('modal-title').innerText = item.titulo;
        document.getElementById('modal-tags').innerHTML = tagsHtml;
        document.getElementById('modal-summary').innerText = cleanSummary;
        document.getElementById('modal-source').innerText = item.fuente;
        document.getElementById('modal-link').href = item.url;

        // Mostrar con animacion
        modal.classList.remove('hidden');
        // Pequeño delay para la animación Tailwind
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            if (modalBox) {
                modalBox.classList.remove('scale-95');
                modalBox.classList.add('scale-100');
            }
        }, 10);
        document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.add('opacity-0');
        if (modalBox) {
            modalBox.classList.remove('scale-100');
            modalBox.classList.add('scale-95');
        }
        
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // Restaurar scroll
        }, 300); // duracion de la transicion
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});
