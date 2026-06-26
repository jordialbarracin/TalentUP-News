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
                    <p class="text-slate-500 font-mono text-sm tracking-widest uppercase mt-4">No hay datos en esta categoría.</p>
                </div>
            `;
            return;
        }

        sortedArray.forEach((item, index) => {
            const tmp = document.createElement("DIV");
            tmp.innerHTML = item.resumen;
            const cleanSummary = tmp.textContent || tmp.innerText || "";
            
            let iaImpact = item.impacto && item.impacto !== "N/A" && item.impacto !== "Error al procesar con IA." ? item.impacto : cleanSummary.substring(0, 150) + "...";
            let iaRisk = item.riesgos && item.riesgos !== "N/A" ? item.riesgos : "";

            let formattedDate = item.fecha;
            try {
                const d = new Date(item.fecha);
                if (!isNaN(d.getTime())) {
                    formattedDate = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase();
                }
            } catch(e) {}

            let badgeColor = "text-slate-600 bg-slate-100 border-slate-200";
            let dotColor = "bg-slate-400";
            
            if (item.categoria === "Legislación") {
                badgeColor = "text-google-yellow bg-google-yellow/10 border-google-yellow/20";
                dotColor = "bg-google-yellow";
            } else if (item.categoria === "Mercado") {
                badgeColor = "text-google-blue bg-google-blue/10 border-google-blue/20";
                dotColor = "bg-google-blue";
            } else if (item.categoria === "ETTs") {
                badgeColor = "text-google-green bg-google-green/10 border-google-green/20";
                dotColor = "bg-google-green";
            }

            // Patrón Bento (módulo de 4)
            const modulo = index % 4;
            let gridClass = "col-span-1 row-span-1";
            let contentHtml = "";
            let titleClass = "text-sm md:text-base font-semibold";
            
            if (modulo === 0) {
                // Large Bento (2x2)
                gridClass = "col-span-1 md:col-span-2 row-span-2";
                titleClass = "text-xl md:text-2xl font-bold mb-4";
                contentHtml = `
                    <div class="mt-4 flex-1 flex flex-col gap-3">
                        <div class="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                            <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                Impacto IA
                            </h4>
                            <p class="text-sm text-slate-700 leading-relaxed">${iaImpact}</p>
                        </div>
                        ${iaRisk ? `
                        <div class="bg-yellow-50/50 rounded-xl p-4 border border-yellow-100/50">
                            <h4 class="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                Riesgo IA
                            </h4>
                            <p class="text-sm text-slate-700 leading-relaxed">${iaRisk}</p>
                        </div>
                        ` : ''}
                    </div>
                `;
            } else if (modulo === 3) {
                // Wide Bento (2x1)
                gridClass = "col-span-1 md:col-span-2 row-span-1";
                titleClass = "text-lg md:text-xl font-bold mb-2";
                contentHtml = `
                    <div class="mt-2 flex-1">
                        <p class="text-sm text-slate-600 line-clamp-2">${iaImpact}</p>
                    </div>
                `;
            } else {
                // Small Bento (1x1)
                gridClass = "col-span-1 row-span-1";
                titleClass = "text-base font-semibold mb-2 line-clamp-3";
                contentHtml = `
                    <div class="mt-auto pt-4 flex justify-between items-center text-xs text-slate-400 font-mono uppercase">
                        <span>${item.fuente}</span>
                    </div>
                `;
            }

            const card = document.createElement('article');
            card.className = `${gridClass} relative bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-slate-200 transition-all duration-500 flex flex-col group overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer`;
            card.style.animation = `fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards ${index * 0.05}s`;
            card.style.opacity = '0';
            
            // Background mesh gradient for hover
            const bgGlow = `<div class="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>`;
            
            card.addEventListener('click', () => {
                window.open(item.url, '_blank');
            });
            
            card.innerHTML = `
                ${bgGlow}
                <div class="relative z-10 flex flex-col h-full">
                    <div class="flex items-center justify-between mb-4">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${badgeColor}">
                            <span class="w-1.5 h-1.5 rounded-full mr-2 ${dotColor} shadow-[0_0_8px_currentColor]"></span>
                            ${item.categoria}
                        </span>
                        <span class="text-[10px] font-mono text-slate-400 tracking-wider">${formattedDate}</span>
                    </div>
                    
                    <h2 class="${titleClass} text-slate-900 leading-tight group-hover:text-google-blue transition-colors duration-300">
                        ${item.titulo}
                    </h2>
                    
                    ${contentHtml}
                    
                    ${modulo !== 1 && modulo !== 2 ? `
                    <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-mono uppercase">
                        <span>${item.fuente}</span>
                        <div class="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:border-slate-300 group-hover:bg-google-blue group-hover:text-white transition-all">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </div>
                    </div>` : ''}
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
                b.className = "filter-btn text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent whitespace-nowrap";
            } else {
                b.className = "filter-btn text-xs font-bold px-5 py-3 rounded-full transition-all duration-300 text-slate-500 whitespace-nowrap hover:bg-slate-100 border border-transparent";
            }
        });
        
        // Aplicar estilos activos al botón correcto (si no es 'todas')
        if (category !== 'todas') {
            filterBtns.forEach(b => {
                if (b.getAttribute('data-categoria') === category) {
                    b.classList.add('active');
                    if (b.closest('nav')) {
                        b.className = "filter-btn text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 bg-slate-900 text-white shadow-md border border-slate-800 whitespace-nowrap active";
                    } else {
                        b.className = "filter-btn text-xs font-bold px-5 py-3 rounded-full transition-all duration-300 bg-slate-900 text-white whitespace-nowrap active";
                    }
                }
            });
        }

        // Título dinámico
        if (sectionTitle) {
            if (category === 'todas') {
                sectionTitle.innerHTML = `<span class="text-transparent bg-clip-text bg-gradient-to-r from-google-blue to-google-green">Todas las Noticias</span>`;
            } else {
                sectionTitle.innerHTML = `<span class="text-transparent bg-clip-text bg-gradient-to-r from-google-blue to-google-green">${category}</span>`;
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
        
        // Integrar Insights de la IA en el modal
        const impactoHTML = item.impacto && item.impacto !== "N/A" ? `
            <div class="bg-google-blue/10 border border-google-blue/20 rounded-xl p-4 mb-4">
                <h4 class="text-sm font-bold text-google-blue mb-1 flex items-center"><span class="text-lg mr-2">🎯</span> Impacto en el sector</h4>
                <p class="text-slate-700 text-sm">${item.impacto}</p>
            </div>
        ` : '';
        
        const riesgosHTML = item.riesgos && item.riesgos !== "N/A" ? `
            <div class="bg-google-yellow/10 border border-google-yellow/20 rounded-xl p-4 mb-6">
                <h4 class="text-sm font-bold text-google-yellow mb-1 flex items-center"><span class="text-lg mr-2">⚠️</span> Riesgos y Oportunidades</h4>
                <p class="text-slate-700 text-sm">${item.riesgos}</p>
            </div>
        ` : '';

        document.getElementById('modal-summary').innerHTML = `
            ${impactoHTML}
            ${riesgosHTML}
            <h4 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center"><span class="text-lg mr-2">💡</span> Resumen Ejecutivo</h4>
            <p class="text-base md:text-lg text-slate-600 leading-relaxed font-light">${cleanSummary}</p>
        `;
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
