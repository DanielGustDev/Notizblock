/**
 * Erzeugt das HTML-Template für eine Option im Dropdown-Menü.
 * @param {string} title - Der Titel der Option.
 * @returns {string} HTML-String des <option>-Elements.
 */
function getDropdownOptionTemplate(title) {
  return `<option value="${title}">${title}</option>`;
}

/**
 * Erzeugt das HTML-Template für ein einzelnes Notiz-Item.
 * @param {number} groupIndex - Index der Notizgruppe im Datenarray.
 * @param {number} itemIndex - Index des Items innerhalb der Gruppe.
 * @param {string} text - Der Textinhalt der Notiz.
 * @returns {string} HTML-String des <li>-Elements mit Lösch-Button.
 */
function getNoteItemTemplate(groupIndex, itemIndex, text) {
  return `
    <li>
      ${text} 
      <button onclick="moveNote(notesData, trashData, ${groupIndex}, ${itemIndex})">
        <img src="./assets/icons/trash-bin-icon.svg" alt="trash can icon">
      </button>
    </li>`;
}

/**
 * Erzeugt das HTML-Template für eine Notizgruppe.
 * @param {string} title - Titel der Gruppe.
 * @param {string} itemsHTML - Generierter HTML-String aller enthaltenen Notiz-Items.
 * @returns {string} HTML-String des Notizgruppen-Containers.
 */
function getNoteGroupTemplate(title, itemsHTML) {
  return `
    <div class="note-group">
      <h3>${title} :</h3>
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
        <img src="./assets/icons/trash-bin-icon.svg" alt="trash can icon">
      </button>
      <button onclick="moveNote(trashData, notesData, ${groupIndex}, ${itemIndex})">
        <img src="./assets/icons/notebutton-icon.svg" alt="notebook icon">
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
      <h3>${title} :</h3>
      <ul>${itemsHTML}</ul>
    </div>`;
}
