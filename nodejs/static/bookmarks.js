const hideEdit = (button, hidden) => {
  // button -> td -> td -> a, input, input
  let a = button.parentElement.nextSibling.childNodes.item(0);
  let nameInput = button.parentElement.nextSibling.childNodes.item(1);
  let urlInput = button.parentElement.nextSibling.childNodes.item(2);

  a.hidden = !hidden;

  if (hidden) {
    nameInput.type = 'hidden';
    urlInput.type = 'hidden';
  } else {
    nameInput.type = 'text';
    urlInput.type = 'url';
  }
}

const hideButton = (button, toHide, toShow) => {
  if (toHide.includes(button.className)) {
    button.hidden = true;
  } else if (toShow.includes(button.className)) {
    button.hidden = false;
  }
}

const hideButtons = (button, toHide, toShow) => {
  hideButton(button, toHide, toShow);

  for (let i = button.nextSibling; i != null; i = i.nextSibling) {
    hideButton(i, toHide, toShow);
  }

  for (let i = button.previousSibling; i != null; i = i.previousSibling) {
    hideButton(i, toHide, toShow);
  }
}

const deleteBookmark = button => {
    fetch('/delete', {
      'headers': {
        'content-type': 'application/x-www-form-urlencoded',
      },
      'body': 'id='+button.value,
      'method': 'DELETE',
    }).then(result => {
      button.hidden = true;
      button.nextSibling.hidden = false;
      button.nextSibling.nextSibling.disabled = true;
    });
  }
  
  const undoDeleteBookmark = button => {
    // button -> td -> td -> a
    let a = button.parentElement.nextSibling.childNodes.item(0);
    let url = encodeURIComponent(a.href);
    let name = encodeURIComponent(a.innerText);
  
    fetch('/add', {
      'headers': {
          'content-type': 'application/x-www-form-urlencoded',
      },
      'body': 'undo=true&name='+name+'&url='+url,
      'method': 'POST',
    }).then(response => {    
      response.json().then(data => {
        console.log(data);
        button.previousSibling.value = data.id;
      });
  
      button.hidden = true;
      button.previousSibling.hidden = false;
      button.nextSibling.disabled = false;
    });
  }

editBookmark = button => {
  hideButtons(button, ['delete', 'edit'], ['save','cancel']);
  hideEdit(button, false);
}

saveEditBookmark = button => {
  hideButtons(button, ['save', 'cancel'], ['delete','edit']);
  hideEdit(button, true);
}

cancelEditBookmark = button => {
  hideButtons(button, ['save', 'cancel'], ['delete','edit']);
  hideEdit(button, true);
}