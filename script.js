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
 * Rendert die aktiven Notizen, übergibt den Gruppenindex an das Template
 * und aktualisiert das Titel-Dropdown.
 * @returns {void} Gibt keinen Wert zurück.
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

    contentRef.innerHTML += getNoteGroupTemplate(
      currentGroup.title,
      itemsHtml,
      groupIndex,
    );
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

/**
 * Liest den aktuell ausgewählten Wert aus dem Dropdown-Menü aus
 * und überträgt ihn direkt in das Eingabefeld für den Notiztitel.
 * Wird automatisch durch das onchange-Event des <select>-Elements ausgelöst.
 *
 * @returns {void} Gibt keinen Wert zurück.
 */
function fillTitleInput() {
  let titleSelectRef = document.getElementById("title_select");
  let noteTitleInputRef = document.getElementById("note_title_input");

  if (
    !(titleSelectRef instanceof HTMLSelectElement) ||
    !(noteTitleInputRef instanceof HTMLInputElement)
  ) {
    return;
  }
  noteTitleInputRef.value = titleSelectRef.value;
}

/**
 * Speichert den aktuellen Zustand eines laufenden Drag-and-Drop-Vorgangs.
 * @type {{type: "group" | "item" | null, sourceGroupIndex: number | null, sourceItemIndex: number | null}}
 */
let dragState = {
  type: null, // "group" | "item" | null
  sourceGroupIndex: null,
  sourceItemIndex: null,
};

/**
 * Startet das Verschieben einer gesamten Notizgruppe über den Handle-Button.
 * @param {DragEvent} event - Das ausgelöste Drag-Event.
 * @param {number} groupIndex - Index der gezogenen Notizgruppe in notesData.
 * @returns {void} Gibt keinen Wert zurück.
 */
function startDragNoteGroup(event, groupIndex) {
  event.stopPropagation();
  dragState = {
    type: "group",
    sourceGroupIndex: groupIndex,
    sourceItemIndex: null,
  };

  let groupEl =
    event.currentTarget instanceof Element
      ? event.currentTarget.closest(".note-group")
      : null;
  if (groupEl instanceof HTMLElement && event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `group:${groupIndex}`);
    event.dataTransfer.setDragImage(groupEl, groupEl.offsetWidth - 20, 20);
  }
}

/**
 * Startet das Verschieben eines einzelnen Notiz-Items über den Handle-Button.
 * @param {DragEvent} event - Das ausgelöste Drag-Event.
 * @param {number} groupIndex - Index der Quell-Notizgruppe in notesData.
 * @param {number} itemIndex - Index des gezogenen Items innerhalb der Gruppe.
 * @returns {void} Gibt keinen Wert zurück.
 */
function startDragNoteItem(event, groupIndex, itemIndex) {
  event.stopPropagation();
  dragState = {
    type: "item",
    sourceGroupIndex: groupIndex,
    sourceItemIndex: itemIndex,
  };

  let itemEl =
    event.currentTarget instanceof Element
      ? event.currentTarget.closest(".note-item")
      : null;

  if (itemEl instanceof HTMLElement && event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `item:${groupIndex}:${itemIndex}`);
    event.dataTransfer.setDragImage(itemEl, itemEl.offsetWidth - 20, 15);
  }
}

/**
 * Erlaubt das Ablegen von Elementen auf einem gültigen Drop-Ziel.
 * @param {DragEvent} event - Das ausgelöste Dragover-Event.
 * @returns {void} Gibt keinen Wert zurück.
 */
function allowDrop(event) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
}

/**
 * Verschiebt eine Notizgruppe an die Zielposition innerhalb von notesData
 * und aktualisiert LocalStorage sowie die Ansicht.
 * @param {DragEvent} event - Das ausgelöste Drop-Event.
 * @param {number} targetGroupIndex - Zielindex der Notizgruppe in notesData.
 * @returns {void} Gibt keinen Wert zurück.
 */
function dropNoteGroup(event, targetGroupIndex) {
  event.preventDefault();
  event.stopPropagation();

  if (dragState.type !== "group") return;
  let fromIndex = dragState.sourceGroupIndex;
  resetDragState();

  if (fromIndex === null || fromIndex === targetGroupIndex) return;

  let [movedGroup] = notesData.splice(fromIndex, 1);
  notesData.splice(targetGroupIndex, 0, movedGroup);

  saveToLocalStorage();
  renderNotes();
}

/**
 * Verschiebt ein Notiz-Item an die Zielposition (innerhalb derselben Gruppe
 * oder in eine andere Gruppe) und entfernt ggf. leere Quellgruppen.
 * @param {DragEvent} event - Das ausgelöste Drop-Event.
 * @param {number} targetGroupIndex - Index der Ziel-Notizgruppe in notesData.
 * @param {number} targetItemIndex - Zielindex des Items innerhalb der Zielgruppe.
 * @returns {void} Gibt keinen Wert zurück.
 */
function dropNoteItem(event, targetGroupIndex, targetItemIndex) {
  event.preventDefault();
  event.stopPropagation();

  if (dragState.type !== "item") return;
  let fromGroupIndex = dragState.sourceGroupIndex;
  let fromItemIndex = dragState.sourceItemIndex;
  resetDragState();

  if (
    fromGroupIndex === null ||
    fromItemIndex === null ||
    (fromGroupIndex === targetGroupIndex && fromItemIndex === targetItemIndex)
  ) {
    return;
  }

  let [movedItem] = notesData[fromGroupIndex].items.splice(fromItemIndex, 1);
  notesData[targetGroupIndex].items.splice(targetItemIndex, 0, movedItem);

  if (notesData[fromGroupIndex].items.length === 0) {
    notesData.splice(fromGroupIndex, 1);
  }

  saveToLocalStorage();
  renderNotes();
}

/**
 * Setzt den aktuellen Drag-and-Drop-Zustand auf den Ausgangswert zurück.
 * @returns {void} Gibt keinen Wert zurück.
 */
function resetDragState() {
  dragState = {
    type: null,
    sourceGroupIndex: null,
    sourceItemIndex: null,
  };
}
