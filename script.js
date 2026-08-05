// @ts-nocheck

let notesTitles = ["Einkauf", "Aufgabe"];
let notes = ["dog", "cat", "designs"];

let trashNotesTitles = [];
let trashNotes = [];

function renderNotes() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  for (let indexNote = 0; indexNote < notes.length; indexNote++) {
    contentRef.innerHTML += getNoteTemplate(indexNote);
  }
}

function renderTrashNotes() {
  let trashcontentRef = document.getElementById("trash_content");
  trashcontentRef.innerHTML = "";
  for (
    let indexTrashNote = 0;
    indexTrashNote < trashNotes.length;
    indexTrashNote++
  ) {
    trashcontentRef.innerHTML += getTrashNoteTemplate(indexTrashNote);
  }
}

function getNoteTemplate(indexNote) {
  return `<p>+ title: ${notesTitles[indexNote]} -> ${notes[indexNote]} <button onclick="moveToTrash(${indexNote})">X</button></p>`;
}

function getTrashNoteTemplate(indexTrashNote) {
  return `<p>+ ${trashNotesTitles[indexTrashNote]} -> ${trashNotes[indexTrashNote]} <button onclick="deleteNote(${indexTrashNote})">X</button></p>`;
}

function addNote() {
  let noteTitleInputRef = document.getElementById("note_title_input");
  let noteInputRef = document.getElementById("note_input");

  notesTitles.push(noteTitleInputRef ? noteTitleInputRef.value : "Ohne Titel");
  notes.push(noteInputRef.value);
  renderNotes();
  noteInputRef.value = "";
}

function moveToTrash(indexNote) {
  let trashNote = notes.splice(indexNote, 1);
  trashNotes.push(trashNote[0]);
  let trashNoteTitle = notesTitles.splice(indexNote, 1);
  trashNotesTitles.push(trashNoteTitle[0]);
  renderNotes();
  renderTrashNotes();
}

function deleteNote(indexTrashNote) {
  trashNotes.splice(indexTrashNote, 1);
  trashNotesTitles.splice(indexTrashNote, 1);

  renderTrashNotes();
}

// Notizen archivieren
