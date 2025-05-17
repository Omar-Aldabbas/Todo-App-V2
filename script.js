const taskFormElement = document.getElementById("task-form");
const closeConfirmDialog = document.getElementById("confirm-close-dialog");
const showFormBtn = document.getElementById("open-task-form-btn");
const hideFormBtn = document.getElementById("close-task-form-btn");
const saveTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelDialogBtn = document.getElementById("cancel-btn");
const discardChangesBtn = document.getElementById("discard-btn");
const taskListContainer = document.getElementById("tasks-container");
const taskTitleInput = document.getElementById("title-input");
const taskDateInput = document.getElementById("date-input");
const taskDescInput = document.getElementById("description-input");

let storedTasks = JSON.parse(localStorage.getItem("data")) || [];
let editingTask = {};

const sanitizeInput = (input) => {
  return input.trim().replace(/[^A-Za-z0-9\-\s]/g, '');
};

const saveTask = () => {
  if (!taskTitleInput.value.trim()) {
    alert("Task title is required.");
    return;
  }

  const taskIndex = storedTasks.findIndex((task) => task.id === editingTask.id);
  const taskObject = {
    id: `${sanitizeInput(taskTitleInput.value).toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: sanitizeInput(taskTitleInput.value),
    date: taskDateInput.value,
    description: sanitizeInput(taskDescInput.value),
  };

  if (taskIndex === -1) {
    storedTasks.unshift(taskObject);
  } else {
    storedTasks[taskIndex] = taskObject;
  }

  localStorage.setItem("data", JSON.stringify(storedTasks));
  renderTasks();
  clearForm();
};

const renderTasks = () => {
  taskListContainer.innerHTML = "";

  storedTasks.forEach(({ id, title, date, description }) => {
    taskListContainer.innerHTML += `
      <div class="task" id="${id}">
        <p><strong>Title:</strong> ${title}</p>
        ${date ? `<p><strong>Date:</strong> ${date}</p>` : ''}
        ${description ? `<p class="task-desc"><strong>TO DO:</strong> ${description}</p>` : ''}
        <button onclick="startEditTask(this)" type="button" class="btn">Edit</button>
        <button onclick="removeTask(this)" type="button" class="btn">Delete</button>
      </div>
    `;
  });
};

const removeTask = (buttonElement) => {
  const taskIndex = storedTasks.findIndex(
    (task) => task.id === buttonElement.parentElement.id
  );

  buttonElement.parentElement.remove();
  storedTasks.splice(taskIndex, 1);
  localStorage.setItem("data", JSON.stringify(storedTasks));
};

const startEditTask = (buttonElement) => {
  const taskIndex = storedTasks.findIndex(
    (task) => task.id === buttonElement.parentElement.id
  );

  editingTask = storedTasks[taskIndex];

  taskTitleInput.value = editingTask.title;
  taskDateInput.value = editingTask.date;
  taskDescInput.value = editingTask.description;

  saveTaskBtn.innerText = "Update Task";
  taskFormElement.classList.remove("hidden");
};

const clearForm = () => {
  saveTaskBtn.innerText = "Add Task";
  taskTitleInput.value = "";
  taskDateInput.value = "";
  taskDescInput.value = "";
  taskFormElement.classList.add("hidden");
  editingTask = {};
};

if (storedTasks.length) {
  renderTasks();
}

showFormBtn.addEventListener("click", () => {
  taskFormElement.classList.remove("hidden");
});

hideFormBtn.addEventListener("click", () => {
  const hasChanges = taskTitleInput.value || taskDateInput.value || taskDescInput.value;
  const valuesChanged =
    taskTitleInput.value !== editingTask.title ||
    taskDateInput.value !== editingTask.date ||
    taskDescInput.value !== editingTask.description;

  if (hasChanges && valuesChanged) {
    closeConfirmDialog.showModal();
  } else {
    clearForm();
  }
});

cancelDialogBtn.addEventListener("click", () => closeConfirmDialog.close());

discardChangesBtn.addEventListener("click", () => {
  closeConfirmDialog.close();
  clearForm();
});

taskFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  saveTask();
});
