import api from './api.js';
import store from './store.js';
import bookmarkList from './bookmark-list.js';

function main() {
  api.getItems()
    .then(res => res.json())
    .then((items) => {
      items.forEach((item) => store.addBookmark(item));
      bookmarkList.render();
    });
  bookmarkList.bindEventListeners();
  bookmarkList.render();
};
$(main);