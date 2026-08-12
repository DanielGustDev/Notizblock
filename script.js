/**
 * Globales Array zur Speicherung aller aktiven Notizen.
 * @type {Array<{title: string, items: Array<string>}>}
 */
let notesData = [];

/**
 * Globales Array zur Speicherung aller Notizen im Papierkorb.
 * @type {Array<{title: string, items: Array<string>}>}
 */
let trashData = [];

/**
 * Initialisiert die Anwendung beim Laden der Seite.
 */
function init() {
  loadFromLocalStorage();
  renderNotes();
  renderTrashNotes();
}

/**
 * Speichert den aktuellen Zustand von notesData und trashData im LocalStorage.
 */
function saveToLocalStorage() {
  localStorage.setItem("notesData", JSON.stringify(notesData));
  localStorage.setItem("trashData", JSON.stringify(trashData));
}

/**
 * Lädt die gespeicherten Daten aus dem LocalStorage in die globalen Variablen.
 */
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

/**
 * Rendert die aktiven Notizen und aktualisiert das Titel-Dropdown.
 */
function renderNotes() {
  let contentRef = document.getElementById("content");
  if (!contentRef) return;
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

/**
 * Rendert alle Notizen, die sich im Papierkorb befinden.
 */
function renderTrashNotes() {
  let trashContentRef = document.getElementById("trash_content");
  if (!trashContentRef) return;
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

/**
 * Erstellt die HTML-Zeichenkette für alle Items einer Notizgruppe.
 * @param {Array<string>} items - Liste der Texteinträge.
 * @param {number} groupIndex - Index der Notizgruppe im Datenarray.
 * @param {Function} templateFunction - Funktion zur Generierung des HTML-Templates pro Item.
 * @returns {string} Akkumulierter HTML-String aller Gruppen-Items.
 */
function renderGroupItems(items, groupIndex, templateFunction) {
  let itemsHtml = "";
  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    itemsHtml += templateFunction(groupIndex, itemIndex, items[itemIndex]);
  }
  return itemsHtml;
}

/**
 * Befüllt das Dropdown-Element mit den eindeutigen Notiztiteln.
 */
function renderDropdownOptions() {
  let titleSelectRef = document.getElementById("title_select");
  if (!titleSelectRef) return;
  titleSelectRef.innerHTML = '<option value="">Titel auswählen</option>';

  let uniqueTitles = getUniqueTitles(notesData);
  for (let i = 0; i < uniqueTitles.length; i++) {
    titleSelectRef.innerHTML += getDropdownOptionTemplate(uniqueTitles[i]);
  }
}

/**
 * Filtert doppelte Titel aus einem Notiz-Datenarray heraus.
 * @param {Array<{title: string, items: Array<string>}>} dataArray - Das zu prüfende Notiz-Array.
 * @returns {Array<string>} Array mit eindeutigen Titeln.
 */
function getUniqueTitles(dataArray) {
  /** @type {string[]} */
  let titles = [];
  for (let i = 0; i < dataArray.length; i++) {
    let title = dataArray[i].title;
    if (!titles.includes(title)) {
      titles.push(title);
    }
  }
  return titles;
}

/**
 * Liest die Eingabefelder aus und fügt eine neue Notiz hinzu.
 */
function addNote() {
  let noteTitleInputRef = document.getElementById("note_title_input");
  let titleSelectRef = document.getElementById("title_select");
  let noteInputRef = document.getElementById("note_input");

  if (
    !(noteTitleInputRef instanceof HTMLInputElement) ||
    !(noteInputRef instanceof HTMLInputElement) ||
    !(titleSelectRef instanceof HTMLSelectElement)
  ) {
    return;
  }

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

/**
 * Ermittelt den zu verwendenden Titel basierend auf Texteingabe oder Dropdown-Auswahl.
 * @param {string} inputTitle - Der im Textfeld eingegebene Titel.
 * @param {string} selectTitle - Der im Dropdown ausgewählte Titel.
 * @returns {string} Der ermittelte Titel oder "Ohne Titel" als Fallback.
 */
function getSelectedTitle(inputTitle, selectTitle) {
  if (inputTitle) return inputTitle;
  if (selectTitle) return selectTitle;
  return "Ohne Titel";
}

/**
 * Fügt einen Notiztext in ein Datenarray ein. Erstellt eine neue Gruppe, falls der Titel nicht existiert.
 * @param {Array<{title: string, items: Array<string>}>} dataArray - Ziel-Array (notesData oder trashData).
 * @param {string} title - Titel der Notizgruppe.
 * @param {string} text - Der einzufügende Notiztext.
 */
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

/**
 * Öffnet das Papierkorb-Dialogfenster modal.
 */
function openDialog() {
  let dialog = document.getElementById("trash_can");
  if (dialog instanceof HTMLDialogElement) {
    dialog.showModal();
  }
}

/**
 * Schließt das Papierkorb-Dialogfenster.
 */
function closeDialog() {
  let dialog = document.getElementById("trash_can");
  if (dialog instanceof HTMLDialogElement) {
    dialog.close();
  }
}

/**
 * Stoppt die Weiterleitung von Event-Bubbling.
 * @param {Event} event - Das ausgelöste Event.
 */
function stopBubbling(event) {
  event.stopPropagation();
}

/**
 * Sucht eine Notizgruppe anhand ihres Titels.
 * @param {Array<{title: string, items: Array<string>}>} dataArray
 * @param {string} title
 * @returns {{title: string, items: Array<string>} | null}
 */
function findGroupByTitle(dataArray, title) {
  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i].title === title) {
      return dataArray[i];
    }
  }
  return null;
}

/**
 * Leert die Formular-Eingabefelder.
 * @param {HTMLInputElement} inputTitleRef - Referenz zum Titel-Eingabefeld.
 * @param {HTMLInputElement} inputNoteRef - Referenz zum Notiztext-Eingabefeld.
 * @param {HTMLSelectElement} selectRef - Referenz zum Dropdown-Menü.
 */
function clearInputs(inputTitleRef, inputNoteRef, selectRef) {
  inputTitleRef.value = "";
  inputNoteRef.value = "";
  selectRef.value = "";
}

/**
 * Verschiebt ein Notiz-Item von einem Daten-Array in ein anderes (z. B. Notizen <-> Papierkorb).
 * @param {Array<{title: string, items: Array<string>}>} sourceData - Das Quell-Array.
 * @param {Array<{title: string, items: Array<string>}>} targetData - Das Ziel-Array.
 * @param {number} groupIndex - Index der Notizgruppe im Quell-Array.
 * @param {number} itemIndex - Index des Items innerhalb der Gruppe.
 */
function moveNote(sourceData, targetData, groupIndex, itemIndex) {
  let titleToMove = sourceData[groupIndex].title;
  let itemToMove = sourceData[groupIndex].items.splice(itemIndex, 1)[0];

  if (sourceData[groupIndex].items.length === 0) {
    sourceData.splice(groupIndex, 1);
  }

  insertNoteIntoData(targetData, titleToMove, itemToMove);

  saveToLocalStorage();
  renderNotes();
  renderTrashNotes();
}

/**
 * Löscht ein Notiz-Item dauerhaft aus dem Papierkorb.
 * @param {number} groupIndex - Index der Papierkorbgruppe.
 * @param {number} itemIndex - Index des Items innerhalb der Gruppe.
 */
function deleteNote(groupIndex, itemIndex) {
  trashData[groupIndex].items.splice(itemIndex, 1);

  if (trashData[groupIndex].items.length === 0) {
    trashData.splice(groupIndex, 1);
  }

  saveToLocalStorage();
  renderTrashNotes();
}
