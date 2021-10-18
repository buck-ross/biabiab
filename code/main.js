window.addEventListener('DOMContentLoaded', function() {
	const app = document.getElementById('app');

	// Construct all dynamic elements needed for the application:
	const input = document.createElement('div');
	input.id = 'input';
	const res = document.createElement('div');
	res.id = 'result';
	const parser_input = document.createElement('div');
	parser_input.id = 'parser_input';

	Promise.all([
		// Obtain a list of account files from the user:
		loadFile(input, 'accounts1'),
		loadFile(input, 'accounts2'),
		loadFile(input, 'accounts3')
	]).then(accountSets => {
		// Remove the input element:
		input.remove();
		parser_input.remove();

		// Convert each account list into a set of merkle trees:
		return Promise.all(accountSets.map(set => mktree(set)));
	}).then(async trees => {
		// Declare the blockchain & all dynamic parameters:
		const blockchain = [];
		const target = Math.pow(2, 255).toString(16).padStart(64, '0');
		let prev_block = null;

		// Convert the list of merkle trees into a list of sequentially mined blocks:
		for(tree of trees){
			// each block being added to the chain will await the prev_block
			prev_block = await create_block(prev_block, tree, target);
			blockchain.push(prev_block);
		}
		return blockchain;
	}).then(blockchain => {
		// Return the results to the test harness:
		for(block of blockchain) {
			const p = document.createElement('p');
			p.innerText = block.toString();
			res.appendChild(p);
		}
		document.body.appendChild(res);
	});

	parse_blockchain_file(parser_input, 'blockchain_file').then(result=>{
		input.remove();
		parser_input.remove();
		const p = document.createElement('p');
		p.innerText=result;
		res.appendChild(p);
	});

	// Prompt the user for input:
	app.appendChild(input);

	app.appendChild(parser_input);
});
