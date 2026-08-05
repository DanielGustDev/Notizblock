// @ts-nocheck

let notes = ["dog", "cat", "designs"];

function renderNotes() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  for (let indexNote = 0; indexNote < notes.length; indexNote++) {
    contentRef.innerHTML += getNoteTemplate(indexNote);
  }
}

function getNoteTemplate(indexNote) {
  return `<p>+ ${notes[indexNote]} <button onclick="deleteNote(${indexNote})">X</button></p>`;
}

function addNote() {
  let noteInputRef = document.getElementById("note_input");
  let noteInput = noteInputRef.value;
  notes.push(noteInput);
  renderNotes();
  noteInputRef.value = "";
}

function deleteNote(indexNote) {
  notes.splice(indexNote, 1);
  renderNotes();
}

// Notizen archivieren
