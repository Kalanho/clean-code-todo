'use strict';

const NEW_TASK_INPUT_ID = 'new-task';
const TODO_LIST_ID = 'incompleteTasks';
const COMPLETED_LIST_ID = 'completed-tasks';
const EDIT_MODE_CLASS = 'editMode';
const EDIT_BUTTON_TEXT = { EDIT: 'Edit', SAVE: 'Save' };
const DELETE_ICON_SRC = './remove.svg';

const taskInput = document.getElementById(NEW_TASK_INPUT_ID);
const addButton = document.querySelector('button');
const todoList = document.getElementById(TODO_LIST_ID);
const completedList = document.getElementById(COMPLETED_LIST_ID);

function createCheckbox() {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  return checkbox;
}

function createLabel(text) {
  const label = document.createElement('label');
  label.className = 'task';
  label.innerText = text;
  return label;
}

function createEditInput() {
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'task';
  return editInput;
}

function createEditButton() {
  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'edit';
  editButton.innerText = EDIT_BUTTON_TEXT.EDIT;
  return editButton;
}

function createDeleteButton() {
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete';
  const icon = document.createElement('img');
  icon.src = DELETE_ICON_SRC;
  icon.alt = 'Delete';
  deleteButton.appendChild(icon);
  return deleteButton;
}

function createTaskItem(taskText) {
  const taskItem = document.createElement('li');
  taskItem.appendChild(createCheckbox());
  taskItem.appendChild(createLabel(taskText));
  taskItem.appendChild(createEditInput());
  taskItem.appendChild(createEditButton());
  taskItem.appendChild(createDeleteButton());
  return taskItem;
}

function getTaskItemFromEvent(event) {
  return event.target.closest('li');
}

function enterEditMode(taskItem) {
  const editInput = taskItem.querySelector('input[type=text]');
  const label = taskItem.querySelector('label');
  const editButton = taskItem.querySelector('.edit');
  editInput.value = label.innerText;
  editButton.innerText = EDIT_BUTTON_TEXT.SAVE;
  taskItem.classList.add(EDIT_MODE_CLASS);
}

function exitEditMode(taskItem) {
  const editInput = taskItem.querySelector('input[type=text]');
  const label = taskItem.querySelector('label');
  const editButton = taskItem.querySelector('.edit');
  label.innerText = editInput.value;
  editButton.innerText = EDIT_BUTTON_TEXT.EDIT;
  taskItem.classList.remove(EDIT_MODE_CLASS);
}

function editTask(event) {
  const taskItem = getTaskItemFromEvent(event);
  if (taskItem.classList.contains(EDIT_MODE_CLASS)) {
    exitEditMode(taskItem);
  } else {
    enterEditMode(taskItem);
  }
}

function deleteTask(event) {
  const taskItem = getTaskItemFromEvent(event);
  taskItem.remove();
}

function moveTaskTo(taskItem, targetList, nextHandler) {
  targetList.appendChild(taskItem);
  bindTaskItemEvents(taskItem, nextHandler);
}

function taskCompleted(event) {
  const taskItem = getTaskItemFromEvent(event);
  moveTaskTo(taskItem, completedList, taskIncomplete);
}

function taskIncomplete(event) {
  const taskItem = getTaskItemFromEvent(event);
  moveTaskTo(taskItem, todoList, taskCompleted);
}

function bindTaskItemEvents(taskItem, onToggleStatus) {
  taskItem.querySelector('input[type=checkbox]').onchange = onToggleStatus;
  taskItem.querySelector('button.edit').addEventListener('click', editTask);
  taskItem.querySelector('button.delete').addEventListener('click', deleteTask);
}

function bindAllTaskItems(list, onToggleStatus) {
  Array.from(list.children).forEach((taskItem) => bindTaskItemEvents(taskItem, onToggleStatus));
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) {
    return;
  }
  const taskItem = createTaskItem(taskText);
  todoList.appendChild(taskItem);
  bindTaskItemEvents(taskItem, taskCompleted);
  taskInput.value = '';
}

addButton.addEventListener('click', addTask);

bindAllTaskItems(todoList, taskCompleted);
bindAllTaskItems(completedList, taskIncomplete);