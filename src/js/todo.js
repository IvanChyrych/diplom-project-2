import { Modal } from "bootstrap";

const formElement = document.querySelector("#form");
const inputElement = document.querySelector("#input");
const selectElement = document.querySelector("#mySelect");
const deleteButtonElement = document.querySelector(".main");
const deleteAll = document.querySelector(".main__delete-all-button");
const editButtonElement = document.querySelector(".main");
const selectUserElement = document.querySelector("#selectUser");
const counterElement = document.querySelector("#count");

formElement.addEventListener("submit", addTask);
deleteButtonElement.addEventListener("click", deleteTask);
deleteAll.addEventListener("click", deleteAllTasks);
editButtonElement.addEventListener("click", editTask);

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => render(task));
}

function addTask(event) {
  event.preventDefault();

  const cardText = inputElement.value;
  const selectedValue = selectElement.value;
  const user = selectUserElement.value;

  const newTask = {
    id: Date.now(),
    text: cardText,
    status: selectedValue, // 'inProgress', 'done'
    cssClass: selectedValue,
    user: user,
  };

  tasks.push(newTask);

  saveToLocalStorage();
  render(newTask);
  checkInProgressColumn();
}

function editTask(event) {
  let count = 0;
  if (event.target.dataset.action !== "edit") return;

  const counter = document.createElement("div");
  counter.innerHTML = `<p>${count}</p>`;
  counterElement.append(counter);

  tasks.forEach((item) => {
    if (item.status == "inProgress") {
      count++;
    }
    document.getElementById("count").textContent = count;
    if (count > 3) {
      alert("выполните прошлые задания");
      return;
    }
  });

  const parenNode = event.target.closest(".main__item");
  const id = Number(parenNode.id);
  const lookingTask = tasks.filter((task) => task.id == id);
  const editTextAriaElement = document.querySelector("#editTextAria");
  const cardText = editTextAriaElement.value;

  const selectEditElement = document.querySelector("#selectEdit");
  const selectedValue = selectEditElement.value;
  const user = selectUserElement.value;

  lookingTask[0].status = selectedValue;
  lookingTask[0].text = cardText;
  lookingTask[0].cssClass = selectedValue;
  lookingTask[0].user = user;

  const newTask = {
    id: Date.now(),
    text: cardText,
    cssClass: selectedValue,
    status: selectedValue, // 'inProgress', 'done'
    user: user,
  };
  checkInProgressColumn();
  render(newTask);

  saveToLocalStorage();
}

function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;

  const parenNode = event.target.closest(".main__item");

  const id = Number(parenNode.id);

  tasks = tasks.filter((task) => task.id !== id);

  saveToLocalStorage();

  parenNode.remove();
}

function deleteAllTasks(event) {
  if (event.target.dataset.action === "deleteAll") {
    let isBoss = confirm("Вы уверены?");
    if (!isBoss) {
      return;
    }

    tasks.length = 0;

    const cards = document.querySelectorAll(".main__item");

    cards.forEach((element) => {
      element.classList.add("d-none");
    });
  }
  saveToLocalStorage();
}

function render(task) {
  const template = buildTemplate(task);
  const containerElement = document.querySelector(`#${task.status}`);
  containerElement.insertAdjacentHTML("beforeend", template);
}

function buildTemplate({ id, text, cssClass, user }) {
  return `
  <div class=" main__item row ${cssClass}" id="${id}">

   <div class="col-7"><p class="main__text">${text}</p></div>
   <div class="col-7"><p class="main__text">${user}</p></div>
  
    <button type="button btn" class="header__deleteButton btn btn-success" data-action="delete">X</button>
    <button
    type="button"
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#exampleModalEdit"
      >
    Edit
  </button>
  
  <!-- Модальное окно добавление задачи -->
  <div
    class="modal fade"
    id="exampleModalEdit"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Add task
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Закрыть"
          ></button>
        </div>
        <div class="modal-body"> 
        <p>Описание задачи</p>
            <p><textarea rows="5" cols="60" name="text" id="editTextAria" class="${cssClass} main__item">${text} </textarea></p> 
            <p>Колонка</p>
            <select id="selectEdit" class="form-select" aria-label="Default select example">
            <option selected value="todo"  data-action="main__todo-column">todo</option>
            <option value="inProgress" data-action="main__in-progress-column">in-progress</option>
            <option value="done" data-action="main__done-column">done</option>
          </select>
            <form id="form" class="d-flex align-items-center w-50 p-4">
            <button type="submit" class="btn btn-primary " id="editButton" data-action="edit">
              Сохранить
            </button>
              </form>
                  </div>
              </div>
    </div>
  </div>
  </div>
  </div>
  `;
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

window.onload = function () {
  window.setInterval(function () {
    const now = new Date();
    const clock = document.getElementById("clock");
    clock.innerHTML = now.toLocaleTimeString();
  }, 1000);
};

fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((data) => {
    renderUsers(data);
  });

function renderUsers(data) {
  data.forEach((item) => {
    const div = document.createElement("option");
    div.innerHTML = `<option value="${item.name}">${item.name}</option>`;
    selectUserElement.append(div);
  });
}

function checkInProgressColumn() {
  tasks.forEach((item) => {
    if (item.status == "inProgress") {
      count++;
    }
    document.getElementById("count").textContent = count;
    if (count > 3) {
      alert("выполните прошлые задания");
      return;
    }
  });
}
