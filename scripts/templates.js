// @ts-nocheck

function getDropdownOptionTemplate(title) {
  return `<option value="${title}">${title}</option>`;
}

function getNoteItemTemplate(groupIndex, itemIndex, text) {
  return `
    <li>
      ${text} 
      <button onclick="moveToTrash(${groupIndex}, ${itemIndex})">X</button>
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
      <button onclick="deleteNote(${groupIndex}, ${itemIndex})">X</button>
    </li>`;
}

function getTrashGroupTemplate(title, itemsHTML) {
  return `
    <div class="trash-group">
      <h3>${title} :</h3>
      <ul>${itemsHTML}</ul>
    </div>`;
}
