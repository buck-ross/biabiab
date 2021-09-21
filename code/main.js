window.addEventListener('load', async function() {
	const app = document.getElementById('app');

	// Obtain a list of accounts from the user:
	const accounts = await loadFile(app);

	// Return the results to the test harness:
	const res = document.createElement('p');
	res.id = 'result';
	res.innerText = JSON.stringify(accounts);
	document.body.appendChild(res);
});
