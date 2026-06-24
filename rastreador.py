import feedparser
import requests
import json
import os
import urllib.parse
from datetime import datetime
import time

q1 = urllib.parse.quote('intitle:"legislacion laboral" OR "reforma laboral" OR "estatuto de los trabajadores" OR "ministerio de trabajo" when:7d')
q2 = urllib.parse.quote('"recursos humanos" OR "seleccion de personal" OR "captacion de talento" when:7d')
q3 = urllib.parse.quote('"empresas de trabajo temporal" OR "ETT" OR Adecco OR Randstad OR Manpower OR Eurofirms when:7d')

FUENTES = [
    {
        "nombre": "Novedades Legales (España)",
        "url": f"https://news.google.com/rss/search?q={q1}&hl=es&gl=ES&ceid=ES:es",
        "categoria": "Legislación"
    },
    {
        "nombre": "Panorama Nacional RRHH",
        "url": f"https://news.google.com/rss/search?q={q2}&hl=es&gl=ES&ceid=ES:es",
        "categoria": "Mercado"
    },
    {
        "nombre": "Actualidad ETTs",
        "url": f"https://news.google.com/rss/search?q={q3}&hl=es&gl=ES&ceid=ES:es",
        "categoria": "ETTs"
    }
]

DB_PATH = os.path.join(os.path.dirname(__file__), 'datos', 'noticias.json')

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
                
            noticias.append({
                "titulo": title,
                "url": link,
                "resumen": description,
                "fecha": pub_date,
                "fuente": fuente_info["nombre"],
                "categoria": fuente_info["categoria"]
            })
    except Exception as e:
        print(f"Error procesando XML para {fuente_info['nombre']}: {e}")
        
    return noticias

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
    
    print(f"Proceso completado! Se han guardado {len(todas_las_noticias)} noticias en la base de datos local.")

if __name__ == '__main__':
    main()
