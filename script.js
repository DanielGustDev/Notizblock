// @ts-nocheck

let notes = ["dog", "cat", "designs"];

function renderNotes() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  for (let indexNote = 0; indexNote < notes.length; indexNote++) {
    const note = notes[indexNote];
    contentRef.innerHTML += getNoteTemplate(note);
  }
}

function getNoteTemplate(note) {
  return `<p>+ ${note}</p>`;
}

// Notizen hinzufügen
// Notizen löschen
// Notizen archivieren
