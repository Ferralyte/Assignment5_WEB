let tasks = [
  { id: 1, title: "Setup repository", status: "todo", priority: 1, tag: "Backend" },
  { id: 2, title: "Design UI mockup", status: "inprogress", priority: 2, tag: "Design" },
  { id: 3, title: "Write HTML layout", status: "done", priority: 3, tag: "Frontend" },
  { id: 4, title: "Connect database", status: "todo", priority: 2, tag: "Backend" },
  { id: 5, title: "Implement CSS styles", status: "inprogress", priority: 1, tag: "Frontend" },
  { id: 6, title: "Write unit tests", status: "todo", priority: 3, tag: "Testing" },
  { id: 7, title: "Fix navigation bug", status: "todo", priority: 1, tag: "Frontend" },
  { id: 8, title: "Deploy to server", status: "done", priority: 3, tag: "Backend" },
  { id: 9, title: "Write documentation", status: "todo", priority: 2, tag: "Design" },
  { id: 10, title: "Optimize assets", status: "inprogress", priority: 2, tag: "Frontend" }
];

let searchQuery = "";
let selectedTag = "";
let sortMode = "default";
let actionMessage = "";

const boardEl = document.getElementById('kanban-board');
const searchInput = document.getElementById('search-input');
const filterTagSelect = document.getElementById('filter-tag');
const sortPrioritySelect = document.getElementById('sort-priority');
const messageEl = document.getElementById('kanban-message');
const progressEl = document.getElementById('kanban-progress');
const progressTextEl = document.getElementById('progress-text');

function render() {
  const todoList = boardEl.querySelector('[data-column="todo"]');
  const inprogressList = boardEl.querySelector('[data-column="inprogress"]');
  const doneList = boardEl.querySelector('[data-column="done"]');

  todoList.innerHTML = "";
  inprogressList.innerHTML = "";
  doneList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "" || task.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  if (sortMode === "high-to-low") {
    filteredTasks.sort((a, b) => a.priority - b.priority);
  }

  if (filteredTasks.length === 0) {
    messageEl.textContent = "No tasks found matching your criteria.";
  } else {
    messageEl.textContent = actionMessage;
  }

  filteredTasks.forEach(task => {
    const card = document.createElement('div');
    card.classList.add('kanban-card');
    card.dataset.id = task.id;

    const titleEl = document.createElement('h4');
    titleEl.textContent = task.title;

    const infoEl = document.createElement('p');
    infoEl.textContent = `Tag: ${task.tag} | Priority: ${task.priority}`;
    infoEl.classList.add('card-meta');

    card.appendChild(titleEl);
    card.appendChild(infoEl);

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('card-actions');

    if (task.status !== 'todo') {
      const btnPrev = document.createElement('button');
      btnPrev.textContent = '←';
      btnPrev.dataset.action = 'move-prev';
      actionsDiv.appendChild(btnPrev);
    }

    if (task.status !== 'done') {
      const btnNext = document.createElement('button');
      btnNext.textContent = '→';
      btnNext.dataset.action = 'move-next';
      actionsDiv.appendChild(btnNext);
    }

    card.appendChild(actionsDiv);

    if (task.status === 'todo') {
      todoList.appendChild(card);
    } else if (task.status === 'inprogress') {
      inprogressList.appendChild(card);
    } else if (task.status === 'done') {
      doneList.appendChild(card);
    }
  });

  let completedCount = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].status === 'done') {
      completedCount++;
    }
  }
  const progressPercent = Math.round((completedCount / tasks.length) * 100);
  progressEl.value = progressPercent;
  progressTextEl.textContent = `${progressPercent}%`;
}

function moveTask(taskId, direction) {
  const task = tasks.find(t => t.id === Number(taskId));
  if (!task) return;

  actionMessage = "";

  if (direction === 'next') {
    if (task.status === 'todo') {
      let inProgressCount = 0;
      for (let t of tasks) {
        if (t.status === 'inprogress') inProgressCount++;
      }

      if (inProgressCount >= 3) {
        actionMessage = "Rule violation: 'In Progress' column cannot hold more than 3 cards!";
        render();
        return;
      }
      task.status = 'inprogress';
    } else if (task.status === 'inprogress') {
      task.status = 'done';
    }
  } else if (direction === 'prev') {
    if (task.status === 'done') {
      // Проверка лимита при возврате из Done в In Progress
      let inProgressCount = 0;
      for (let t of tasks) {
        if (t.status === 'inprogress') inProgressCount++;
      }

      if (inProgressCount >= 3) {
        actionMessage = "Rule violation: 'In Progress' column cannot hold more than 3 cards!";
        render();
        return;
      }
      task.status = 'inprogress';
    } else if (task.status === 'inprogress') {
      task.status = 'todo';
    }
  }

  render();
}

boardEl.addEventListener('click', (event) => {
  const targetBtn = event.target;
  if (targetBtn.tagName !== 'BUTTON') return;

  const card = targetBtn.closest('.kanban-card');
  if (!card) return;

  const taskId = card.dataset.id;
  const action = targetBtn.dataset.action;

  if (action === 'move-next') {
    moveTask(taskId, 'next');
  } else if (action === 'move-prev') {
    moveTask(taskId, 'prev');
  }
});

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  render();
});

filterTagSelect.addEventListener('change', (e) => {
  selectedTag = e.target.value;
  render();
});

sortPrioritySelect.addEventListener('change', (e) => {
  sortMode = e.target.value;
  render();
});

render();