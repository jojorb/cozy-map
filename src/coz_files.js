function initialize() {
	document.querySelector('.send').addEventListener('change', onSendChanged);
	attachEventHandler('table .edit', 'blur', onUpdatePressed);
	attachEventHandler('table .edit', 'keypress', onUpdateKeyPressed);
	attachEventHandler('.destroy', 'click', onButtonDestroyClicked);
	updateFileList();
}


function onSendChanged() {
	var fileName = document.querySelector('.send').value;

	if (fileName.trim() === '') {
		return;
	}

	var file = {
		n: fileName.trim()
	};
	cozysdk.create('File', file, function (err, res) {
		if (err !== null) {
			return alert(err);
		} else {
			document.querySelector('.send').value = '';
			updateFileList();
		}
	});
}

function onUpdatePressed(event) {
	var file = {
		n: event.target.value.trim()
	};

	cozysdk.updateAttributes('File', getIDFromElement(event.target), file, function (err, res) {
		if (err) {
			return alert(err);
		} else {
			updateFileList();
		}
	});
}

function onUpdateKeyPressed(event) {
	if (event.keyCode === 13) {
		event.target.blur();
	}
}

function onButtonDestroyClicked(event) {
	cozysdk.destroy('File', getIDFromElement(event.target), function (err, res) {
		if (err) {
			return alert(err);
		} else {
			updateFileList();
		}
	});
}

function attachEventHandler(klass, action, listener) {
	var useCapture = action === 'blur';
	document.querySelector('.file-list').addEventListener(action, function (event) {
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

function updateFileList() {
	cozysdk.defineRequest('File', 'all', 'function(doc) { emit(doc.n); }', function (err, res) {
		if (err !== null) {
			return alert(err);
		} else {
			cozysdk.run('File', 'all', {}, function (err, res) {
				if (err !== null) {
					return alert(err);
				} else {
					var files = JSON.parse('' + res);
					files.forEach(function (fileName) {
						fileName.key = fileName.key.replace(/ /g, '\u00a0');
					});
					render(files);
				}
			});
		}
	});
}

function render(files) {
	var i;
	var HTML = '';
	for (i = 0; i < files.length; i++) {
		var template = '<tr data-id="' + files[i].id + '">' +
		'<td><input value="' + files[i].key + '"" class="edit"></td>' +
		'<td><input type="button" class="update" value="Update"></td>' +
		'<td><input type="button" class="destroy" value="Destroy"></td>' +
		'</tr>';
		HTML = HTML + template;
	}
	document.querySelector('.file-list').innerHTML = HTML;
}

document.addEventListener('DOMContentLoaded', initialize);
