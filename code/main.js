window.addEventListener('DOMContentLoaded', function() {
	const app = document.getElementById('app');

	// Construct all dynamic elements needed for the application:
	const input = document.createElement('div');
	input.id = 'input';
	const res = document.createElement('div');
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
		// Compute all nonce values from the set of trees:
		const target = Math.pow(2, 255);
		return Promise.all(trees.map(tree => calculate_nonce(tree[0][0], target)));
	}).then(nonces => {
		// TODO: Convert the list of merkle trees into a list of sequentially mined blocks
		// Return the results to the test harness:
		for(nonce of nonces) {
			const p = document.createElement('p');
			p.innerText = nonce;
			res.appendChild(p);
		}
		document.body.appendChild(res);
	});

	// Prompt the user for input:
	app.appendChild(input);
});
