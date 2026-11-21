/**
 * Erzeugt das HTML-Template für eine Option im Dropdown-Menü.
 * @param {string} title - Der Titel der Option.
 * @returns {string} HTML-String des <option>-Elements.
 */
function getDropdownOptionTemplate(title) {
  return `<option value="${title}">${title}</option>`;
}

/**
 * Erzeugt das HTML-Template für ein einzelnes Notiz-Item inklusive
 * Lösch-Button und Griff-Button (Drag Handle) am rechten Rand.
 * @param {number} groupIndex - Index der Notizgruppe im Datenarray.
 * @param {number} itemIndex - Index des Items innerhalb der Gruppe.
 * @param {string} text - Der Textinhalt der Notiz.
 * @returns {string} HTML-String des <li>-Elements.
 */
function getNoteItemTemplate(groupIndex, itemIndex, text) {
  return `
    <li class="note-item" data-group-index="${groupIndex}" data-item-index="${itemIndex}" ondragover="allowDrop(event)" ondrop="dropNoteItem(event, ${groupIndex}, ${itemIndex})">
      <span class="note-text">${text}</span>
      <button type="button" onclick="moveNote(notesData, trashData, ${groupIndex}, ${itemIndex})">
        <img src="./assets/icons/trash-button.svg" alt="trash can icon">
      </button>
      <button type="button" class="drag-handle note-drag-handle" draggable="true" title="Notiz verschieben" ondragstart="startDragNoteItem(event, ${groupIndex}, ${itemIndex})">
        <img src="./assets/icons/grab-icon.svg" alt="trash can icon">
      </button>
    </li>`;
}

/**
 * Erzeugt das HTML-Template für eine Notizgruppe inklusive Griff-Button
 * zum Verschieben der gesamten Gruppe.
 * @param {string} title - Titel der Gruppe.
 * @param {string} itemsHTML - Generierter HTML-String aller enthaltenen Notiz-Items.
 * @param {number} groupIndex - Index der Notizgruppe im Datenarray.
 * @returns {string} HTML-String des Notizgruppen-Containers.
 */
function getNoteGroupTemplate(title, itemsHTML, groupIndex) {
  return `
    <div class="note-group" data-group-index="${groupIndex}" ondragover="allowDrop(event)" ondrop="dropNoteGroup(event, ${groupIndex})">
      <div class="note-group-header">
        <h3>${title}:</h3>
        <button type="button" class="drag-handle group-drag-handle" draggable="true" title="Gruppe verschieben" ondragstart="startDragNoteGroup(event, ${groupIndex})">
          <img src="./assets/icons/grab-icon.svg" alt="trash can icon">
        </button>
      </div>
      <ul>${itemsHTML}</ul>
    </div>`;
}

/**
 * Erzeugt das HTML-Template für ein einzelnes Item im Papierkorb.
 * @param {number} groupIndex - Index der Papierkorbgruppe im Datenarray.
 * @param {number} itemIndex - Index des Items innerhalb der Gruppe.
 * @param {string} text - Der Textinhalt der Notiz.
 * @returns {string} HTML-String des <li>-Elements mit Lösch- und Wiederherstellen-Button.
 */
function getTrashItemTemplate(groupIndex, itemIndex, text) {
  return `
    <li>
      ${text} 
      <button onclick="deleteNote(${groupIndex}, ${itemIndex})">
        <img src="./assets/icons/trash-button.svg" alt="trash can icon">
      </button>
      <button onclick="moveNote(trashData, notesData, ${groupIndex}, ${itemIndex})">
        <img src="./assets/icons/note-button.svg" alt="notebook icon">
      </button>
    </li>`;
}

/**
 * Erzeugt das HTML-Template für eine Papierkorbgruppe.
 * @param {string} title - Titel der Gruppe.
 * @param {string} itemsHTML - Generierter HTML-String aller enthaltenen Papierkorb-Items.
 * @returns {string} HTML-String des Papierkorbgruppen-Containers.
 */
function getTrashGroupTemplate(title, itemsHTML) {
  return `
    <div class="trash-group">
      <h3>${title}:</h3>
      <ul>${itemsHTML}</ul>
    </div>`;
}
