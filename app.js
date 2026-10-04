const KEY_DATA = 'orbitask_pro_data_v1';

const seedProjects = [
  {
    id: crypto.randomUUID(),
    name: 'Subproducto Aplicación Multiplataforma',
    description: 'Desarrollo de la aplicación y preparación del reporte académico completo.',
    owner: 'Jose David Morales Meza',
    deadline: futureDate(8),
    createdAt: Date.now() - 900000
  },
  {
    id: crypto.randomUUID(),
    name: 'Actividades personales',
    description: 'Organización de tareas cotidianas, pendientes y seguimiento personal.',
    owner: 'Usuario',
    deadline: futureDate(20),
    createdAt: Date.now() - 850000
  }
];

const seedTasks = [
  { id: crypto.randomUUID(), title: 'Diseñar interfaz principal', projectId: '', category: 'Escuela', priority: 'Alta', status: 'completed', date: futureDate(1), description: 'Crear la estructura visual principal de la app.', createdAt: Date.now() - 700000 },
  { id: crypto.randomUUID(), title: 'Implementar persistencia local', projectId: '', category: 'Escuela', priority: 'Alta', status: 'pending', date: futureDate(2), description: 'Guardar tareas, notas y proyectos mediante LocalStorage.', createdAt: Date.now() - 600000 },
  { id: crypto.randomUUID(), title: 'Preparar capturas para el reporte', projectId: '', category: 'Escuela', priority: 'Media', status: 'pending', date: futureDate(4), description: 'Tomar evidencias visuales de la aplicación en funcionamiento.', createdAt: Date.now() - 500000 },
  { id: crypto.randomUUID(), title: 'Revisar lista de pendientes personales', projectId: '', category: 'Personal', priority: 'Baja', status: 'completed', date: futureDate(0), description: 'Actualizar las tareas personales del día.', createdAt: Date.now() - 450000 },
  { id: crypto.randomUUID(), title: 'Documentar tecnologías utilizadas', projectId: '', category: 'Trabajo', priority: 'Media', status: 'pending', date: futureDate(6), description: 'Redactar la sección de tecnologías y características.', createdAt: Date.now() - 300000 },
];

const seedNotes = [
  { id: crypto.randomUUID(), title: 'Idea general', content: 'La app debe verse profesional, tener múltiples módulos y una paleta negro-rojo-blanco.', createdAt: Date.now() - 200000 },
  { id: crypto.randomUUID(), title: 'Pendiente académico', content: 'Después de terminar la app, documentar definición, características, tecnología, ilustraciones y ejemplo de funcionamiento.', createdAt: Date.now() - 100000 },
];

function buildDefaultData() {
  const data = structuredClone({
    projects: seedProjects,
    tasks: seedTasks,
    notes: seedNotes,
  });
  if (data.projects[0]) {
    data.tasks[0].projectId = data.projects[0].id;
    data.tasks[1].projectId = data.projects[0].id;
    data.tasks[2].projectId = data.projects[0].id;
    data.tasks[4].projectId = data.projects[0].id;
  }
  if (data.projects[1]) {
    data.tasks[3].projectId = data.projects[1].id;
  }
  return data;
}

let data = loadData();
let editingTaskId = null;
let editingProjectId = null;
let deferredInstallPrompt = null;

