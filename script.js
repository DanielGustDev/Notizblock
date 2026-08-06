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
  let titleSelectRef = document.getElementById("title_select");

  contentRef.innerHTML = "";

  let addedTitles = [];

  for (let groupIndex = 0; groupIndex < notesData.length; groupIndex++) {
    let currentGroup = notesData[groupIndex];

    let titleAlreadyExists = false;
    for (
      let trackingIndex = 0;
      trackingIndex < addedTitles.length;
      trackingIndex++
    ) {
      if (addedTitles[trackingIndex] === currentGroup.title) {
        titleAlreadyExists = true;
        break;
      }
    }

    if (titleAlreadyExists === false) {
      addedTitles.push(currentGroup.title);
      titleSelectRef.innerHTML += getDropdownOptionTemplate(currentGroup.title);
    }

    let itemsHtml = "";
    for (
      let itemIndex = 0;
      itemIndex < currentGroup.items.length;
      itemIndex++
    ) {
      itemsHtml += getNoteItemTemplate(
        groupIndex,
        itemIndex,
        currentGroup.items[itemIndex],
      );
    }

    contentRef.innerHTML += getNoteGroupTemplate(currentGroup.title, itemsHtml);
  }
}

function renderTrashNotes() {
  let trashContentRef = document.getElementById("trash_content");
  trashContentRef.innerHTML = "";

  for (let groupIndex = 0; groupIndex < trashData.length; groupIndex++) {
    let currentGroup = trashData[groupIndex];

    let itemsHtml = "";
    for (
      let itemIndex = 0;
      itemIndex < currentGroup.items.length;
      itemIndex++
    ) {
      itemsHtml += getTrashItemTemplate(
        groupIndex,
        itemIndex,
        currentGroup.items[itemIndex],
      );
    }

    trashContentRef.innerHTML += getTrashGroupTemplate(
      currentGroup.title,
      itemsHtml,
    );
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
  let foundGroup = null;

  for (let groupIndex = 0; groupIndex < dataArray.length; groupIndex++) {
    let currentGroup = dataArray[groupIndex];
    if (currentGroup.title === title) {
      foundGroup = currentGroup;
      break;
    }
  }

  if (foundGroup !== null) {
    foundGroup.items.push(text);
  } else {
    dataArray.push({
      title: title,
      items: [text],
    });
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
