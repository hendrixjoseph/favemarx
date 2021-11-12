const getLinkTag = button => {
  // button -> td -> td -> a
  return button.parentElement.nextSibling.childNodes.item(0);
}

const getNameInput = button => {
  // button -> td -> td -> input
  return button.parentElement.nextSibling.childNodes.item(1);
}

const getUrlInput = button => {
  // button -> td -> td -> input
  return button.parentElement.nextSibling.childNodes.item(2);
}

const hideEdit = (button, hidden) => {
  let a = getLinkTag(button);
  let nameInput = getNameInput(button);
  let urlInput = getUrlInput(button);

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
  if (toHide.includes(button.title)) {
    button.hidden = true;
  } else if (toShow.includes(button.title)) {
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

const getOriginalData = button => {
  // button -> td -> td -> a
  let a = getLinkTag(button);

  return {name: a.innerText, url: a.href};
}

const updateDate = button => {
  button.parentElement.nextSibling.nextSibling.textContent = new Date().toLocaleDateString();
}

const getInputFields = button => {
  let nameInput = getNameInput(button);
  let urlInput = getUrlInput(button);

  return {nameInput: nameInput, urlInput: urlInput};
}

const deleteBookmark = button => {
  fetch('/delete', {
    'headers': {
      'content-type': 'application/x-www-form-urlencoded',
    },
    'body': 'id=' + button.parentElement.getAttribute('value'),
    'method': 'DELETE'
  }).then(result => {
    button.hidden = true;
    button.nextSibling.hidden = false;
    button.nextSibling.nextSibling.disabled = true;
  });
}

const undoDeleteBookmark = button => {
  let data = getOriginalData(button);
  let url = encodeURIComponent(data.url);
  let name = encodeURIComponent(data.name);

  fetch('/add', {
    'headers': {
      'content-type': 'application/x-www-form-urlencoded',
    },
    'body': 'undo=true&name='+name+'&url='+url,
    'method': 'POST',
  }).then(response => {
    response.json().then(data => {
      button.parentElement.setAttribute('value',data.id);
    });

    button.hidden = true;
    button.previousSibling.hidden = false;
    button.nextSibling.disabled = false;

    updateDate(button);
  });
}

const editBookmark = button => {
  hideButtons(button, ['delete', 'edit'], ['save','cancel']);
  hideEdit(button, false);
}

const saveEditBookmark = button => {
  let inputs = getInputFields(button);

  let id = button.parentElement.getAttribute('value');
  let url = encodeURIComponent(inputs.urlInput.value);
  let name = encodeURIComponent(inputs.nameInput.value);

  fetch('/update', {
    'headers': {
      'content-type': 'application/x-www-form-urlencoded',
    },
    'body': 'id='+id+'&name='+name+'&url='+url,
    'method': 'POST',
  }).then(response => {
    updateDate(button);

    let a = getLinkTag(button);

    a.href = inputs.urlInput.value;
    a.innerText = inputs.nameInput.value;

    hideButtons(button, ['save', 'cancel'], ['delete','edit']);
    hideEdit(button, true);
  });
}

const cancelEditBookmark = button => {
  let data = getOriginalData(button);
  let inputs = getInputFields(button);

  inputs.nameInput.value = data.name;
  inputs.urlInput.value = data.url;

  hideButtons(button, ['save', 'cancel'], ['delete','edit']);
  hideEdit(button, true);
}