const refs = {
  views: document.querySelectorAll('.view'),
  navItems: document.querySelectorAll('.nav-item'),
  pageTitle: document.getElementById('pageTitle'),
  pageSubtitle: document.getElementById('pageSubtitle'),
  todayLabel: document.getElementById('todayLabel'),
  heroTaskSummary: document.getElementById('heroTaskSummary'),
  installBtn: document.getElementById('installBtn'),
  seedBtn: document.getElementById('seedBtn'),
  newTaskBtn: document.getElementById('newTaskBtn'),
  newProjectBtn: document.getElementById('newProjectBtn'),
  exportCsvBtn: document.getElementById('exportCsvBtn'),
  exportJsonBtn: document.getElementById('exportJsonBtn'),
  settingsExportBtn: document.getElementById('settingsExportBtn'),
  importJsonInput: document.getElementById('importJsonInput'),
  clearDataBtn: document.getElementById('clearDataBtn'),
  statTotalTasks: document.getElementById('statTotalTasks'),
  statPendingTasks: document.getElementById('statPendingTasks'),
  statCompletedTasks: document.getElementById('statCompletedTasks'),
  statProgress: document.getElementById('statProgress'),
  statProjects: document.getElementById('statProjects'),
  statHigh: document.getElementById('statHigh'),
  progressChip: document.getElementById('progressChip'),
  progressBar: document.getElementById('progressBar'),
  upcomingList: document.getElementById('upcomingList'),
  recentTasksList: document.getElementById('recentTasksList'),
  dashboardProjects: document.getElementById('dashboardProjects'),
  searchTaskInput: document.getElementById('searchTaskInput'),
  filterStatus: document.getElementById('filterStatus'),
  filterPriority: document.getElementById('filterPriority'),
  filterProject: document.getElementById('filterProject'),
  taskList: document.getElementById('taskList'),
  projectCount: document.getElementById('projectCount'),
  projectList: document.getElementById('projectList'),
  agendaList: document.getElementById('agendaList'),
  noteTitleInput: document.getElementById('noteTitleInput'),
  noteContentInput: document.getElementById('noteContentInput'),
  saveNoteBtn: document.getElementById('saveNoteBtn'),
  noteCount: document.getElementById('noteCount'),
  noteList: document.getElementById('noteList'),
  reportSummary: document.getElementById('reportSummary'),
  priorityChart: document.getElementById('priorityChart'),
  statusChart: document.getElementById('statusChart'),
  projectChart: document.getElementById('projectChart'),
  taskDialog: document.getElementById('taskDialog'),
  taskForm: document.getElementById('taskForm'),
  taskDialogTitle: document.getElementById('taskDialogTitle'),
  closeTaskDialogBtn: document.getElementById('closeTaskDialogBtn'),
  cancelTaskDialogBtn: document.getElementById('cancelTaskDialogBtn'),
  taskIdInput: document.getElementById('taskIdInput'),
  taskTitleInput: document.getElementById('taskTitleInput'),
  taskProjectInput: document.getElementById('taskProjectInput'),
  taskCategoryInput: document.getElementById('taskCategoryInput'),
  taskPriorityInput: document.getElementById('taskPriorityInput'),
  taskStatusInput: document.getElementById('taskStatusInput'),
  taskDateInput: document.getElementById('taskDateInput'),
  taskDescriptionInput: document.getElementById('taskDescriptionInput'),
  projectDialog: document.getElementById('projectDialog'),
  projectForm: document.getElementById('projectForm'),
  projectDialogTitle: document.getElementById('projectDialogTitle'),
  closeProjectDialogBtn: document.getElementById('closeProjectDialogBtn'),
  cancelProjectDialogBtn: document.getElementById('cancelProjectDialogBtn'),
  projectIdInput: document.getElementById('projectIdInput'),
  projectNameInput: document.getElementById('projectNameInput'),
  projectDescriptionInput: document.getElementById('projectDescriptionInput'),
  projectOwnerInput: document.getElementById('projectOwnerInput'),
  projectDeadlineInput: document.getElementById('projectDeadlineInput'),
  toast: document.getElementById('toast')
};

init();

function init() {
  fillToday();
  bindEvents();
  renderAll();
  registerServiceWorker();
}

function loadData() {
  try {
    const raw = localStorage.getItem(KEY_DATA);
    const parsed = raw ? JSON.parse(raw) : buildDefaultData();
    parsed.projects ??= [];
    parsed.tasks ??= [];
    parsed.notes ??= [];
    return parsed;
  } catch {
    return buildDefaultData();
  }
}

function persist() {
  localStorage.setItem(KEY_DATA, JSON.stringify(data));
}

