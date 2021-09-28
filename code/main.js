window.addEventListener('load', async function() {
	const app = document.getElementById('app');

	// Obtain a list of accounts from the user:
	const accounts = await loadFile(app);

	// Construct the merkel tree:
	const tree = await mktree(accounts);

	// Calculate the nonce:
	const nonce_target = Math.pow(2, 255);
	const nonce = await calculate_nonce(tree[0][0], nonce_target);

	// Return the results to the test harness:
	const res = document.createElement('p');
	res.id = 'result';
	res.innerText = tree[0][0] + ' ' + nonce;
	document.body.appendChild(res);
});
