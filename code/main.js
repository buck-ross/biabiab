window.addEventListener('DOMContentLoaded', function() {
	const app = document.getElementById('app');

	// Construct all dynamic elements needed for the application:
	const input = document.createElement('div');
	input.id = 'input';
	const res = document.createElement('p');
	res.id = 'result';

	Promise.all([
		// Obtain a list of account files from the user:
		loadFile(input, 'accounts1'),
		loadFile(input, 'accounts2'),
		loadFile(input, 'accounts3')
	]).then(accountSets => {
		// Remove the input element:
		input.remove();

		// Convert each account list into a set of merkle trees:
		return Promise.all(accountSets.map(set => mktree(set)));
	}).then(trees => {
		// TODO: Convert the list of merkle trees into a list of sequentially mined blocks
		// Return the results to the test harness:
		for(tree of trees) {
			const p = document.createElement('p');
			p.innerText = tree[0][0];
			res.appendChild(p);
		}
		document.body.appendChild(res);
	});

	// Prompt the user for input:
	app.appendChild(input);
});