function bindEvents() {
  refs.navItems.forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.view)));
  refs.newTaskBtn.addEventListener('click', openTaskDialog);
  refs.newProjectBtn.addEventListener('click', openProjectDialog);
  refs.closeTaskDialogBtn.addEventListener('click', () => refs.taskDialog.close());
  refs.cancelTaskDialogBtn.addEventListener('click', () => refs.taskDialog.close());
  refs.closeProjectDialogBtn.addEventListener('click', () => refs.projectDialog.close());
  refs.cancelProjectDialogBtn.addEventListener('click', () => refs.projectDialog.close());
  refs.taskForm.addEventListener('submit', handleTaskSubmit);
  refs.projectForm.addEventListener('submit', handleProjectSubmit);
  refs.searchTaskInput.addEventListener('input', renderTasks);
  refs.filterStatus.addEventListener('change', renderTasks);
  refs.filterPriority.addEventListener('change', renderTasks);
  refs.filterProject.addEventListener('change', renderTasks);
  refs.saveNoteBtn.addEventListener('click', saveNote);
  refs.exportCsvBtn.addEventListener('click', exportCsv);
  refs.exportJsonBtn.addEventListener('click', exportJson);
  refs.settingsExportBtn.addEventListener('click', exportJson);
  refs.importJsonInput.addEventListener('change', importJson);
  refs.clearDataBtn.addEventListener('click', clearAllData);
  refs.seedBtn.addEventListener('click', restoreSeedData);

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    refs.installBtn.classList.remove('hidden');
  });

  refs.installBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    refs.installBtn.classList.add('hidden');
  });
}

function switchView(view) {
  const map = {
    dashboard: ['Panel principal', 'Administra tareas, proyectos, notas y seguimiento diario en un solo lugar.'],
    tasks: ['Gestión de tareas', 'Consulta, filtra, edita y organiza todas tus tareas registradas.'],
    projects: ['Gestión de proyectos', 'Crea proyectos y revisa su progreso de forma independiente.'],
    agenda: ['Agenda cronológica', 'Visualiza tus tareas agrupadas por fecha límite.'],
    notes: ['Notas rápidas', 'Guarda ideas, recordatorios o información importante.'],
    reports: ['Reportes y análisis', 'Observa métricas y gráficas del comportamiento de la aplicación.'],
    settings: ['Configuración y respaldo', 'Exporta, importa o reinicia los datos del sistema.']
  };
  refs.views.forEach(v => v.classList.toggle('active', v.id === `${view}View`));
  refs.navItems.forEach(n => n.classList.toggle('active', n.dataset.view === view));
  refs.pageTitle.textContent = map[view]?.[0] ?? 'Orbitask Pro';
  refs.pageSubtitle.textContent = map[view]?.[1] ?? '';
  if (view === 'reports') renderCharts();
}

function fillToday() {
  refs.todayLabel.textContent = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
}

function renderAll() {
  renderProjectOptions();
  renderDashboard();
  renderTasks();
  renderProjects();
  renderAgenda();
  renderNotes();
  renderReportSummary();
  renderCharts();
}

function getStats() {
  const total = data.tasks.length;
  const completed = data.tasks.filter(t => t.status === 'completed').length;
  const pending = total - completed;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const high = data.tasks.filter(t => t.priority === 'Alta' && t.status === 'pending').length;
  return { total, completed, pending, progress, high };
}

function renderDashboard() {
  const { total, completed, pending, progress, high } = getStats();
  refs.statTotalTasks.textContent = total;
  refs.statPendingTasks.textContent = pending;
  refs.statCompletedTasks.textContent = completed;
  refs.statProgress.textContent = `${progress}%`;
  refs.statProjects.textContent = data.projects.length;
  refs.statHigh.textContent = high;
  refs.progressChip.textContent = `${completed} de ${total}`;
  refs.progressBar.style.width = `${progress}%`;
  refs.heroTaskSummary.textContent = `${pending} tareas pendientes y ${completed} completadas`;

  const upcoming = [...data.tasks]
    .filter(t => t.status === 'pending')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  refs.upcomingList.innerHTML = upcoming.length ? upcoming.map(task => `
    <div class="list-item">
      <strong>${escapeHtml(task.title)}</strong>
      <small>${escapeHtml(projectName(task.projectId))} · ${formatDate(task.date)} · ${task.priority}</small>
    </div>`).join('') : emptyState('No hay tareas pendientes próximas.');

  const recent = [...data.tasks].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  refs.recentTasksList.innerHTML = recent.length ? recent.map(task => `
    <div class="list-item">
      <strong>${escapeHtml(task.title)}</strong>
      <small>${task.status === 'completed' ? 'Completada' : 'Pendiente'} · ${escapeHtml(task.category)}</small>
    </div>`).join('') : emptyState('No hay tareas registradas.');

  refs.dashboardProjects.innerHTML = data.projects.length ? data.projects.map(project => {
    const stats = projectStats(project.id);
    return `
      <div class="list-item">
        <strong>${escapeHtml(project.name)}</strong>
        <small>${stats.completed}/${stats.total} tareas completadas · progreso ${stats.progress}%</small>
      </div>`;
  }).join('') : emptyState('No hay proyectos disponibles.');
}

