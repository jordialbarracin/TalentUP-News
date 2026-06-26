import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, ExternalLink } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('./datos/noticias.json')
      .then(res => res.json())
      .then(data => {
        // Sort by date descending
        const sorted = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setNews(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-google-blue rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-mono tracking-widest uppercase">Cargando Inteligencia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12 lg:p-24">
      
      {/* Header */}
      <header className="mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center gap-6"
        >
          <div className="h-16 w-16 bg-gradient-to-br from-google-blue to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-google-blue/20">
            <span className="text-3xl text-white font-extrabold tracking-tighter">TU</span>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">
              TalentUP News
            </h1>
            <p className="text-slate-500 font-mono tracking-widest uppercase text-sm">
              Radar B2B impulsado por Inteligencia Artificial
            </p>
          </div>
        </motion.div>
      </header>

      {/* Bento Grid */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
        {news.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-500 font-mono">
            No hay noticias en la base de datos.
          </div>
        ) : (
          news.map((item, i) => <BentoCard key={i} item={item} index={i} />)
        )}
      </main>
    </div>
  );
}

function BentoCard({ item, index }) {
  const modulo = index % 4;
  
  // Format Date
  let dateStr = item.fecha;
  try {
    const d = new Date(item.fecha);
    if (!isNaN(d.getTime())) {
      dateStr = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase();
    }
  } catch (e) {}

  // Determine Badge Colors
  let badgeClasses = "text-slate-600 bg-slate-100 border-slate-200";
  let dotClasses = "bg-slate-400 shadow-slate-400/50";
  
  if (item.categoria === "Legislación") {
    badgeClasses = "text-google-yellow bg-google-yellow/10 border-google-yellow/20";
    dotClasses = "bg-google-yellow shadow-google-yellow/50";
  } else if (item.categoria === "Mercado") {
    badgeClasses = "text-google-blue bg-google-blue/10 border-google-blue/20";
    dotClasses = "bg-google-blue shadow-google-blue/50";
  } else if (item.categoria === "ETTs") {
    badgeClasses = "text-google-green bg-google-green/10 border-google-green/20";
    dotClasses = "bg-google-green shadow-google-green/50";
  }

  // Bento sizing logic
  let gridClass = "col-span-1 row-span-1";
  let isLarge = false;
  let isWide = false;
  
  if (modulo === 0) {
    gridClass = "col-span-1 md:col-span-2 row-span-2";
    isLarge = true;
  } else if (modulo === 3) {
    gridClass = "col-span-1 md:col-span-2 row-span-1";
    isWide = true;
  }

  // AI Content processing
  const tmp = document.createElement("DIV");
  tmp.innerHTML = item.resumen;
  const cleanSummary = tmp.textContent || tmp.innerText || "";
  
  const hasImpact = item.impacto && item.impacto !== "N/A" && item.impacto !== "Error al procesar con IA.";
  const iaImpact = hasImpact ? item.impacto : cleanSummary.substring(0, 150) + "...";
  const iaRisk = item.riesgos && item.riesgos !== "N/A" ? item.riesgos : "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 10) * 0.05 }}
      whileHover={{ y: -4 }}
      onClick={() => window.open(item.url, '_blank')}
      className={cn(
        "group relative bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-slate-200 flex flex-col overflow-hidden shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300",
        gridClass
      )}
    >
      {/* Background Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Meta Header */}
        <div className="flex items-center justify-between mb-4">
          <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border", badgeClasses)}>
            <span className={cn("w-1.5 h-1.5 rounded-full mr-2 shadow-[0_0_8px_currentColor]", dotClasses)} />
            {item.categoria}
          </span>
          <span className="text-[10px] font-mono text-slate-400 tracking-wider">{dateStr}</span>
        </div>

        {/* Title */}
        <h2 className={cn(
          "font-bold text-slate-900 leading-tight group-hover:text-google-blue transition-colors duration-300 mb-2",
          isLarge ? "text-2xl md:text-3xl mb-4" : isWide ? "text-xl md:text-2xl" : "text-lg line-clamp-3"
        )}>
          {item.titulo}
        </h2>

        {/* Dynamic Content based on Bento Size */}
        {isLarge && (
          <div className="mt-4 flex-1 flex flex-col gap-3">
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Impacto IA
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">{iaImpact}</p>
            </div>
            
            {hasImpact && iaRisk && (
              <div className="bg-yellow-50/50 rounded-xl p-4 border border-yellow-100/50">
                <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Riesgo IA
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">{iaRisk}</p>
              </div>
            )}
          </div>
        )}

        {isWide && (
          <div className="mt-2 flex-1">
            <p className="text-sm text-slate-600 line-clamp-2">{iaImpact}</p>
          </div>
        )}

        {/* Footer (Source) */}
        {!isLarge && !isWide && (
          <div className="mt-auto pt-4 flex justify-between items-center">
             <span className="text-xs text-slate-400 font-mono uppercase truncate">{item.fuente}</span>
          </div>
        )}
        
        {(isLarge || isWide) && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-mono uppercase">{item.fuente}</span>
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:border-google-blue group-hover:bg-google-blue group-hover:text-white transition-all duration-300">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}
