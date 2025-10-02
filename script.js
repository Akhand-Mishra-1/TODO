const input = document.querySelector('.txt');
const addBtn = document.querySelector("#icon");
const list = document.querySelector("#list");
const nightToggle = document.querySelector(".night");
const body = document.body;
const todoTitle = document.querySelector(".in");
const todo2 = document.querySelector(".todo2")

function initializeAnimations() {
  anime({
    targets: '.in',
    translateY: [
      { value: -50, easing: 'easeInOutQuad' },
      { value: 10, easing: 'easeOutBounce', delay: 100 }
    ],
    rotate: '1turn',
    delay: anime.stagger(100),
    duration: 1000,
    loop: false
  });

  anime({
    targets: '#icon',
    translateY: [
      { value: -50, easing: 'easeInOutQuad' },
      { value: 0, easing: 'easeOutBounce', delay: 100 }
    ],
    rotate: '4turn',
    delay: anime.stagger(100),
    duration: 1200,
    loop: false
  });

  anime({
    targets: '.night',
    translateY: [
      { value: -50, easing: 'easeInOutQuad' },
      { value: 0, easing: 'easeOutBounce', delay: 90 }
    ],
    rotate: '2turn',
    delay: anime.stagger(100),
    duration: 1000,
    loop: false
  });
}


const ThemeManager = {
  icons: {
    moon: `<path fill="#FFF" d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"/>`,
    sun: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fill-rule="evenodd" d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"/></svg>`
  },

  applyDarkTheme() {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
    todoTitle.style.color = "black"
    nightToggle.innerHTML =
      `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">${this.icons.sun}</svg>`;
  },

  applyLightTheme() {
    body.classList.add("light-mode");
    todoTitle.style.color = "white"
    body.classList.remove("dark-mode");
    // todo2.style.background:"rgba(255, 255, 255, 0.477)";
    
    nightToggle.innerHTML =
      `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">${this.icons.moon}</svg>`;
  },

  toggle() {
    if (body.classList.contains("dark-mode")) {
      this.applyLightTheme();
      localStorage.setItem("theme", "light");
    } else {
      this.applyDarkTheme();
      localStorage.setItem("theme", "dark");
    }
  },

  loadSavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      this.applyDarkTheme();
    } else {
      this.applyLightTheme();
    }
  }
};


const TodoManager = {
  addTask() {
    const taskText = input.value.trim();
    if (!taskText) {
      this.showNotification("Please enter a task!", "error");
      return;
    }
    const taskItem = this.createTaskElement(taskText);
    list.appendChild(taskItem);
    this.animateTaskEntry(taskItem);
    input.value = "";
    input.focus();
  },

  createTaskElement(taskText) {
    const listItem = document.createElement("li");
    listItem.className = "task-item";
    listItem.innerHTML = `
      <span class="task-text">${taskText}</span>
      <div class="task-actions">
        <i class="checkbox-btn fa-solid fa-check"></i>
        <i class="delete-btn fa-solid fa-xmark"></i>
      </div>
    `;
    this.attachTaskEventListeners(listItem);
    return listItem;
  },

  attachTaskEventListeners(taskItem) {
    const checkboxBtn = taskItem.querySelector(".checkbox-btn");
    const deleteBtn = taskItem.querySelector(".delete-btn");
    const taskText = taskItem.querySelector(".task-text");

    checkboxBtn.addEventListener("click", () => {
      const isCompleted = taskItem.classList.contains("completed");
      if (isCompleted) {
        this.markTaskIncomplete(taskItem, taskText);
      } else {
        this.markTaskComplete(taskItem, taskText);
      }
    });

    deleteBtn.addEventListener("click", () => {
      this.deleteTask(taskItem);
    });
  },

  markTaskComplete(taskItem, taskText) {
    taskItem.classList.add("completed");
    taskText.style.textDecoration = "line-through";
    taskText.style.opacity = "0.6";
    anime({ targets: taskItem, scale: [1, 1.05, 1], duration: 300, easing: "easeInOutQuad" });
    this.showNotification("Task completed! 🎉", "success");
  },

  markTaskIncomplete(taskItem, taskText) {
    taskItem.classList.remove("completed");
    taskText.style.textDecoration = "none";
    taskText.style.opacity = "1";
    this.showNotification("Task marked as incomplete", "info");
  },

  deleteTask(taskItem) {
    anime({
      targets: taskItem,
      opacity: [1, 0],
      translateX: [0, 50],
      scale: [1, 0.8],
      duration: 500,
      easing: "easeInOutQuad",
      complete: () => {
        if (taskItem.parentNode) list.removeChild(taskItem);
        this.showNotification("Task deleted", "info");
      }
    });
  },

  animateTaskEntry(taskItem) {
    anime({ targets: taskItem, opacity: [0, 1], translateY: [-20, 0], scale: [0.8, 1], duration: 500, easing: "easeOutBounce" });
  },

  showNotification(message, type = "info") {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
};


function setupEventListeners() {
  addBtn.addEventListener("click", () => TodoManager.addTask());
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") TodoManager.addTask();
  });
  nightToggle.addEventListener("click", () => ThemeManager.toggle());
}


ThemeManager.loadSavedTheme();
setupEventListeners();
initializeAnimations();
