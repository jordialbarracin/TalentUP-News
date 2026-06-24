document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('news-grid');
    const loader = document.getElementById('loader');
    const summaryContainer = document.getElementById('executive-summary');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sectionTitle = document.getElementById('section-title');
    let allNews = [];

    // Carga de Datos
    if (typeof window_leads_data !== 'undefined') {
        allNews = window_leads_data;
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

    // Generador de Dashboard KPI Analitico
    function generateSummary(newsArray, categoryName) {
        if (!newsArray || newsArray.length === 0) return '';
        
        // 1. Total Volumen
        const totalLeads = newsArray.length;
        
        // 2. Tendencia Dominante (contar categorias si 'todas', si no, es la actual)
        let tendencia = 'Actividad Estable';
        let iconTendencia = '<svg class="w-5 h-5 text-google-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>';
        
        if (categoryName === 'todas') {
            const counts = {};
            newsArray.forEach(n => {
                if(n.categoria) counts[n.categoria] = (counts[n.categoria] || 0) + 1;
            });
            let maxCat = '';
            let maxCount = 0;
            for(let c in counts) {
                if (counts[c] > maxCount) {
                    maxCount = counts[c];
                    maxCat = c;
                }
            }
            if(maxCat) tendencia = `Alta en ${maxCat}`;
        } else {
            tendencia = `Foco en ${categoryName}`;
            if(categoryName === 'Contratacion') iconTendencia = '<svg class="w-5 h-5 text-google-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>';
            if(categoryName === 'Reestructuracion') iconTendencia = '<svg class="w-5 h-5 text-google-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>';
        }

        // 3. Hotspot Geografico
        let hotspot = 'Multizona';
        const locCounts = {};
        newsArray.forEach(n => {
            if (n.ubicacion && n.ubicacion !== 'Nacional' && n.ubicacion !== 'España') {
                locCounts[n.ubicacion] = (locCounts[n.ubicacion] || 0) + 1;
            }
        });
        let maxLoc = '';
        let maxLocCount = 0;
        for(let l in locCounts) {
            if(locCounts[l] > maxLocCount) {
                maxLocCount = locCounts[l];
                maxLoc = l;
            }
        }
        if(maxLoc) {
            hotspot = maxLoc;
        }

        return `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                <!-- KPI 1 -->
                <div class="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div class="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <svg class="w-32 h-32 text-slate-900" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                    </div>
                    <p class="text-slate-500 font-mono text-xs uppercase tracking-widest font-semibold mb-2">Volumen Total</p>
                    <div class="flex items-baseline space-x-2 relative z-10">
                        <h4 class="text-4xl md:text-5xl font-extrabold text-slate-900">${totalLeads}</h4>
                        <span class="text-sm font-medium text-slate-400">Alertas</span>
                    </div>
                </div>

                <!-- KPI 2 -->
                <div class="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between">
                    <div class="flex justify-between items-start mb-2 relative z-10">
                        <p class="text-slate-500 font-mono text-xs uppercase tracking-widest font-semibold">Tendencia Dominante</p>
                        <div class="p-2 bg-slate-50 rounded-full border border-slate-100 shadow-sm">${iconTendencia}</div>
                    </div>
                    <h4 class="text-xl md:text-2xl font-bold text-slate-900 leading-tight mt-2 relative z-10">${tendencia}</h4>
                </div>

                <!-- KPI 3 -->
                <div class="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between">
                    <div class="flex justify-between items-start mb-2 relative z-10">
                        <p class="text-slate-500 font-mono text-xs uppercase tracking-widest font-semibold">Hotspot Geográfico</p>
                        <div class="p-2 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
                            <svg class="w-5 h-5 text-google-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                    </div>
                    <h4 class="text-2xl md:text-3xl font-extrabold text-slate-900 truncate relative z-10">${hotspot}</h4>
                </div>
            </div>
        `;
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

            let badgeColor = "text-slate-500 bg-slate-100 border-slate-200";
            let dotColor = "bg-slate-400";
            let hoverGlow = "hover:border-slate-300 hover:shadow-slate-200/50";
            
            if (item.categoria === "Contratacion") {
                badgeColor = "text-google-green bg-google-green/10 border-google-green/20";
                dotColor = "bg-google-green";
                hoverGlow = "hover:border-google-green/50 hover:shadow-google-green/10";
            } else if (item.categoria === "Aperturas") {
                badgeColor = "text-google-blue bg-google-blue/10 border-google-blue/20";
                dotColor = "bg-google-blue";
                hoverGlow = "hover:border-google-blue/50 hover:shadow-google-blue/10";
            } else if (item.categoria === "Reestructuracion") {
                badgeColor = "text-google-red bg-google-red/10 border-google-red/20";
                dotColor = "bg-google-red";
                hoverGlow = "hover:border-google-red/50 hover:shadow-google-red/10";
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

    const locFilterBtns = document.querySelectorAll('.loc-filter-btn');
    let currentCategory = 'todas';
    let currentLocation = 'todas';

    // Función de filtrado centralizada
    function applyFilter(category, location) {
        if (category !== undefined) currentCategory = category;
        if (location !== undefined) currentLocation = location;

        // Limpiar estilos activos de categoría
        filterBtns.forEach(b => {
            b.classList.remove('active');
            if (b.closest('nav')) {
                b.className = "filter-btn text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 text-slate-500 hover:text-slate-900 hover:bg-slate-100";
            } else {
                b.className = "filter-btn text-xs font-bold px-4 py-3 rounded-full transition-all duration-300 text-slate-500 whitespace-nowrap hover:bg-slate-100";
            }
        });
        
        // Aplicar estilos activos a categoría
        if (currentCategory !== 'todas') {
            filterBtns.forEach(b => {
                if (b.getAttribute('data-categoria') === currentCategory) {
                    b.classList.add('active');
                    if (b.closest('nav')) {
                        b.className = "filter-btn text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 bg-slate-900 text-white shadow-md border border-slate-800 active";
                    } else {
                        b.className = "filter-btn text-xs font-bold px-4 py-3 rounded-full transition-all duration-300 bg-slate-900 text-white whitespace-nowrap active";
                    }
                }
            });
        }

        // Limpiar estilos activos de ubicación
        locFilterBtns.forEach(b => {
            b.classList.remove('active');
            if (b.closest('nav')) {
                b.className = "loc-filter-btn text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 text-slate-500 hover:bg-google-red/10 hover:text-google-red";
            } else {
                b.className = "loc-filter-btn text-xs font-bold px-3 py-3 rounded-full transition-all duration-300 text-slate-500 whitespace-nowrap hover:bg-google-red/10 hover:text-google-red";
            }
        });

        // Aplicar estilos activos a ubicación
        if (currentLocation !== 'todas') {
            locFilterBtns.forEach(b => {
                if (b.getAttribute('data-ubicacion') === currentLocation) {
                    b.classList.add('active');
                    if (b.closest('nav')) {
                        b.className = "loc-filter-btn text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 bg-google-red text-white shadow-md active";
                    } else {
                        b.className = "loc-filter-btn text-xs font-bold px-3 py-3 rounded-full transition-all duration-300 bg-google-red text-white whitespace-nowrap active";
                    }
                }
            });
        }

        // Título dinámico
        if (sectionTitle) {
            let locTitle = currentLocation !== 'todas' ? ` - ${currentLocation}` : '';
            if (currentCategory === 'todas') {
                sectionTitle.innerHTML = `Radar de <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-google-blue via-google-red to-google-yellow">Leads B2B</span>${locTitle}`;
            } else {
                sectionTitle.innerHTML = `Cluster de Datos: <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-google-blue to-google-green">${currentCategory}</span>${locTitle}`;
            }
        }
        
        // Renderizar noticias
        let filtered = allNews;
        if (currentCategory !== 'todas') {
            filtered = filtered.filter(n => n.categoria === currentCategory);
        }
        if (currentLocation !== 'todas') {
            // Check if location is exactly mentioned, or just a generic check
            filtered = filtered.filter(n => (n.ubicacion && n.ubicacion.includes(currentLocation)) || (n.titulo && n.titulo.includes(currentLocation)) || (n.resumen && n.resumen.includes(currentLocation)));
        }
        
        renderNews(filtered, currentCategory);
    }

    // Filtros de navegación (Botones)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.currentTarget.getAttribute('data-categoria');
            applyFilter(category, undefined);
        });
    });

    locFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let location = e.currentTarget.getAttribute('data-ubicacion');
            // Toggle off if already active
            if (currentLocation === location) {
                location = 'todas';
            }
            applyFilter(undefined, location);
        });
    });

    // Filtros de navegación (Logos)
    const logoDesktop = document.getElementById('logo-desktop');
    const logoMobile = document.getElementById('logo-mobile');
    
    if (logoDesktop) {
        logoDesktop.addEventListener('click', () => applyFilter('todas', 'todas'));
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
