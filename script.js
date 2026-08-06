// @ts-nocheck

let notesData = [];
let trashData = [];

let trashNotesTitles = [];
let trashNotes = [];

function init() {
  loadFromLocalStorage();
  renderNotes();
  renderTrashNotes();
}

function saveToLocalStorage() {
  localStorage.setItem("notesData", JSON.stringify(notesData));
  localStorage.setItem("trashData", JSON.stringify(trashData));
}

function loadFromLocalStorage() {
  let loadedNotesData = localStorage.getItem("notesData");
  let loadedTrashData = localStorage.getItem("trashData");

  notesData = loadedNotesData ? JSON.parse(loadedNotesData) : [];
  trashData = loadedTrashData ? JSON.parse(loadedTrashData) : [];
}

function getDropdownOptionTemplate(title) {
  return `<option value="${title}">${title}</option>`;
}

function getNoteItemTemplate(groupIndex, itemIndex, text) {
  return `
    <li>
      ${text} 
      <button onclick="moveToTrash(${groupIndex}, ${itemIndex})">X</button>
    </li>`;
}

function getNoteGroupTemplate(title, itemsHTML) {
  return `
    <div class="note-group">
      <h3>${title}</h3>
      <ul>${itemsHTML}</ul>
    </div>`;
}

function getTrashItemTemplate(groupIndex, itemIndex, text) {
  return `
    <li>
      ${text} 
      <button onclick="deleteNote(${groupIndex}, ${itemIndex})">X</button>
    </li>`;
}

function getTrashGroupTemplate(title, itemsHTML) {
  return `
    <div class="trash-group">
      <h3>${title}</h3>
      <ul>${itemsHTML}</ul>
    </div>`;
}

function renderNotes() {
  let contentRef = document.getElementById("content");
  let titleSelectRef = document.getElementById("title_select");

  contentRef.innerHTML = "";

  for (let groupIndex = 0; groupIndex < notesData.length; groupIndex++) {
    let group = notesData[groupIndex];

    titleSelectRef.innerHTML += getDropdownOptionTemplate(group.title);

    let itemsHTML = "";
    for (let itemIndex = 0; itemIndex < group.items.length; itemIndex++) {
      itemsHTML += getNoteItemTemplate(
        groupIndex,
        itemIndex,
        group.items[itemIndex],
      );
    }

    contentRef.innerHTML += getNoteGroupTemplate(group.title, itemsHTML);
  }
}

function renderTrashNotes() {
  let trashContentRef = document.getElementById("trash_content");
  trashContentRef.innerHTML = "";

  for (let groupIndex = 0; groupIndex < trashData.length; groupIndex++) {
    let group = trashData[groupIndex];

    let itemsHTML = "";
    for (let itemIndex = 0; itemIndex < group.items.length; itemIndex++) {
      itemsHTML += getTrashItemTemplate(
        groupIndex,
        itemIndex,
        group.items[itemIndex],
      );
    }

    trashContentRef.innerHTML += getTrashGroupTemplate(group.title, itemsHTML);
  }
}

function addNote() {
  let noteTitleInputRef = document.getElementById("note_title_input");
  let titleSelectRef = document.getElementById("title_select");
  let noteInputRef = document.getElementById("note_input");

  let noteText = noteInputRef.value.trim();
  if (noteText === "") return;

  let title = getSelectedTitle(
    noteTitleInputRef.value.trim(),
    titleSelectRef.value,
  );

  insertNoteIntoData(notesData, title, noteText);

  saveToLocalStorage();
  renderNotes();
  clearInputs(noteTitleInputRef, noteInputRef, titleSelectRef);
}

function getSelectedTitle(inputTitle, selectTitle) {
  if (inputTitle) return inputTitle;
  if (selectTitle) return selectTitle;
  return "Ohne Titel";
}

function insertNoteIntoData(dataArray, title, text) {
  let group = dataArray.find((g) => g.title === title);
  if (group) {
    group.items.push(text);
  } else {
    dataArray.push({ title: title, items: [text] });
  }
}

function clearInputs(inputTitleRef, inputNoteRef, selectRef) {
  inputTitleRef.value = "";
  inputNoteRef.value = "";
  selectRef.value = "";
}

function moveToTrash(groupIndex, itemIndex) {
  let itemToMove = notesData[groupIndex].items.splice(itemIndex, 1)[0];
  let titleToMove = notesData[groupIndex].title;

  if (notesData[groupIndex].items.length === 0) {
    notesData.splice(groupIndex, 1);
  }

  insertNoteIntoData(trashData, titleToMove, itemToMove);

  saveToLocalStorage();
  renderNotes();
  renderTrashNotes();
}

function deleteNote(groupIndex, itemIndex) {
  trashData[groupIndex].items.splice(itemIndex, 1);

  if (trashData[groupIndex].items.length === 0) {
    trashData.splice(groupIndex, 1);
  }

  saveToLocalStorage();
  renderTrashNotes();
}
