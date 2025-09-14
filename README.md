# 📊 Desempleo en la Región de Los Ríos (ENE 2010–2025)

Análisis exploratorio y visualizaciones interactivas del desempleo en la Región de Los Ríos, Chile, utilizando la Encuesta Nacional de Empleo (INE). El repositorio incluye notebooks reproducibles, un pipeline de limpieza y un sitio HTML con gráficos interactivos estilo The Economist (paleta amarillo–azul–gris, accesible para daltónicos).

---

## 🚀 Qué incluye

- Limpieza, validación y unificación de datos (scripts en `scripts/`).
- Notebooks de EDA por tramo etario, sexo y total (`notebooks/`).
- Sitio web estático en `docs/` que muestra todas las visualizaciones con un navbar automático.
- Estilo visual consistente y accesible (Plotly) sin cambiar tipografías.

---

## 📁 Estructura

```
DesempleoLosRios/
├─ data/
│  ├─ raw/                # Datos originales (INE)
│  └─ processed/          # CSV limpios y combinados
├─ notebooks/
│  ├─ 01_eda_desempleo.ipynb          # EDA general y por edad
│  ├─ 02_eda_desempleo_por_sexo.ipynb # EDA por sexo
│  └─ 03_eda_desempleo_total.ipynb    # Otras vistas
├─ scripts/
│  ├─ load_clean_edad.py
│  ├─ load_clean_sexo.py
│  ├─ merge_edad_sexo.py
│  ├─ validate_data.py
│  └─ build_site.py        # Ejecuta notebook y genera docs/plots.json
├─ docs/                   # Sitio estático (HTML/CSS/JS)
│  ├─ index.html           # Plantilla con navbar + secciones dinámicas
│  ├─ interactive.js       # Render Plotly y navegación
│  └─ plots.json           # Salida generada desde los notebooks
├─ tests/
│  └─ test_cleaning.py
├─ requirements.txt
└─ README.md
```

---

## 🧪 Requisitos

- Python 3.11 (recomendado)
- Paquetes en `requirements.txt` (incluye pandas, plotly, seaborn, nbconvert, scipy, etc.)

Instalación:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## 🛠️ Uso rápido

1) Generar el sitio interactivo (navbar + gráficos)

```bash
python scripts/build_site.py
```

Esto ejecuta `notebooks/01_eda_desempleo.ipynb`, extrae todas las figuras Plotly y escribe `docs/plots.json` que el HTML usa para mostrar los gráficos.

2) Abrir el sitio

- Abrir `docs/index.html` directamente en el navegador, o
- Servir localmente (opcional):

```bash
python -m http.server 5501
# luego abrir http://127.0.0.1:5501/docs/index.html
```

3) Ejecutar tests (opcional)

```bash
pytest -q
```

---

## 📈 Visualizaciones destacadas

- Evolución del desempleo total (con línea de tendencia y marca COVID-19).
- Comparación por grupos etarios (líneas + marcadores, paleta accesible).
- Comparación por sexo (Hombres, Mujeres y Total con líneas diferenciadas).

Todas las gráficas implementan “hover” unificado con spikelines verticales para facilitar la lectura comparada.

---

## � Datos

- Fuente: INE – Encuesta Nacional de Empleo (ENE).
- Cobertura: Región de Los Ríos, 2010–2025.
- Estructura principal: `periodo`, `valor`, `dimension` (sexo/tramo_edad), `categoria`.

---

## 🔧 Mantenimiento habitual

- Actualizar plots tras cambios en notebooks:

```bash
python scripts/build_site.py
```

- Ajustes de estilo del sitio: editar `docs/styles.css` y `docs/interactive.js`.

---

## 📄 Licencia

MIT. Ver `LICENSE` (si aplica).