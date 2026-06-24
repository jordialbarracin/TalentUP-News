import feedparser
import requests
import json
import os
import urllib.parse
from datetime import datetime
import time
import spacy

try:
    nlp = spacy.load("es_core_news_sm")
except:
    nlp = None

q1 = urllib.parse.quote('intitle:"legislacion laboral" OR "reforma laboral" OR "estatuto de los trabajadores" OR "ministerio de trabajo" when:7d')
q2 = urllib.parse.quote('"recursos humanos" OR "seleccion de personal" OR "captacion de talento" when:7d')
q3 = urllib.parse.quote('"empresas de trabajo temporal" OR "ETT" OR Adecco OR Randstad OR Manpower OR Eurofirms when:7d')

# Consultas OSINT B2B (Señales HR Core)
q_contratacion = urllib.parse.quote('(contratará OR contrataciones OR "ofertas de empleo" OR "busca personal" OR "creará puestos" OR "amplía plantilla") when:14d')
q_aperturas = urllib.parse.quote('("nuevo centro" OR "nueva fábrica" OR inaugura OR "nueva tienda" OR apertura) AND (plantilla OR trabajadores OR empleo) when:14d')
q_reestructuracion = urllib.parse.quote('(ERE OR ERTE OR "despido colectivo" OR "recorte de plantilla") when:14d')

FUENTES = [
    {
        "nombre": "Novedades Legales (España)",
        "url": f"https://news.google.com/rss/search?q={q1}&hl=es-ES&gl=ES&ceid=ES:es",
        "categoria": "Legislación"
    },
    {
        "nombre": "Panorama Nacional RRHH",
        "url": f"https://news.google.com/rss/search?q={q2}&hl=es-ES&gl=ES&ceid=ES:es",
        "categoria": "Mercado"
    },
    {
        "nombre": "Actualidad ETTs",
        "url": f"https://news.google.com/rss/search?q={q3}&hl=es-ES&gl=ES&ceid=ES:es",
        "categoria": "ETTs"
    }
]

FUENTES_LEADS = [
    {
        "nombre": "Contratación Directa",
        "url": f"https://news.google.com/rss/search?q={q_contratacion}&hl=es-ES&gl=ES&ceid=ES:es",
        "categoria": "Contratación"
    },
    {
        "nombre": "Nuevas Aperturas",
        "url": f"https://news.google.com/rss/search?q={q_aperturas}&hl=es-ES&gl=ES&ceid=ES:es",
        "categoria": "Aperturas"
    },
    {
        "nombre": "Alertas de Reestructuración",
        "url": f"https://news.google.com/rss/search?q={q_reestructuracion}&hl=es-ES&gl=ES&ceid=ES:es",
        "categoria": "Reestructuración"
    }
]

DB_PATH = os.path.join(os.path.dirname(__file__), 'datos', 'noticias.json')

def extract_entities(text):
    if not nlp:
        return {"empresa": "Desconocida", "ubicacion": "Nacional"}
    
    doc = nlp(text)
    empresas = [ent.text for ent in doc.ents if ent.label_ == "ORG"]
    ubicaciones = [ent.text for ent in doc.ents if ent.label_ == "LOC"]
    
    empresa = empresas[0] if empresas else "Desconocida"
    ubicacion = ubicaciones[0] if ubicaciones else "Nacional"
    
    return {"empresa": empresa, "ubicacion": ubicacion}

def fetch_and_parse_rss(fuente_info):
    noticias = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
    try:
        response = requests.get(fuente_info['url'], headers=headers, timeout=15)
        # Algunos feeds vienen comprimidos o con codificaciones raras, requests lo maneja mejor
        feed = feedparser.parse(response.content)
        
        for entry in feed.entries[:15]: # Limitar a 15 noticias por fuente para no saturar
            title = getattr(entry, 'title', 'Sin título')
            link = getattr(entry, 'link', '#')
            description = getattr(entry, 'description', getattr(entry, 'summary', ''))
            
            # Intentar formatear la fecha
            pub_date = ''
            if hasattr(entry, 'published_parsed') and entry.published_parsed:
                pub_date = time.strftime('%Y-%m-%dT%H:%M:%SZ', entry.published_parsed)
            elif hasattr(entry, 'published'):
                pub_date = entry.published
            else:
                pub_date = datetime.now().isoformat()
            
            # NLP: Extraer Entidades del titular
            entidades = extract_entities(title)
                
            noticias.append({
                "titulo": title,
                "url": link,
                "resumen": description,
                "fecha": pub_date,
                "fuente": fuente_info["nombre"],
                "categoria": fuente_info["categoria"],
                "empresa": entidades['empresa'],
                "ubicacion": entidades['ubicacion']
            })
    except Exception as e:
        print(f"Error procesando XML para {fuente_info['nombre']}: {e}")
        
    return noticias

