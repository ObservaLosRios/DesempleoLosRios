// Construye la navegación y secciones leyendo un archivo generado desde el notebook (plots.json)
(function () {
	const NAV_ID = 'nav-links';
	const SECTIONS_WRAPPER_ID = 'dynamic-sections';
	const ACTIVE_CLASS = 'active';
	const DATA_FILE = 'plots.json';

	const qs = (sel) => document.querySelector(sel);
	const qsa = (sel) => Array.from(document.querySelectorAll(sel));

		function setActive(sectionId) {
		// Toggle nav
		qsa(`#${NAV_ID} .nav-link`).forEach((el) => {
			el.classList.toggle(ACTIVE_CLASS, el.dataset.section === sectionId);
		});
		// Toggle sections
		qsa('.section').forEach((sec) => {
			sec.classList.toggle(ACTIVE_CLASS, sec.id === sectionId);
		});
			// Force Plotly to resize the now-visible charts
			const activeSection = qs(`.section.${ACTIVE_CLASS} .chart-container`);
			if (activeSection && window.Plotly) {
				try { Plotly.Plots.resize(activeSection); } catch {}
				// Double-tick to ensure layout after CSS transitions
				requestAnimationFrame(() => {
					try { Plotly.Plots.resize(activeSection); } catch {}
				});
			}
	}

	function createNavItem(id, label) {
		const span = document.createElement('span');
		span.className = 'nav-link';
		span.dataset.section = id;
		span.textContent = label;
		span.addEventListener('click', () => setActive(id));
		return span;
	}

	function createPlotContainer(sectionId, title) {
		const section = document.createElement('section');
		section.className = 'section';
		section.id = sectionId;

		const h2 = document.createElement('h2');
		h2.className = 'section-title';
		h2.textContent = title;

		const chartSection = document.createElement('div');
		chartSection.className = 'chart-section';

		const chartDiv = document.createElement('div');
		chartDiv.className = 'chart-container';
		chartDiv.style.width = '100%';
		chartDiv.style.minHeight = '420px';

		chartSection.appendChild(chartDiv);
		section.appendChild(h2);
		section.appendChild(chartSection);
		return { section, chartDiv };
	}

	async function loadData() {
		try {
			const res = await fetch(DATA_FILE, { cache: 'no-store' });
			if (!res.ok) throw new Error(`No se pudo cargar ${DATA_FILE}`);
			return await res.json();
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	function toId(text) {
			return (text || 'grafico')
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '') // sin acentos
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '');
	}

	async function build() {
		const data = await loadData();
		const nav = qs(`#${NAV_ID}`);
		const container = qs(`#${SECTIONS_WRAPPER_ID}`);
		if (!nav || !container) return;

		if (!data || !Array.isArray(data.sections) || data.sections.length === 0) {
			console.warn('No se encontraron visualizaciones en plots.json');
			return;
		}

				const used = new Set();
				data.sections.forEach((sec, idx) => {
				let base = toId(sec.title || `grafico-${idx + 1}`);
				let id = base;
				let k = 2;
					while (used.has(id)) {
					id = `${base}-${k++}`;
				}
				used.add(id);
			const label = sec.title || `Gráfico ${idx + 1}`;

			// nav
			nav.appendChild(createNavItem(id, label));

			// section + chart div
			const { section, chartDiv } = createPlotContainer(id, label);
			container.appendChild(section);

			// render plotly si existe
							if (sec.plotly && sec.plotly.data && sec.plotly.layout) {
								const baseLayout = sec.plotly.layout || {};
								const layout = {
									...baseLayout,
									// Hover unificado + spikelines verticales (tipo The Economist)
									hovermode: baseLayout.hovermode ?? 'x unified',
									hoverlabel: {
										align: 'left',
										bgcolor: 'white',
										bordercolor: '#E5E5E5',
										font: { family: 'Georgia, serif' }
									},
									spikedistance: -1, // mostrar spike sin límite de distancia
									xaxis: {
										...(baseLayout.xaxis || {}),
										showspikes: true,
										spikemode: 'across',
										spikesnap: 'cursor',
										spikethickness: 1,
										spikecolor: '#9E9E9E'
									},
									yaxis: {
										...(baseLayout.yaxis || {}),
										showspikes: false
									},
									paper_bgcolor: 'white',
									plot_bgcolor: 'white'
								};
						Plotly.newPlot(chartDiv, sec.plotly.data, layout, {
					responsive: true,
					displaylogo: false,
					modeBarButtonsToRemove: [
						'lasso2d','select2d','toggleSpikelines','autoScale2d','zoomIn2d','zoomOut2d'
					]
						}).then(() => {
							// Listen to window resizes
							window.addEventListener('resize', () => {
								try { Plotly.Plots.resize(chartDiv); } catch {}
							});
							// Initial resize to capture real container width
							try { Plotly.Plots.resize(chartDiv); } catch {}
							// Another tick after layout settles
							requestAnimationFrame(() => {
								try { Plotly.Plots.resize(chartDiv); } catch {}
							});
						});
			} else if (sec.html) {
				// fallback si viene html embebido
				chartDiv.innerHTML = sec.html;
			} else {
				chartDiv.innerHTML = '<div class="chart-placeholder">No hay datos para este gráfico.</div>';
			}
		});

		// activar el primer gráfico por defecto
		const first = used.values().next().value;
		if (first) setActive(first);
	}

	// Modal: funciones mínimas para el HTML existente
	function openModal() {
		const modal = qs('#configModal');
		const close = modal?.querySelector('.close');
		if (!modal) return;
		modal.style.display = 'block';
		const onClose = () => (modal.style.display = 'none');
		close?.addEventListener('click', onClose, { once: true });
		window.addEventListener('click', function handler(e) {
			if (e.target === modal) {
				onClose();
				window.removeEventListener('click', handler);
			}
		});
	}

	function applyConfiguration() {
		const title = qs('#title-input')?.value?.trim();
		const subtitle = qs('#subtitle-input')?.value?.trim();
		const footer = qs('#footer-input')?.value?.trim();
		if (title) qs('#main-title').textContent = title;
		if (subtitle) qs('#subtitle').textContent = subtitle;
		if (footer) qs('#footer-text').innerHTML = footer.replace(/\n/g, '<br>');
		const modal = qs('#configModal');
		if (modal) modal.style.display = 'none';
	}

	function loadExampleData() {
		// Solo cambia textos como demo
		qs('#title-input').value = 'Análisis de Desempleo: Región de Los Ríos';
		qs('#subtitle-input').value = 'ENE 2010–2025 | Visualizaciones interactivas';
		qs('#footer-input').value = 'Desarrollado por el Centro de Estudios Regionales\nUniversidad Austral de Chile';
	}

	// Exponer funciones que el HTML espera
	window.openModal = openModal;
	window.applyConfiguration = applyConfiguration;
	window.loadExampleData = loadExampleData;

	// inicializar
		if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', () => {
					build();
				// One more resize after first paint
				setTimeout(() => {
						const active = qs(`.section.${ACTIVE_CLASS} .chart-container`);
					if (active && window.Plotly) {
						try { Plotly.Plots.resize(active); } catch {}
					}
				}, 0);
			});
		} else {
			build();
			setTimeout(() => {
				const active = qs(`.section.${ACTIVE_CLASS} .chart-container`);
				if (active && window.Plotly) {
					try { Plotly.Plots.resize(active); } catch {}
				}
			}, 0);
		}

})();
