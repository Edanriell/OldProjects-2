import "../css/style.css";

const todoInput: HTMLInputElement | null = document.querySelector(".todo-input");
const todoButton: HTMLButtonElement | null = document.querySelector(".todo-button");
const todoList: HTMLLIElement | null = document.querySelector(".todo-list");
const filterOption: HTMLSelectElement | null = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", getTodos);
todoButton!.addEventListener("click", addTodo);
todoList!.addEventListener("click", deleteCheck);
filterOption!.addEventListener("click", filterTodo);

function addTodo(event: any): void {
	event.preventDefault();
	const todoDiv: HTMLDivElement = document.createElement("div");
	todoDiv.classList.add("todo");
	const newTodo: HTMLLIElement = document.createElement("li");
	newTodo.innerText = todoInput!.value;
	newTodo.classList.add("todo-item");
	todoDiv.append(newTodo);
	saveLocalTodos(todoInput!.value);
	const completedButton: HTMLButtonElement = document.createElement("button");
	completedButton.innerHTML = `<i class="fas fa-check"></i>`;
	completedButton.classList.add("complete-btn");
	todoDiv.append(completedButton);
	const trashButton: HTMLButtonElement = document.createElement("button");
	trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
	trashButton.classList.add("trash-btn");
	todoDiv.append(trashButton);
	todoList!.append(todoDiv);
	todoInput!.value = "";
}

function deleteCheck(event: any): void {
	const item: any = event.target;
	if (item.classList[0] === "trash-btn") {
		const todo: HTMLDivElement = item.parentElement;
		todo.classList.add("fall");
        removeLocalTodos(todo);
		todo.addEventListener("transitionend", function () {
			todo.remove();
		});
	}

	if (item.classList[0] === "complete-btn") {
		const todo: HTMLDivElement = item.parentElement;
		todo.classList.toggle("completed");
	}
}

function filterTodo(event: any): void {
	const todos = todoList!.childNodes as NodeListOf<HTMLDivElement>;
	todos.forEach(function (todo) {
		switch (event.target.value) {
			case "all":
				todo.style.display = "flex";
				break;
			case "completed":
				if (todo.classList.contains("completed")) {
					todo.style.display = "flex";
				} else {
					todo.style.display = "none";
				}
				break;
			case "uncompleted":
				if (!todo.classList.contains("completed")) {
					todo.style.display = "flex";
				} else {
					todo.style.display = "none";
				}
				break;
		}
	});
}

function saveLocalTodos(todo: string): void {
	let todos: unknown;
	if (localStorage.getItem("todos") === null) {
		(todos as []) = [];
	} else {
		(todos as string[]) = JSON.parse(localStorage.getItem("todos")!);
	}
	(todos as string[]).push(todo);
	localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos(): void {
	let todos: unknown;
	if (localStorage.getItem("todos") === null) {
		(todos as []) = [];
	} else {
		(todos as string[]) = JSON.parse(localStorage.getItem("todos")!);
	}
	(todos as string[]).forEach(function (todo) {
		const todoDiv: HTMLDivElement = document.createElement("div");
		todoDiv.classList.add("todo");
		const newTodo: HTMLLIElement = document.createElement("li");
		newTodo.innerText = todo;
		newTodo.classList.add("todo-item");
		todoDiv.append(newTodo);
		const completedButton: HTMLButtonElement = document.createElement("button");
		completedButton.innerHTML = `<i class="fas fa-check"></i>`;
		completedButton.classList.add("complete-btn");
		todoDiv.append(completedButton);
		const trashButton: HTMLButtonElement = document.createElement("button");
		trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
		trashButton.classList.add("trash-btn");
		todoDiv.append(trashButton);
		todoList!.append(todoDiv);
	});
}

function removeLocalTodos(todo: HTMLDivElement) {
    let todos: unknown;
	if (localStorage.getItem("todos") === null) {
		(todos as []) = [];
	} else {
		(todos as string[]) = JSON.parse(localStorage.getItem("todos")!);
	}
    const todoIndex: string = (todo.children[0] as HTMLElement).innerText;
    (todos as string[]).splice((todos as string[]).indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}