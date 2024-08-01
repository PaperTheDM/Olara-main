const sortableList = document.getElementById('sortableList');
const listItems = Array.from(sortableList.getElementsByTagName('li'));

// Sort the list alphabetically based on the text content
listItems.sort((a, b) => {
  const textA = a.textContent.trim();
  const textB = b.textContent.trim();
  return textA.localeCompare(textB);
});

// Reorder the list based on the sorted items
listItems.forEach(item => {
  sortableList.appendChild(item);
});
