function initialize() {
	document.querySelector('.send').addEventListener('change', onSendChanged);
	attachEventHandler('table .edit', 'blur', onUpdatePressed);
	attachEventHandler('table .edit', 'keypress', onUpdateKeyPressed);
	attachEventHandler('.destroy', 'click', onButtonDestroyClicked);
	updateContactList();
}

function onSendChanged() {
	var contactName = document.querySelector('.send').value;

	if (contactName.trim() === '') {
		return;
	}

	var contact = {
		n: contactName.trim()
	};
	cozysdk.create('Contact', contact, function (err, res) {
		if (err != null) {
			return alert(err);
		} else {
			document.querySelector('.send').value = '';
			updateContactList();
		}
	});
}

function onUpdatePressed(event) {
	var contact = {
		n: event.target.value.trim()
	};

	cozysdk.updateAttributes('Contact', getIDFromElement(event.target), contact, function (err, res) {
		if (err) {
			return alert(err);
		} else {
			updateContactList();
		}
	});
}

function onUpdateKeyPressed(event) {
	if (event.keyCode === 13) {
		event.target.blur();
	}
}

function onButtonDestroyClicked(event) {
	cozysdk.destroy('Contact', getIDFromElement(event.target), function (err, res) {
		if (err) {
			return alert(err);
		} else {
			updateContactList();
		}
	});
}

function attachEventHandler(klass, action, listener) {
	var useCapture = action === 'blur';
	document.querySelector('.contact-list').addEventListener(action, function (event) {
		if (event.target.matches(klass)) {
			listener.call(event.target, event);
		}
	}, !!useCapture);
}

function getIDFromElement(element) {
	if (element.parentNode.dataset.id) {
		return element.parentNode.dataset.id;
	}
	return getIDFromElement(element.parentNode);
}

function updateContactList() {
	cozysdk.defineRequest('Contact', 'all', 'function(doc) { emit(doc.n); }', function (err, res) {
		if (err != null) {
			return alert(err);
		} else {
			cozysdk.run('Contact', 'all', {}, function (err, res) {
				if (err != null) {
					return alert(err);
				} else {
					var contacts = JSON.parse('' + res);
					contacts.forEach(function (contactName) {
						contactName.key = contactName.key.replace(/ /g, '\u00a0');
					});
					render(contacts);
				}
			});
		}
	});
}

function render(contacts) {
	var i;
	var HTML = '';
	for (i = 0; i < contacts.length; i++) {
		var template = '<tr data-id="' + contacts[i].id + '">' +
		'<td><input value="' + contacts[i].key + '"" class="edit"></td>' +
		'<td><input type="button" class="update" value="Update"></td>' +
		'<td><input type="button" class="destroy" value="Destroy"></td>' +
		'</tr>';
		HTML = HTML + template;
	}
	document.querySelector('.contact-list').innerHTML = HTML;
}

document.addEventListener('DOMContentLoaded', initialize);
