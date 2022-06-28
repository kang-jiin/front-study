document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('check-all-label').addEventListener('click', onClickCheckAll);
    document.getElementById('todo-input').addEventListener('keyup', function (event) {
        if (event.key === "Enter") {
            onAddSubmit(event);
        }
    });
    document.getElementById('todo-input').addEventListener('focusout', onAddSubmit);
    document.querySelectorAll(".filter").forEach(function (element) {
        element.addEventListener('click', onClickFilter);
    });
    document.getElementById('clear-completed').addEventListener('click', onClearCompleted);

    render();
});

function render() {
    renderCheckAll();
    renderItems();
    renderFooter();
}

function renderCheckAll() {
    var checkAllElement = document.getElementById('check-all');
    if (Items.isCheckAll()) {
        checkAllElement.setAttribute('checked', true);
    } else {
        checkAllElement.setAttribute('checked', false);
    }
}

function renderItems() {
    var listElement = document.getElementById('item-list');
    listElement.innerHTML = null;

    Items.getViewItems().forEach(function (item) {
        var newItemElement = document.createElement('li');
        newItemElement.setAttribute('data-id', item.id);
        newItemElement.classList.add('item-group');
        listElement.appendChild(newItemElement);

        var newTextInputElement = document.createElement('input');
        newTextInputElement.setAttribute('id', "text-" + item.id);
        newTextInputElement.value = item.content;
        newTextInputElement.classList.add('item-update-input');
        newTextInputElement.hidden = true;
        newTextInputElement.addEventListener('keyup', function (event) {
            if (event.key === "Enter") {
                onUpdateSubmit(event);
            }
        });
        newTextInputElement.addEventListener('focusout', onUpdateSubmit);
        newItemElement.appendChild(newTextInputElement);

        var newViewerElement = document.createElement('div');
        newViewerElement.classList.add('item-viewer');
        newItemElement.appendChild(newViewerElement);

        var newCheckInputElement = document.createElement('input');
        newCheckInputElement.setAttribute('id', "check-" + item.id);
        newCheckInputElement.setAttribute('type', 'checkbox');
        newCheckInputElement.classList.add('item-check');
        newViewerElement.appendChild(newCheckInputElement);

        var newCheckLabelElement = document.createElement('label');
        newCheckLabelElement.setAttribute('for', "check-" + item.id);
        newCheckLabelElement.classList.add('item-check-label');
        newCheckLabelElement.addEventListener('click', onClickCheckbox);
        newViewerElement.appendChild(newCheckLabelElement);

        var newContentElement = document.createElement('p');
        newContentElement.setAttribute('id', "content-" + item.id);
        newContentElement.classList.add('item-text');
        newContentElement.append(item.content);
        newContentElement.addEventListener('dblclick', onDoubleClickInput);
        newViewerElement.appendChild(newContentElement);

        var newButtonElement = document.createElement('button');
        newButtonElement.setAttribute('id', "button-" + item.id);
        newButtonElement.classList.add('item-delete-btn');
        newButtonElement.append("X");
        newButtonElement.addEventListener('click', onClickDeleteBtn);
        newViewerElement.appendChild(newButtonElement);

        if (item.isCompleted) {
            newViewerElement.classList.add('completed');
        }
        if (item.isUpdating) {
            newViewerElement.classList.add("d-none");
            newTextInputElement.hidden = false;
            newTextInputElement.focus();
        }
    });
}

function renderFooter() {
    var countElement = document.getElementById('todo-count');
    countElement.textContent = Items.getActiveCount() + (Items.getActiveCount() === 1 ? " item" : " items") + " left";

    if (Items.getCompletedCount() > 0) {
        document.getElementById('clear-completed-btn').hidden = false;
    } else {
        document.getElementById('clear-completed-btn').hidden = true;
    }
}

function onClickCheckAll() {
    Items.toggleCompletedAll();
    render();
}

function onAddSubmit(event) {
    var content = event.target.value
        .trim()
        .replace(/\s+/g, ' ');

    if (content.length > 0) {
        Items.addItem(content);
        event.target.value = "";

        render();
    }
}

function onClickCheckbox(event) {
    var itemId = event.target.parentElement.parentElement.dataset.id;
    Items.toggleCompleted(itemId);
    render();
}

function onDoubleClickInput(event) {
    var itemId = event.target.parentElement.parentElement.dataset.id;
    Items.setUpdating(itemId);
    render();
}

function onUpdateSubmit(event) {
    var itemId = event.target.parentElement.dataset.id;
    var content = event.target.value
        .trim()
        .replace(/\s+/g, ' ');

    if (content.length > 0) {
        Items.updateItem(itemId, content);
    } else {
        Items.deleteItem(itemId);
    }

    render();
}

function onClickDeleteBtn(event) {
    var itemId = event.target.parentElement.parentElement.dataset.id;
    Items.deleteItem(itemId);
    render();
}

function onClickFilter(event) {
    document.querySelectorAll(".filter").forEach(function (element) {
        element.classList.remove("selected");
    });

    var mode = event.target.dataset.mode;
    Items.setMode(mode);

    render();
    event.target.classList.add("selected");
}

function onClearCompleted() {
    Items.deleteCompletedAll();
    render();
}