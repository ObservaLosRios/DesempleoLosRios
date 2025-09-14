#!/usr/bin/env python3
"""
Ejecuta el notebook 01_eda_desempleo.ipynb, extrae las figuras Plotly junto a sus títulos
(derivados de los encabezados markdown cercanos) y genera docs/plots.json
compatible con docs/index.html + docs/interactive.js.

Requisitos: nbconvert, nbclient, nbformat, plotly
"""
from __future__ import annotations
import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional

import nbformat
from nbclient import NotebookClient
from nbconvert.preprocessors import ExecutePreprocessor

# Rutas
ROOT = Path(__file__).resolve().parents[1]
NB_PATH = ROOT / 'notebooks' / '01_eda_desempleo.ipynb'
DOCS_DIR = ROOT / 'docs'
PLOTS_JSON = DOCS_DIR / 'plots.json'


def is_markdown_heading(cell: nbformat.NotebookNode) -> Optional[str]:
    if cell.get('cell_type') != 'markdown':
        return None
    src = ''.join(cell.get('source') or '')
    for line in src.splitlines():
        line = line.strip()
        if line.startswith('#'):
            # devolver el texto sin #
            return line.lstrip('#').strip()
    return None


def extract_plotly_from_output(output: nbformat.NotebookNode) -> Optional[Dict[str, Any]]:
    """Devuelve un dict {'data': [...], 'layout': {...}} si el output contiene una figura Plotly."""
    # plotly en notebooks suele aparecer como application/vnd.plotly.v1+json
    data = output.get('data') if isinstance(output, dict) else None
    if not isinstance(data, dict):
        return None
    plotly_mime = 'application/vnd.plotly.v1+json'
    if plotly_mime in data:
        fig_json = data[plotly_mime]
        # fig_json suele ser dict con keys: 'data', 'layout', 'config'
        if isinstance(fig_json, dict) and 'data' in fig_json and 'layout' in fig_json:
            return {'data': fig_json.get('data'), 'layout': fig_json.get('layout')}
    return None


def get_layout_title(layout: Any) -> Optional[str]:
    try:
        if isinstance(layout, dict):
            title = layout.get('title')
            if isinstance(title, dict):
                txt = title.get('text')
                if isinstance(txt, str) and txt.strip():
                    return txt.strip()
            elif isinstance(title, str) and title.strip():
                return title.strip()
    except Exception:
        pass
    return None


def run_notebook(nb_path: Path) -> nbformat.NotebookNode:
    with nb_path.open('r', encoding='utf-8') as f:
        nb = nbformat.read(f, as_version=4)
    # Ejecutar in-place usando nbclient
    ep = ExecutePreprocessor(timeout=600, kernel_name='python3', allow_errors=True)
    ep.preprocess(nb, {'metadata': {'path': str(nb_path.parent)}})
    return nb


def build_sections(nb: nbformat.NotebookNode) -> List[Dict[str, Any]]:
    sections: List[Dict[str, Any]] = []
    current_title: Optional[str] = None

    for cell in nb.cells:
        if cell.cell_type == 'markdown':
            title = is_markdown_heading(cell)
            if title:
                current_title = title
            # Continuar: los títulos se asignan a las próximas figuras
            continue

        if cell.cell_type == 'code':
            # revisar outputs en busca de plotly
            if not getattr(cell, 'outputs', None):
                continue
            for out in cell.outputs:
                pl = extract_plotly_from_output(out)
                if pl:
                    # Preferir título del layout si existe
                    fig_title = get_layout_title(pl.get('layout'))
                    title = fig_title or current_title or 'Gráfico'
                    sections.append({'title': title, 'plotly': pl})
    return sections


def main() -> None:
    if not NB_PATH.exists():
        raise SystemExit(f'No existe el notebook en {NB_PATH}')
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    print('⏳ Ejecutando notebook para extraer figuras...')
    nb = run_notebook(NB_PATH)

    print('🔎 Recolectando figuras Plotly...')
    sections = build_sections(nb)
    if not sections:
        print('⚠️ No se encontraron figuras Plotly. Se generará un archivo vacío.')

    payload = {'sections': sections}
    with PLOTS_JSON.open('w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(f'✅ Archivo generado: {PLOTS_JSON.relative_to(ROOT)} ({len(sections)} visualizaciones)')


if __name__ == '__main__':
    main()
