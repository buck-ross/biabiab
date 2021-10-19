window.addEventListener('DOMContentLoaded', function() {
	const app = document.getElementById('app');

	// Construct all dynamic elements needed for the application:
	const input = document.createElement('div');
	input.id = 'input';
	const res = document.createElement('div');
	res.id = 'result';

	Promise.all([
		// Obtain all necessary inputs:
		promptAction(input, 'prompt'),
		promptParam(input, 'param'),
		loadFile(input, 'blockchain'),
	]).then(choices => {
		// Decode the array into an object:
		return { action: choices[0], param: choices[1], fData: choices[2] };
	}).then(async choices => {
		// Parse the input block:
		choices.chain = parse_blockchain_file(choices.fData);

		// Validate the input block:
		await validateChain(choices.chain);

		return choices;
	}).then(async choices => {
		// Decode `choices.action` to figure out which action to take:
		switch(choices.action) {
			case 'validate':
				return 'Block is valid';
			case 'balance':
				const balance = find_balance(choices.param, choices.chain);
				if(balance === null)
					return `Address ${choices.param} not found.`;
				return `balance is ${balance}.`;
			case 'membership':
				// test of proof of membership
				//console.log(await find_account("6c642844f8c6a312e82a409495a4a4a4eab567e541d89ef71b4801f79575dcbd", choices.chain));
				const proof = await find_account(choices.param, choices.chain);
				let out = '';
				for(let hash of proof[0])
					out += hash + '\n';
				for(let block of proof[1])
					out += block.stringify_header() + await hash_header(block) + '\n';
				return out;
			default:
				throw new Error(`Unknown action: ${choices.action}`);
		}
	}).then(output => {
		// Return the results to the test harness:
		res.innerText = output;
		document.body.appendChild(res);
	}).catch(err => {
		// Return the error to the test harness:
		console.error(err);
		res.classList.add('error');
		res.innerText = err.message;
		document.body.appendChild(res);
	});

	// Prompt the user for input:
	app.appendChild(input);
});
