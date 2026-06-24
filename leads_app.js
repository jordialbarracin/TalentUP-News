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

    // Generador de Tarjeta de Resumen Gigante
    function generateSummary(newsArray, categoryName) {
        if (!newsArray || newsArray.length === 0) return '';
        
        const topNews = newsArray.slice(0, 3);
        let catText = categoryName === 'todas' ? 'el mercado general' : `el sector de ${categoryName}`;
        
        let listItems = topNews.map(item => {
            let nlpTags = '';
            if (item.empresa && item.empresa !== 'Desconocida') {
                nlpTags += `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] md:text-xs font-bold uppercase tracking-widest bg-google-blue/10 text-google-blue border border-google-blue/20 mr-2 mb-1 shadow-sm">🏢 ${item.empresa}</span>`;
            }
            if (item.ubicacion && item.ubicacion !== 'Nacional') {
                nlpTags += `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] md:text-xs font-bold uppercase tracking-widest bg-google-red/10 text-google-red border border-google-red/20 mr-2 mb-1 shadow-sm">📍 ${item.ubicacion}</span>`;
            }

            return `
                <li class="flex items-start mb-5 last:mb-0">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-google-blue/10 text-google-blue flex items-center justify-center mr-4 mt-0.5 shadow-sm">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                    </span>
                    <div class="flex flex-col">
                        ${nlpTags ? `<div class="flex flex-wrap mb-1 mt-[-4px]">${nlpTags}</div>` : ''}
                        <span class="text-slate-800 font-semibold text-lg md:text-xl leading-snug">
                            ${item.titulo}
                        </span>
                    </div>
                </li>
            `;
        }).join('');
        
        return `
            <div class="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-xl group transition-all duration-500 hover:border-slate-300 hover:shadow-2xl">
                <!-- Línea Neón Superior -->
                <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-google-blue via-google-red to-google-yellow opacity-90"></div>
                
                <!-- Resplandor de fondo -->
                <div class="absolute -top-32 -right-32 w-80 h-80 bg-google-blue/10 rounded-full blur-3xl group-hover:bg-google-red/10 transition-colors duration-1000"></div>
                
                <div class="relative z-10">
                    <div class="flex items-center mb-6">
                        <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mr-4 border border-slate-200 shadow-sm">
                            <span class="text-2xl">✨</span>
                        </div>
                        <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Resumen Diario</h3>
                    </div>
                    
                    <p class="text-slate-500 mb-6 font-semibold tracking-widest uppercase text-xs">Puntos clave en ${catText}</p>
                    
                    <ul class="list-none p-0 m-0">
                        ${listItems}
                    </ul>
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

            // Colores Neón Google I/O en modo claro
            let badgeColor = "text-slate-600 bg-slate-100 border-slate-200";
            let dotColor = "bg-slate-400";
            let hoverGlow = "group-hover:border-slate-400";
            
            if (item.categoria === "Expansión") {
                badgeColor = "text-google-green bg-google-green/10 border-google-green/20";
                dotColor = "bg-google-green";
                hoverGlow = "hover:border-google-green/50 hover:shadow-google-green/10";
            } else if (item.categoria === "Inversión") {
                badgeColor = "text-google-yellow bg-google-yellow/10 border-google-yellow/20";
                dotColor = "bg-google-yellow";
                hoverGlow = "hover:border-google-yellow/50 hover:shadow-google-yellow/10";
            }

            const card = document.createElement('article');
            card.className = `relative bg-white/80 backdrop-blur-md rounded-[2rem] p-6 md:p-8 border border-slate-200 transition-all duration-500 flex flex-col group overflow-hidden shadow-sm hover:shadow-xl ${hoverGlow}`;
            card.style.animation = `fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards ${index * 0.05}s`;
            card.style.opacity = '0';
            
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
                        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="focus:outline-none">
                            <span class="absolute inset-0" aria-hidden="true"></span>
                            ${item.titulo}
                        </a>
                    </h2>
                    
                    <p class="text-sm md:text-base text-slate-600 leading-relaxed mb-8 font-light">${cleanSummary}</p>
                    
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
});
