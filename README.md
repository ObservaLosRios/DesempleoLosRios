# 📊 SU2: Análisis de Desempleo y Subempleo en la Región de Los Ríos

Este proyecto realiza un análisis exploratorio y visualización de la tasa combinada de desocupación y subempleo (SU2) en la Región de Los Ríos, Chile. Utiliza datos oficiales del INE.Stat y busca identificar tendencias, segmentaciones y patrones relevantes por grupo etario y sexo, contribuyendo a la comprensión del fenómeno laboral regional.

---

## 🚀 Características principales

- Extracción, limpieza y validación de datos laborales
- Análisis exploratorio por grupo etario, sexo y total
- Visualizaciones interactivas y accesibles (Plotly, Seaborn, Matplotlib)
- Organización modular mediante notebooks y scripts
- Buenas prácticas de *Clean Code* y reproducibilidad

---

## 📁 Estructura del proyecto

```
su2-desempleo-losrios/
│
├── data/
│   ├── raw/                # Datos originales descargados del INE
│   └── processed/          # Datos limpios y combinados para análisis
│
├── notebooks/
│   ├── 01_eda_desempleo.ipynb          # Análisis por tramo etario
│   ├── 02_eda_desempleo_por_sexo.ipynb # Análisis por sexo
│   └── 03_eda_desempleo_total.ipynb    # Evolución general del desempleo
│
├── scripts/
│   ├── load_clean_edad.py      # Limpieza y carga de datos por edad
│   ├── load_clean_sexo.py      # Limpieza y carga de datos por sexo
│   ├── merge_edad_sexo.py      # Unificación de datasets limpios
│   ├── validate_data.py        # Validaciones básicas de integridad
│   └── __init__.py
│
├── utils/
│   ├── plot_helpers.py         # Funciones auxiliares para visualización
│   └── __init__.py
│
├── tests/
│   ├── test_cleaning.py        # Tests unitarios para funciones de limpieza
│   └── __pycache__/
│
├── config.py                   # Configuración general
├── requirements.txt            # Dependencias del entorno
└── README.md
```

---

## 🧪 Requisitos

Desarrollado en Python 3.10+.

**Dependencias principales:**
- pandas
- matplotlib
- seaborn
- plotly
- jupyterlab

Instala las dependencias con:

```bash
pip install -r requirements.txt
```

---

## 🛠️ Uso rápido

1. Clona el repositorio:
   ```bash
   git clone https://github.com/SanMaBruno/su2-desempleo-losrios.git
   cd su2-desempleo-losrios
   ```
2. Activa tu entorno virtual y instala dependencias
3. Ejecuta los notebooks en el orden recomendado
4. Revisa las visualizaciones generadas

---

## 📈 Ejemplo de visualizaciones

Visualizaciones generadas por los notebooks:

- ![Desempleo por edad](notebooks/img/desempleo_edad.png)
- ![Desempleo por sexo](notebooks/img/desempleo_sexo.png)

---

## 👨‍💻 Autor

**Bruno San Martín Navarro**  
Ingeniero en Informática & Científico de Datos  
Especialista en ciencia de datos y desarrollo de soluciones escalables
Data Analyst CEA uACH, Valdivia

[GitHub](https://github.com/SanMaBruno) · [LinkedIn](https://www.linkedin.com/in/sanmabruno/)

---

## 📄 Licencia

Este proyecto se distribuye bajo licencia MIT. Consulta el archivo `LICENSE` para más detalles.