class Block {
	constructor(prev_hash,timestamp,acc_tree,target,nonce) {
		this.prev_hash = prev_hash;
		this.root_hash = acc_tree[0][0];
		this.timestamp = timestamp;
		this.target = target;
		this.nonce = nonce;
		this.accounts = acc_tree[acc_tree.length - 1];
	}
	stringify_header() {
		let out = '';
		out += 'BEGIN HEADER\n';
		out += this.prev_hash + '\n';
		out += this.root_hash + '\n';
		out += this.timestamp + '\n';
		out += this.target.toString(16) + '\n';
		out += this.nonce.toString(16) + '\n';
		out += 'END HEADER\n';
		return out;
	}
	stringify_accounts(enable) {
		let out = '';
		if(enable) {
			this.accounts.forEach(account => {
				out += account.address + ' ' + account.balance + '\n';
			});
		}
		return out;
	}
	// for printing the full block, the enable param will take true if ledger should be printed, false otherwise
	stringify_block(enable) {
		let out = '';
		out += 'BEGIN BLOCK\n';
		out += this.stringify_header();
		out += this.stringify_accounts(enable);
		out += 'END BLOCK\n';
		return out;
	}
	toString() {
		return this.stringify_block(true);
	}
}
// returns the hash of the header of a completed block object
async function hash_header(block) {
	if(typeof block !== 'string') {
		const header = block.stringify_header();
		const header_hashed = stringify_hash(await hash_string(header));
		return header_hashed;
	}
	return '0';
}
// creates a block asynchronously
// @param prev the block it is on added after, takes either '0' or a promise which will resolve to the completed block
// @param accounts the merkle tree of accounts and balances
// @param target the target for the nonce to beat
// @returns the newly added block
async function create_block(prev, accounts, target) {
	const prev_hash = prev ? (await hash_header(prev)) : ''.padStart(64, '0');
	const block = new Block(prev_hash, Date.now(), accounts, target, 0);
	await calculate_nonce(block);
	return block;
}