function renderProjectOptions() {
  const options = ['<option value="">Sin proyecto</option>', ...data.projects.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`)];
  refs.taskProjectInput.innerHTML = options.join('');
  refs.filterProject.innerHTML = '<option value="all">Todos los proyectos</option>' + data.projects.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('');
}

function renderTasks() {
  const query = refs.searchTaskInput.value.trim().toLowerCase();
  const status = refs.filterStatus.value;
  const priority = refs.filterPriority.value;
  const project = refs.filterProject.value;

  const filtered = data.tasks.filter(task => {
    const matchesQuery = [task.title, task.description, task.category, projectName(task.projectId)].join(' ').toLowerCase().includes(query);
    const matchesStatus = status === 'all' || task.status === status;
    const matchesPriority = priority === 'all' || task.priority === priority;
    const matchesProject = project === 'all' || task.projectId === project;
    return matchesQuery && matchesStatus && matchesPriority && matchesProject;
  }).sort((a, b) => a.date.localeCompare(b.date));

  refs.taskList.innerHTML = filtered.length ? filtered.map(task => `
    <article class="task-card ${task.status === 'completed' ? 'completed' : ''}">
      <input class="task-check" type="checkbox" ${task.status === 'completed' ? 'checked' : ''}
        onchange="toggleTaskStatus('${task.id}', this.checked)" aria-label="Cambiar estado" />
      <div class="task-main">
        <div class="project-top">
          <h4>${escapeHtml(task.title)}</h4>
          <div class="icon-row">
            <span class="badge ${priorityClass(task.priority)}">${task.priority}</span>
            <span class="badge ${task.status === 'completed' ? 'status-done' : 'status-pending'}">${task.status === 'completed' ? 'Completada' : 'Pendiente'}</span>
          </div>
        </div>
        <p class="task-description">${escapeHtml(task.description || 'Sin descripción')}</p>
        <div class="task-meta">
          <span>Proyecto: ${escapeHtml(projectName(task.projectId))}</span>
          <span>•</span>
          <span>Categoría: ${escapeHtml(task.category)}</span>
          <span>•</span>
          <span>Fecha: ${formatDate(task.date)}</span>
        </div>
      </div>
      <div class="icon-row">
        <button class="icon-btn" onclick="editTask('${task.id}')" title="Editar">✎</button>
        <button class="icon-btn" onclick="deleteTask('${task.id}')" title="Eliminar">🗑</button>
      </div>
    </article>`).join('') : emptyState('No se encontraron tareas con los filtros seleccionados.');
}

function renderProjects() {
  refs.projectCount.textContent = `${data.projects.length} ${data.projects.length === 1 ? 'proyecto' : 'proyectos'}`;
  refs.projectList.innerHTML = data.projects.length ? data.projects.map(project => {
    const stats = projectStats(project.id);
    return `
      <article class="project-card">
        <div class="project-top">
          <div>
            <h4>${escapeHtml(project.name)}</h4>
            <p>${escapeHtml(project.description || 'Sin descripción')}</p>
          </div>
          <div class="icon-row">
            <button class="icon-btn" onclick="editProject('${project.id}')" title="Editar">✎</button>
            <button class="icon-btn" onclick="deleteProject('${project.id}')" title="Eliminar">🗑</button>
          </div>
        </div>
        <div class="metric-row">
          <span>Responsable: ${escapeHtml(project.owner || 'No definido')}</span>
          <span>Fecha objetivo: ${project.deadline ? formatDate(project.deadline) : 'Sin fecha'}</span>
          <span>Tareas: ${stats.total}</span>
          <span>Completadas: ${stats.completed}</span>
          <span>Progreso: ${stats.progress}%</span>
        </div>
        <div class="progress-track"><div class="progress-bar" style="width:${stats.progress}%"></div></div>
      </article>`;
  }).join('') : emptyState('No hay proyectos registrados.');
}

function renderAgenda() {
  const tasks = [...data.tasks].sort((a, b) => a.date.localeCompare(b.date));
  if (!tasks.length) {
    refs.agendaList.innerHTML = emptyState('No hay tareas en la agenda.');
    return;
  }
  let currentDate = '';
  refs.agendaList.innerHTML = tasks.map(task => {
    const showHeader = task.date !== currentDate;
    currentDate = task.date;
    return `
      ${showHeader ? `<div class="agenda-date">${formatDate(task.date)}</div>` : ''}
      <article class="agenda-card">
        <h4>${escapeHtml(task.title)}</h4>
        <p class="muted">${escapeHtml(projectName(task.projectId))} · ${escapeHtml(task.category)} · ${task.priority} · ${task.status === 'completed' ? 'Completada' : 'Pendiente'}</p>
        <p class="muted">${escapeHtml(task.description || 'Sin descripción')}</p>
      </article>`;
  }).join('');
}

function renderNotes() {
  refs.noteCount.textContent = `${data.notes.length} ${data.notes.length === 1 ? 'nota' : 'notas'}`;
  refs.noteList.innerHTML = data.notes.length ? data.notes.map(note => `
    <article class="note-card">
      <h4>${escapeHtml(note.title)}</h4>
      <p>${escapeHtml(note.content)}</p>
      <div class="note-footer">
        <span>${new Date(note.createdAt).toLocaleString('es-MX')}</span>
        <button class="icon-btn" onclick="deleteNote('${note.id}')" title="Eliminar">🗑</button>
      </div>
    </article>`).join('') : emptyState('No hay notas guardadas.');
}

function renderReportSummary() {
  const { total, completed, pending, progress, high } = getStats();
  const overdue = data.tasks.filter(t => t.status === 'pending' && t.date < todayISO()).length;
  const projectMost = [...data.projects].sort((a, b) => projectStats(b.id).total - projectStats(a.id).total)[0];

  refs.reportSummary.innerHTML = [
    ['Total de tareas', `${total} registradas en el sistema.`],
    ['Tareas pendientes', `${pending} pendientes por realizar.`],
    ['Tareas completadas', `${completed} finalizadas correctamente.`],
    ['Progreso general', `${progress}% de avance global.`],
    ['Alta prioridad', `${high} tareas de atención inmediata.`],
    ['Vencidas', `${overdue} tareas pendientes con fecha anterior a hoy.`],
    ['Proyecto con más actividad', projectMost ? `${escapeHtml(projectMost.name)} (${projectStats(projectMost.id).total} tareas)` : 'Sin proyectos.']
  ].map(([title, text]) => `<div class="summary-box"><strong>${title}</strong><span class="muted">${text}</span></div>`).join('');
}

function renderCharts() {
  drawBarChart(refs.priorityChart, {
    labels: ['Alta', 'Media', 'Baja'],
    values: [countPriority('Alta'), countPriority('Media'), countPriority('Baja')],
    color: '#ef233c'
  }, 'Cantidad de tareas');

  drawBarChart(refs.statusChart, {
    labels: ['Pendientes', 'Completadas'],
    values: [data.tasks.filter(t => t.status === 'pending').length, data.tasks.filter(t => t.status === 'completed').length],
    color: '#ffffff'
  }, 'Estado general');

  drawBarChart(refs.projectChart, {
    labels: data.projects.map(p => shorten(p.name, 16)),
    values: data.projects.map(p => projectStats(p.id).total),
    color: '#c1121f'
  }, 'Tareas por proyecto');
}

function drawBarChart(canvas, dataset, labelText) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth || 600;
  const cssHeight = 320;
  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cssWidth, cssHeight);
  ctx.fillStyle = '#0f0f0f';
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  const padding = { top: 35, right: 20, bottom: 55, left: 45 };
  const chartW = cssWidth - padding.left - padding.right;
  const chartH = cssHeight - padding.top - padding.bottom;
  const max = Math.max(...dataset.values, 1);
  const step = chartW / Math.max(dataset.values.length, 1);

  ctx.strokeStyle = '#2d2d2d';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartW, y);
    ctx.stroke();
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 14px Inter, sans-serif';
  ctx.fillText(labelText, padding.left, 18);

  dataset.values.forEach((value, index) => {
    const barHeight = (value / max) * (chartH - 10);
    const x = padding.left + index * step + step * 0.18;
    const y = padding.top + chartH - barHeight;
    const w = step * 0.64;

    ctx.fillStyle = dataset.color;
    roundRect(ctx, x, y, w, barHeight, 10);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '700 13px Inter, sans-serif';
    ctx.fillText(String(value), x + w / 2, y - 8);
    ctx.fillStyle = '#bcbcbc';
    ctx.font = '600 12px Inter, sans-serif';
    ctx.fillText(dataset.labels[index] ?? '', x + w / 2, padding.top + chartH + 22);
  });
  ctx.textAlign = 'start';
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function handleTaskSubmit(event) {
  event.preventDefault();
  const payload = {
    title: refs.taskTitleInput.value.trim(),
    projectId: refs.taskProjectInput.value,
    category: refs.taskCategoryInput.value,
    priority: refs.taskPriorityInput.value,
    status: refs.taskStatusInput.value,
    date: refs.taskDateInput.value,
    description: refs.taskDescriptionInput.value.trim(),
  };
  if (!payload.title || !payload.date) return showToast('Completa el título y la fecha de la tarea.');

  if (editingTaskId) {
    const task = data.tasks.find(t => t.id === editingTaskId);
    if (task) Object.assign(task, payload);
    showToast('Tarea actualizada.');
  } else {
    data.tasks.unshift({ id: crypto.randomUUID(), createdAt: Date.now(), ...payload });
    showToast('Tarea creada.');
  }
  persist();
  renderAll();
  refs.taskDialog.close();
}

function handleProjectSubmit(event) {
  event.preventDefault();
  const payload = {
    name: refs.projectNameInput.value.trim(),
    description: refs.projectDescriptionInput.value.trim(),
    owner: refs.projectOwnerInput.value.trim(),
    deadline: refs.projectDeadlineInput.value,
  };
  if (!payload.name) return showToast('Escribe el nombre del proyecto.');

  if (editingProjectId) {
    const project = data.projects.find(p => p.id === editingProjectId);
    if (project) Object.assign(project, payload);
    showToast('Proyecto actualizado.');
  } else {
    data.projects.unshift({ id: crypto.randomUUID(), createdAt: Date.now(), ...payload });
    showToast('Proyecto creado.');
  }
  persist();
  renderAll();
  refs.projectDialog.close();
}

function openTaskDialog() {
  editingTaskId = null;
  refs.taskDialogTitle.textContent = 'Nueva tarea';
  refs.taskForm.reset();
  refs.taskDateInput.value = todayISO();
  refs.taskStatusInput.value = 'pending';
  refs.taskPriorityInput.value = 'Media';
  refs.taskProjectInput.value = '';
  refs.taskDialog.showModal();
}

function openProjectDialog() {
  editingProjectId = null;
  refs.projectDialogTitle.textContent = 'Nuevo proyecto';
  refs.projectForm.reset();
  refs.projectDialog.showModal();
}

function editTask(id) {
  const task = data.tasks.find(t => t.id === id);
  if (!task) return;
  editingTaskId = id;
  refs.taskDialogTitle.textContent = 'Editar tarea';
  refs.taskTitleInput.value = task.title;
  refs.taskProjectInput.value = task.projectId ?? '';
  refs.taskCategoryInput.value = task.category;
  refs.taskPriorityInput.value = task.priority;
  refs.taskStatusInput.value = task.status;
  refs.taskDateInput.value = task.date;
  refs.taskDescriptionInput.value = task.description || '';
  refs.taskDialog.showModal();
}

function editProject(id) {
  const project = data.projects.find(p => p.id === id);
  if (!project) return;
  editingProjectId = id;
  refs.projectDialogTitle.textContent = 'Editar proyecto';
  refs.projectNameInput.value = project.name;
  refs.projectDescriptionInput.value = project.description || '';
  refs.projectOwnerInput.value = project.owner || '';
  refs.projectDeadlineInput.value = project.deadline || '';
  refs.projectDialog.showModal();
}

function toggleTaskStatus(id, checked) {
  const task = data.tasks.find(t => t.id === id);
  if (!task) return;
  task.status = checked ? 'completed' : 'pending';
  persist();
  renderAll();
}

function deleteTask(id) {
  const task = data.tasks.find(t => t.id === id);
  if (!task) return;
  if (!confirm(`¿Eliminar la tarea "${task.title}"?`)) return;
  data.tasks = data.tasks.filter(t => t.id !== id);
  persist();
  renderAll();
  showToast('Tarea eliminada.');
}

function deleteProject(id) {
  const project = data.projects.find(p => p.id === id);
  if (!project) return;
  if (!confirm(`¿Eliminar el proyecto "${project.name}"?`)) return;
  data.projects = data.projects.filter(p => p.id !== id);
  data.tasks = data.tasks.map(task => task.projectId === id ? { ...task, projectId: '' } : task);
  persist();
  renderAll();
  showToast('Proyecto eliminado.');
}

function saveNote() {
  const title = refs.noteTitleInput.value.trim();
  const content = refs.noteContentInput.value.trim();
  if (!title || !content) return showToast('Escribe un título y contenido para la nota.');
  data.notes.unshift({ id: crypto.randomUUID(), title, content, createdAt: Date.now() });
  refs.noteTitleInput.value = '';
  refs.noteContentInput.value = '';
  persist();
  renderNotes();
  showToast('Nota guardada.');
}

function deleteNote(id) {
  if (!confirm('¿Eliminar esta nota?')) return;
  data.notes = data.notes.filter(n => n.id !== id);
  persist();
  renderNotes();
  showToast('Nota eliminada.');
}

function exportCsv() {
  if (!data.tasks.length) return showToast('No hay tareas para exportar.');
  const rows = [
    ['Titulo', 'Proyecto', 'Categoria', 'Prioridad', 'Estado', 'Fecha', 'Descripcion'],
    ...data.tasks.map(t => [t.title, projectName(t.projectId), t.category, t.priority, t.status, t.date, t.description || ''])
  ];
  downloadFile('orbitask_tareas.csv', '\ufeff' + rows.map(row => row.map(csvCell).join(',')).join('\n'), 'text/csv;charset=utf-8;');
  showToast('Archivo CSV exportado.');
}

function exportJson() {
  downloadFile('orbitask_respaldo.json', JSON.stringify(data, null, 2), 'application/json;charset=utf-8;');
  showToast('Respaldo JSON generado.');
}

function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      parsed.projects ??= [];
      parsed.tasks ??= [];
      parsed.notes ??= [];
      data = parsed;
      persist();
      renderAll();
      showToast('Respaldo importado correctamente.');
    } catch {
      showToast('El archivo JSON no es válido.');
    }
    event.target.value = '';
  };
  reader.readAsText(file, 'utf-8');
}

function clearAllData() {
  if (!confirm('¿Eliminar todos los datos de la aplicación?')) return;
  data = { projects: [], tasks: [], notes: [] };
  persist();
  renderAll();
  showToast('Todos los datos fueron eliminados.');
}

function restoreSeedData() {
  if (!confirm('¿Restaurar datos demo? Esto reemplazará la información actual.')) return;
  data = buildDefaultData();
  persist();
  renderAll();
  showToast('Datos demo restaurados.');
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function projectName(id) {
  if (!id) return 'Sin proyecto';
  return data.projects.find(p => p.id === id)?.name ?? 'Proyecto eliminado';
}

function projectStats(projectId) {
  const tasks = data.tasks.filter(t => t.projectId === projectId);
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, progress };
}

function countPriority(priority) {
  return data.tasks.filter(t => t.priority === priority).length;
}

function priorityClass(priority) {
  return priority === 'Alta' ? 'high' : priority === 'Media' ? 'medium' : 'low';
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function futureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

function shorten(str, max) {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

function emptyState(text) {
  return `<div class="empty-state">${text}</div>`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function showToast(text) {
  refs.toast.textContent = text;
  refs.toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => refs.toast.classList.remove('show'), 2200);
}

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try { await navigator.serviceWorker.register('service-worker.js'); } catch {}
  }
}

window.editTask = editTask;
window.deleteTask = deleteTask;
window.toggleTaskStatus = toggleTaskStatus;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.deleteNote = deleteNote;
window.addEventListener('resize', () => {
  if (document.getElementById('reportsView').classList.contains('active')) renderCharts();
});