def generate_obsidian_note(noticias):
    try:
        ahora = datetime.now()
        fecha_str = ahora.strftime('%Y-%m-%d_%H-%M')
        fecha_legible = ahora.strftime('%d/%m/%Y a las %H:%M')
        
        # Ruta a la hemeroteca
        hemeroteca_dir = os.path.join(os.path.dirname(__file__), 'Historia_TalentUP', 'Hemeroteca')
        os.makedirs(hemeroteca_dir, exist_ok=True)
        
        filepath = os.path.join(hemeroteca_dir, f"{fecha_str}.md")
        
        # Agrupar noticias por categoría
        categorias = {}
        for n in noticias:
            cat = n['categoria']
            if cat not in categorias:
                categorias[cat] = []
            categorias[cat].append(n)
            
        # Redactar Markdown
        lines = [
            f"# 📰 Reporte de Actualidad RRHH: {fecha_legible}",
            "",
            f"**Total de noticias analizadas:** {len(noticias)}",
            "**Agente Autónomo:** TalentUP Rastreador v1.0",
            "---",
            ""
        ]
        
        for cat, lista in categorias.items():
            lines.append(f"## 📌 {cat}")
            for item in lista:
                lines.append(f"- [{item['titulo']}]({item['url']})")
            lines.append("")
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write("\n".join(lines))
            
        print(f"- Nota de Obsidian generada en Hemeroteca: {fecha_str}.md")
    except Exception as e:
        print(f"Error generando nota de Obsidian: {e}")

def main():
    todas_las_noticias = []
    
    print("Iniciando el motor rastreador de Antigravity...")
    print("-" * 50)
    
    for fuente in FUENTES:
        print(f"Rastreando fuente: {fuente['nombre']}...")
        noticias = fetch_and_parse_rss(fuente)
        if noticias:
            todas_las_noticias.extend(noticias)
            print(f"- Exito! Extraidas {len(noticias)} noticias.")
        else:
            print("- Fallo la descarga o el feed estaba vacio.")
            
    print("-" * 50)
    
    DB_PATH = os.path.join(os.path.dirname(__file__), 'datos', 'noticias.js')
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    with open(DB_PATH, 'w', encoding='utf-8') as f:
        # Guardamos como una variable JS para saltarnos los bloqueos de seguridad del navegador al abrir archivos locales
        f.write("const window_news_data = " + json.dumps(todas_las_noticias, ensure_ascii=False, indent=2) + ";")
    
    # === SECCION DE LEADS B2B ===
    todos_los_leads = []
    print("Iniciando radar de Leads B2B...")
    for fuente in FUENTES_LEADS:
        print(f"Rastreando leads: {fuente['nombre']}...")
        leads = fetch_and_parse_rss(fuente)
        if leads:
            todos_los_leads.extend(leads)
            print(f"- Exito! Extraidos {len(leads)} leads.")
        else:
            print("- Fallo la descarga o el feed estaba vacio.")
            
    DB_LEADS_PATH = os.path.join(os.path.dirname(__file__), 'datos', 'leads.js')
    with open(DB_LEADS_PATH, 'w', encoding='utf-8') as f:
        f.write("const window_leads_data = " + json.dumps(todos_los_leads, ensure_ascii=False, indent=2) + ";")
    
    # Generar la hemeroteca en Obsidian combinando ambos dataframes
    todas_las_entradas = todas_las_noticias + todos_los_leads
    generate_obsidian_note(todas_las_entradas)
    
    print(f"Proceso completado! Se han guardado {len(todas_las_noticias)} noticias y {len(todos_los_leads)} leads en la base de datos local.")

if __name__ == '__main__':
    main()
