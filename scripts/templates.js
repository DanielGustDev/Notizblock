// @ts-nocheck

function getDropdownOptionTemplate(title) {
  return `<option value="${title}">${title}</option>`;
}

function getNoteItemTemplate(groupIndex, itemIndex, text) {
  return `
    <li>
      ${text} 
      <button onclick="moveToTrash(${groupIndex}, ${itemIndex})"><img src="./assets/icons/trash-bin-icon.svg" alt="trash can icon"></button>
    </li>`;
}

function getNoteGroupTemplate(title, itemsHTML) {
  return `
    <div class="note-group">
      <h3>${title} :</h3>
      <ul>${itemsHTML}</ul>
    </div>`;
}

function getTrashItemTemplate(groupIndex, itemIndex, text) {
  return `
    <li>
      ${text} 
      <button onclick="deleteNote(${groupIndex}, ${itemIndex})"><img src="./assets/icons/trash-bin-icon.svg" alt="trash can icon"></button>
      <button onclick="moveToNotes(${groupIndex}, ${itemIndex})"><img src="./assets/icons/notebutton-icon.svg" alt="notebook icon"></button>
    </li>`;
}

function getTrashGroupTemplate(title, itemsHTML) {
  return `
    <div class="trash-group">
      <h3>${title} :</h3>
      <ul>${itemsHTML}</ul>
    </div>`;
}
