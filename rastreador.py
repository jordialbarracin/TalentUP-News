import feedparser
import requests
import json
import os
import urllib.parse
from datetime import datetime
import time
import spacy
import trafilatura
import google.generativeai as genai

try:
    nlp = spacy.load("es_core_news_sm")
except:
    nlp = None

# Configurar API de Gemini
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
    except:
        model = None
else:
    model = None

q1 = urllib.parse.quote('intitle:"legislacion laboral" OR "reforma laboral" OR "estatuto de los trabajadores" OR "ministerio de trabajo" when:7d')
q2 = urllib.parse.quote('"recursos humanos" OR "seleccion de personal" OR "captacion de talento" when:7d')
q3 = urllib.parse.quote('"empresas de trabajo temporal" OR "ETT" OR Adecco OR Randstad OR Manpower OR Eurofirms when:7d')

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
        "categoria": "Contratacion"
    },
    {
        "nombre": "Nuevas Aperturas",
        "url": f"https://news.google.com/rss/search?q={q_aperturas}&hl=es-ES&gl=ES&ceid=ES:es",
        "categoria": "Aperturas"
    },
    {
        "nombre": "Alertas de Reestructuración",
        "url": f"https://news.google.com/rss/search?q={q_reestructuracion}&hl=es-ES&gl=ES&ceid=ES:es",
        "categoria": "Reestructuracion"
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

def analizar_con_ia(texto_articulo):
    """Usa la IA de Gemini para analizar el texto completo y devolver insights clave."""
    if not model or len(texto_articulo) < 100:
        return {
            "impacto": "Análisis IA no disponible o texto insuficiente.",
            "riesgos": "N/A",
            "resumen_ia": "Configura la API Key de Gemini en Github Actions para desbloquear la IA."
        }
    
    prompt = f"""
    Eres un Analista Experto en Recursos Humanos. Lee el siguiente artículo y devuelve ÚNICAMENTE un objeto JSON válido con estas 3 claves:
    {{
      "impacto": "1 frase concisa sobre cómo afecta esto al mercado laboral o a los profesionales de RRHH.",
      "riesgos": "1 frase concisa destacando posibles riesgos, advertencias u oportunidades estratégicas.",
      "resumen_ia": "Resumen ejecutivo de máximo 2 líneas destacando la esencia del hecho."
    }}
    
    TEXTO DEL ARTÍCULO:
    {texto_articulo[:8000]}
    """
    
    try:
        response = model.generate_content(prompt)
        res_text = response.text.strip()
        if res_text.startswith("```json"):
            res_text = res_text[7:]
        if res_text.startswith("```"):
            res_text = res_text[3:]
        if res_text.endswith("```"):
            res_text = res_text[:-3]
        
        datos_ia = json.loads(res_text.strip())
        return {
            "impacto": datos_ia.get("impacto", "No extraído"),
            "riesgos": datos_ia.get("riesgos", "No extraído"),
            "resumen_ia": datos_ia.get("resumen_ia", "No extraído")
        }
    except Exception as e:
        print(f"Error en IA: {e}")
        return {
            "impacto": "Error al procesar con IA.",
            "riesgos": "Error.",
            "resumen_ia": "No se pudo generar el análisis."
        }

def fetch_and_parse_rss(fuente_info, is_news=False):
    noticias = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
    try:
        response = requests.get(fuente_info['url'], headers=headers, timeout=15)
        feed = feedparser.parse(response.content)
        
        limite = 30 if is_news else 15
        
        for entry in feed.entries[:limite]: 
            title = getattr(entry, 'title', 'Sin título')
            link = getattr(entry, 'link', '#')
            description = getattr(entry, 'description', getattr(entry, 'summary', ''))
            
            pub_date = ''
            if hasattr(entry, 'published_parsed') and entry.published_parsed:
                pub_date = time.strftime('%Y-%m-%dT%H:%M:%SZ', entry.published_parsed)
            elif hasattr(entry, 'published'):
                pub_date = entry.published
            else:
                pub_date = datetime.now().isoformat()
            
            entidades = extract_entities(title)
            
            impacto = "N/A"
            riesgos = "N/A"
            resumen_ia = description
            
            if is_news:
                try:
                    # Resolvemos la redirección de Google News primero
                    res_redirect = requests.get(link, headers=headers, timeout=10, allow_redirects=True)
                    final_url = res_redirect.url
                    downloaded = trafilatura.fetch_url(final_url)
                    if downloaded:
                        texto_completo = trafilatura.extract(downloaded)
                        if texto_completo:
                            insights = analizar_con_ia(texto_completo)
                            impacto = insights["impacto"]
                            riesgos = insights["riesgos"]
                            resumen_ia = insights["resumen_ia"]
                            
                            if model:
                                time.sleep(4.1) 
                except Exception as e:
                    print(f"Error scraping {link}: {e}")
                
            noticias.append({
                "titulo": title,
                "url": link,
                "resumen": resumen_ia if is_news else description,
                "impacto": impacto,
                "riesgos": riesgos,
                "fecha": pub_date,
                "fuente": fuente_info["nombre"],
                "categoria": fuente_info["categoria"],
                "empresa": entidades['empresa'],
                "ubicacion": entidades['ubicacion']
            })
            print(f"  + Procesado: {title[:40]}...")
    except Exception as e:
        print(f"Error procesando XML para {fuente_info['nombre']}: {e}")
        
    return noticias

def generate_obsidian_note(noticias, leads):
    try:
        ahora = datetime.now()
        fecha_str = ahora.strftime('%Y-%m-%d_%H-%M')
        fecha_legible = ahora.strftime('%d/%m/%Y a las %H:%M')
        
        hemeroteca_dir = os.path.join(os.path.dirname(__file__), 'Historia_TalentUP', 'Hemeroteca')
        os.makedirs(hemeroteca_dir, exist_ok=True)
        
        filepath_noticias = os.path.join(hemeroteca_dir, f"Noticias_{fecha_str}.md")
        categorias_not = {}
        for n in noticias:
            categorias_not.setdefault(n['categoria'], []).append(n)
            
        with open(filepath_noticias, 'w', encoding='utf-8') as f:
            f.write(f"# 📰 Reporte de Actualidad RRHH: {fecha_legible}\n\n")
            for cat, lista in categorias_not.items():
                f.write(f"## 📌 {cat}\n")
                for item in lista:
                    f.write(f"- [{item['titulo']}]({item['url']})\n")
                    f.write(f"  - **Impacto**: {item['impacto']}\n")
                    f.write(f"  - **Riesgos**: {item['riesgos']}\n")
                f.write("\n")
                
        filepath_leads = os.path.join(hemeroteca_dir, f"Leads_{fecha_str}.md")
        categorias_leads = {}
        for l in leads:
            categorias_leads.setdefault(l['categoria'], []).append(l)
            
        with open(filepath_leads, 'w', encoding='utf-8') as f:
            f.write(f"# 🎯 Radar de Leads B2B: {fecha_legible}\n\n")
            for cat, lista in categorias_leads.items():
                f.write(f"## 📌 {cat}\n")
                for item in lista:
                    f.write(f"- [{item['titulo']}]({item['url']})\n")
                f.write("\n")
                
        print(f"- Notas de Obsidian generadas: Noticias_{fecha_str}.md y Leads_{fecha_str}.md")
    except Exception as e:
        print(f"Error generando notas de Obsidian: {e}")

def main():
    todas_las_noticias = []
    
    print("Iniciando motor IA avanzado de TalentUP News...")
    print("-" * 50)
    
    for fuente in FUENTES:
        print(f"Rastreando y analizando fuente: {fuente['nombre']}...")
        noticias = fetch_and_parse_rss(fuente, is_news=True)
        if noticias:
            todas_las_noticias.extend(noticias)
            print(f"- Exito! Procesadas {len(noticias)} noticias con IA.")
        else:
            print("- Fallo la descarga o el feed estaba vacio.")
            
    print("-" * 50)
    
    DB_PATH = os.path.join(os.path.dirname(__file__), 'datos', 'noticias.js')
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    with open(DB_PATH, 'w', encoding='utf-8') as f:
        f.write("const window_news_data = " + json.dumps(todas_las_noticias, ensure_ascii=False, indent=2) + ";")
    
    # === SECCION DE LEADS B2B ===
    todos_los_leads = []
    print("Iniciando radar de Leads B2B...")
    for fuente in FUENTES_LEADS:
        print(f"Rastreando leads: {fuente['nombre']}...")
        leads = fetch_and_parse_rss(fuente, is_news=False)
        if leads:
            todos_los_leads.extend(leads)
            print(f"- Exito! Extraidos {len(leads)} leads.")
        else:
            print("- Fallo la descarga o el feed estaba vacio.")
            
    DB_LEADS_PATH = os.path.join(os.path.dirname(__file__), 'datos', 'leads.js')
    with open(DB_LEADS_PATH, 'w', encoding='utf-8') as f:
        f.write("const window_leads_data = " + json.dumps(todos_los_leads, ensure_ascii=False, indent=2) + ";")
    
    generate_obsidian_note(todas_las_noticias, todos_los_leads)
    
    print(f"Proceso completado! Se han guardado {len(todas_las_noticias)} noticias analizadas y {len(todos_los_leads)} leads.")

if __name__ == '__main__':
    main()
