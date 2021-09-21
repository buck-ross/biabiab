/**
* Call this function in order to prompt the user to upload a file containing the address information
* @param {HTMLElement} app A handle to the main application DOM node
* @returns {Promise<Array>} A promise which resolves to an array of account objects
*/
function loadFile(app) {
	return new Promise(resolve => {
		const fileInput = document.createElement('input');
		const reader = new FileReader();

		// Configure the fileInput:
		fileInput.type = 'file';
		fileInput.id = 'addressFile';
		fileInput.addEventListener('change', function(fileEvent) {
			// Ensure that a valid file selection was made:
			if(fileEvent.target.files.length !=1)
				return console.warn('Received invalid file set');

			// Read the contents of the file:
			reader.addEventListener('load', function(readEvent) {
				// Isolate each address entry in the list:
				const accounts = readEvent.target.result
					.split(/(\0|\n|\r)/)
					.filter(elem => !/^\s*$/.test(elem))
					.map(addr => {
						return {
							address: addr.split(/\s+/)[0],
							balance: parseInt(addr.split(/\s+/)[1])
						}
					});

				// Return the array of files:
				resolve(accounts);
			});

			// Read the files as text:
			reader.readAsText(fileEvent.target.files[0]);
			fileInput.remove();
		});

		// Create the file input element:
		app.appendChild(fileInput)
	});
}

