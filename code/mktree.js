/**
* Define a function to compute the Merkel tree for a given set of accounts
*/
async function mktree(accounts) {
	const tree = [accounts];

	// Hash each leaf node to construct the next layer of the tree:
	let tmp = [];
	for(let i = 0; i < accounts.length; ++i) {
		tmp[i] = hash_string(accounts[i].address + accounts[i].balance);
	}

	// Push the new row to the front:
	tmp = await Promise.all(tmp);
	tree.unshift(tmp.map(stringify_hash));

	// Continue constructing layers until the tree is complete:
	while(tree[0].length !== 1) {
		tree.unshift(await mktreeNextRow(tree[0]));
	}

	// Return the resulting tree:
	return tree;
}

/**
* Define a helper function to compute the next row of a merkel tree:
*/
async function mktreeNextRow(row) {
	let out = [];

	// Hash every pair of nodes:
	for(let i = 0; i < row.length; i += 2) {
		// Concatenate the pair of hashes:
		let concat = row[i];
		if((i + 1) < row.length)
			concat += row[i + 1];

		// Hash the values:
		out[i/2] = hash_string(concat);
	}

	// Return the stringified hashes:
	out = await Promise.all(out);
	return out.map(stringify_hash);
}

