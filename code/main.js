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
		// Convert the list of merkle trees into a list of sequentially mined blocks
		const blockchain=[];
		let prev_block='0';
		const target=2;
		for(tree of trees){
			// each block being added to the chain will await the prev_block
			blockchain.push(create_block(prev_block,tree,target));
			prev_block=blockchain[blockchain.length-1];
		}
		Promise.all(blockchain).then((blockchain)=>{
			// Return the results to the test harness:
			for(block of blockchain) {
				const p = document.createElement('p');
				p.innerText = block.stringify_block(true);
				res.appendChild(p);
			}
			document.body.appendChild(res);
		});
	});

	// Prompt the user for input:
	app.appendChild(input);
});
