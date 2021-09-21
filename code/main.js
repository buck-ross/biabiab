window.addEventListener('load', async function() {
	const app = document.getElementById('app');

	// Obtain a list of accounts from the user:
	const accounts = await loadFile(app);

	// Construct the merkel tree:
	const tree = await mktree(accounts);

	// Return the results to the test harness:
	const res = document.createElement('p');
	res.id = 'result';
	res.innerText = tree[0][0];
	document.body.appendChild(res);
});
