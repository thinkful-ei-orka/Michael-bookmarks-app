import store from './store.js';
import api from './api.js';

function toggleStoreAdding() {
  store.adding = !store.adding;
};
function clearBookmarkForm () {
  $('.addField').val('');
};
//Event Handlers--------------------------------------------------------
function handleFilterSelector() {
  $('.button-area').change( function() {
    const filter = $('option:selected').val();
    store.filter = filter;
    render();
  });
};
function handleAddBookmarkButton() {
  $('.button-area').on('click','.addBookmark', event => {
    toggleStoreAdding();
    $('.button-area').empty();
    render();
  });
};
function handleCancelButton() {
  $('main').on('click','.cancel-button', event => {
    clearBookmarkForm();
    toggleStoreAdding();
    render();
  });
};
function handleNewItemSubmit () {
  $('main').submit('#bookmark-form', function (event) {
    event.preventDefault();
    function serializeJson(form) {
      const formData = new FormData(form);
      const o = {};
      formData.forEach((val, name) => o[name] = val);
      return JSON.stringify(o);
    };
    const newItem = serializeJson($('#bookmark-form')[0]);
    api.createItem(newItem)
      .then(item => {
        store.addBookmark(item);
        clearBookmarkForm();
        toggleStoreAdding();
        render();
      })
      .catch(error => {
        store.setError(error.message);
        renderError();
      });
  });
};
function handleCloseError() {
  $('.error-container').on('click','.error-message', () => {
    store.setError(null);
    renderError();
  });
};
function handleBookmarkClick() {
  $('main').on('click','.unexpandedBookmarkButton', event => {
    console.log('unexpandedBookmarkButton clicked');
    store.toggleExpanded(event.currentTarget.id);
    render();
  });
};
function handleDeleteItemClicked () {
  function getItemIdFromDeleteButton(item) {
    return $(item).closest('.delete-button').data('item-id');
  };
  $('main').on('click','.delete-button', event => {
    const id = getItemIdFromDeleteButton(event.currentTarget);
    api.deleteItem(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch(error => {
        store.setError(error.message);
        renderError();
      });
  });
};
//EXPORT----------------------------------------------------------------
function bindEventListeners () {
  handleNewItemSubmit();
  handleAddBookmarkButton();
  handleBookmarkClick();
  handleCancelButton();
  handleDeleteItemClicked();
  handleFilterSelector();
  handleCloseError();
};
function render() {
  //Functions used in render function-----------------------------------
  function generateButtons() {
  return `<div class="buttons">
            <button type="button" class="addBookmark">Add</button>
              <select id="Rating-list">
                <option value = ' '>Minimum Rating</option>
                <option value = '0'>All</option> 
                <option value = '5'>5</option>
                <option value = '4'>4</option>
                <option value = '3'>3</option>
                <option value = '2'>2</option>
                <option value = '1'>1</option> 
              </select>
          </div>`;
  };
  function generateExpandedBookmark(item) {
      return `  <div class = 'bookmarkDiv'>
                  <div class = 'bookmarkDiv'>
                    <div class = 'unexpandedBookmark'>
                      <button class = 'unexpandedBookmarkButton' id = ${item.id}>${item.title}</button>
                      <div class = 'unexpandedBookmarkRating'>Rating: ${item.rating}</div>
                    </div>
                  </div>
                  <div class = 'expandedBookmark'>
                    <ul class = 'expandedBookmarkList'>
                      <li class = 'expandedURL' data-item-id=${item.id}><a href='${item.url}'>Visit ${item.title}</a></li>
                      <li class = 'expandedDescription' data-item-id=${item.id}>${item.desc}</li>
                      <li><button type="button" class="delete-button" data-item-id=${item.id}>Delete</button></li>
                      </ul>
                  </div>
                </div>`;
  };
  function generateBookmark(item) {
  return `  <div class = 'bookmarkDiv'>
              <div class = 'unexpandedBookmark'>
                <button class = 'unexpandedBookmarkButton' id = ${item.id}>${item.title}</button>
                <div class = 'unexpandedBookmarkRating'>Rating: ${item.rating}</div>
              </div>
            </div>`;
  };
  function generateBookmarks(bookmarkList) {
    let html = '';
    bookmarkList.forEach((item) => {
      if (item.expanded) {
        html += generateExpandedBookmark(item);
      }
      else {
        html += generateBookmark(item);
      }
    });
    return html;
  };
  function generateAddForm() {
  return `<div class="form-area">
            <form id="bookmark-form">
              <label for="url">Enter URL:</label><br>
              <input type="text" id ="url" class="addField" placeholder="http://bookmark.com" required><br>
              <label for="title">Enter Title:</label><br>
              <input type="text" id ="title" class="addField" placeholder="Title" required><br>
              <label for="rating">Enter Rating(1-5):</label><br>
              <input type="number" id ="rating" class="addField" min="1" max="5" placeholder="Select Rating" required><br>
              <label for="desc">Enter Description:</label><br>
              <input type="text" id ="desc" class="addField" id="description-input" placeholder="Add a description " required>
              <div class="formButtons">
                <button type="button" class="cancel-button">Cancel</button>
                <button type="submit"class="add-item-button">Create</button>
              </div>
            </form>
          </div>`;
  };
  function filterByRating(bookmarks) {
    let filteredBookmarkArray = bookmarks
    return filteredBookmarkArray;
  };
  // Start of Render function-------------------------------------------
  let bookmarks = [...store.bookmarks];
  let html = '';
  
  if(store.adding) {
    html += generateAddForm();
  }  
  if (store.filter != 0) {
    $('.button-area').html(`${generateButtons()}`);
    html += generateBookmarks(bookmarks.filter(bookmark => bookmark.rating >= store.filter));
  }else {
    $('.button-area').html(`${generateButtons()}`);
    html += generateBookmarks(bookmarks);  
  }
  $('main').html(html);  
};
export default {
  render,
  bindEventListeners,
};