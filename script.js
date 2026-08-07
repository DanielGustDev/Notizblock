// @ts-nocheck

let notesData = [];
let trashData = [];

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

  if (loadedNotesData) {
    notesData = JSON.parse(loadedNotesData);
  } else {
    notesData = [];
  }

  if (loadedTrashData) {
    trashData = JSON.parse(loadedTrashData);
  } else {
    trashData = [];
  }
}

function renderNotes() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";

  renderDropdownOptions();

  for (let groupIndex = 0; groupIndex < notesData.length; groupIndex++) {
    let currentGroup = notesData[groupIndex];
    let itemsHtml = renderGroupItems(
      currentGroup.items,
      groupIndex,
      getNoteItemTemplate,
    );

    contentRef.innerHTML += getNoteGroupTemplate(currentGroup.title, itemsHtml);
  }
}

function renderTrashNotes() {
  let trashContentRef = document.getElementById("trash_content");
  trashContentRef.innerHTML = "";

  for (let groupIndex = 0; groupIndex < trashData.length; groupIndex++) {
    let currentGroup = trashData[groupIndex];
    let itemsHtml = renderGroupItems(
      currentGroup.items,
      groupIndex,
      getTrashItemTemplate,
    );

    trashContentRef.innerHTML += getTrashGroupTemplate(
      currentGroup.title,
      itemsHtml,
    );
  }
}

// Hilfsfunktion: Baut die HTML-Liste für Items auf
function renderGroupItems(items, groupIndex, templateFunction) {
  let itemsHtml = "";
  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    itemsHtml += templateFunction(groupIndex, itemIndex, items[itemIndex]);
  }
  return itemsHtml;
}

// Hilfsfunktion: Befüllt das Dropdown
function renderDropdownOptions() {
  let titleSelectRef = document.getElementById("title_select");
  titleSelectRef.innerHTML = '<option value="">Titel auswählen</option>';

  let uniqueTitles = getUniqueTitles(notesData);
  for (let i = 0; i < uniqueTitles.length; i++) {
    titleSelectRef.innerHTML += getDropdownOptionTemplate(uniqueTitles[i]);
  }
}

// Hilfsfunktion: Filtert doppelte Titel heraus
function getUniqueTitles(dataArray) {
  let titles = [];
  for (let i = 0; i < dataArray.length; i++) {
    let title = dataArray[i].title;
    if (!titles.includes(title)) {
      titles.push(title);
    }
  }
  return titles;
}

// -----------------------------------------------------------------------------
// 3. AKTIONEN & DATENVERARBEITUNG
// -----------------------------------------------------------------------------

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
  let foundGroup = findGroupByTitle(dataArray, title);

  if (foundGroup) {
    foundGroup.items.push(text);
  } else {
    dataArray.push({
      title: title,
      items: [text],
    });
  }
}

function openDialog() {
  let dialog = document.getElementById("trash_can");

  dialog.showModal();
}

function closeDialog() {
  let dialog = document.getElementById("trash_can");
  if (dialog instanceof HTMLDialogElement) {
    dialog.close();
  }
}

function stopBubbling(event) {
  event.stopPropagation();
}

// Hilfsfunktion: Sucht nach einer vorhandenen Notizgruppe
function findGroupByTitle(dataArray, title) {
  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i].title === title) {
      return dataArray[i];
    }
  }
  return null;
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

function moveToNotes(groupIndex, itemIndex) {
  let titleToMove = trashData[groupIndex].title;
  let itemToMove = trashData[groupIndex].items.splice(itemIndex, 1)[0];

  if (trashData[groupIndex].items.length === 0) {
    trashData.splice(groupIndex, 1);
  }

  insertNoteIntoData(notesData, titleToMove, itemToMove);

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
