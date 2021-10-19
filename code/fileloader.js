/**
* Call this function in order to prompt the user to select an action to perform on the file
* @param {HTMLElement} app A handle to the main application DOM node
* @param {string} id The ID of the choice element to create
* @returns {Promise<string>} A promise which resolves to the action which was selected
*/
function promptAction(app, id) {
	// Create the parent element:
	const choice = document.createElement('select');
	choice.id = id;
	const blank = document.createElement('option');
	blank.innerText = '--- Select an action ---';
	blank.disabled = true;
	blank.selected = true;
	blank.value = null;
	choice.add(blank);

	// Populate the parent element with choices:
	const options = [
		[ 'validate', 'Validate Only' ],
		[ 'balance', 'Find Balance' ],
		[ 'membership', 'Compute Proof of Membership' ]
	];
	for(option of options) {
		let opt = document.createElement('option');
		opt.value = option[0];
		opt.innerText = option[1];
		choice.add(opt);
	}

	// Resolve the output once the choice has been uploaded & processed:
	return new Promise(resolve => {
		choice.addEventListener('change', function(choiceEvent) {
			// Ensure that a valid selection was made:
			if(!options.map(val => val[0]).includes(choice.value))
				return console.warn('Received invalid choice');

			// Remove the file input element & return the value:
			resolve(choice.value);
			choice.remove();
		});

		// Create the choice input element:
		app.appendChild(choice)
	});
}

/**
* Call this function in order to prompt the user to select a string parameter
* @param {HTMLElement} app A handle to the main application DOM node
* @param {string} id The ID of the input element to create
* @returns {Promise<string>} A promise which resolves the parameter which was provided
*/
function promptParam(app, id) {
	// Create the parent element:
	const input = document.createElement('input');
	input.id = id;
	input.type = 'text';

	// Resolve the output once the choice has been uploaded & processed:
	return new Promise(resolve => {
		input.addEventListener('change', function(choiceEvent) {
			// Ensure that a valid selection was made:
			if(!input.value)
				return console.warn('Received invalid parameter');

			// Remove the file input element & return the value:
			resolve(input.value);
			input.remove();
		});

		// Create the choice input element:
		app.appendChild(input)
	});
}

/**
* Call this function in order to prompt the user to upload a file containing the address information
* @param {HTMLElement} app A handle to the main application DOM node
* @param {string} id The ID of the input element to create
* @returns {Promise<string>} A promise which resolves to the content of the provided file
*/
function loadFile(app, id) {
	const fileInput = document.createElement('input');
	const reader = new FileReader();

	// Configure the fileInput:
	fileInput.type = 'file';
	fileInput.id = id;

	// Resolve the output once the file has been uploaded & processed:
	return new Promise(resolve => {
		fileInput.addEventListener('change', function(fileEvent) {
			// Ensure that a valid file selection was made:
			if(fileEvent.target.files.length !=1)
				return console.warn('Received invalid file set');

			// Read the contents of the file:
			reader.addEventListener('load', function(readEvent) {
				// Return the file contents:
				resolve(readEvent.target.result);
			});

			// Read the files as text:
			reader.readAsText(fileEvent.target.files[0]);

			// Remove the file input element:
			fileInput.remove();
		});

		// Create the file input element:
		app.appendChild(fileInput)
	});
}

