const store = {
  bookmarks: [],
  adding: false,
  error: null,
  filter: 0
};
function toggleExpanded(id) {
  const currentItem = this.findById(id);
  currentItem.expanded = !currentItem.expanded;
};
function findById(id) {
  return this.bookmarks.find(currentItem => currentItem.id === id);
};
function addBookmark(item) {
  const expandedKey = {expanded: false};
  Object.assign(expandedKey, item);
  this.bookmarks.push(expandedKey);
};
function findAndDelete(id) {
  this.bookmarks = store.bookmarks.filter(currentItem => currentItem.id !== id);
};
function setError(error) {
  this.error = error;
};
export default {
  bookmarks: store.bookmarks,
  adding: store.adding,
  filter: store.filter,
  error: store.error,
  addBookmark,
  toggleExpanded,
  findById,
  setError,
  findAndDelete,
};