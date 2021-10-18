const hexValidator = /^[0-9A-Fa-f]+$/;

/**
* Define a helper function to assert that something is true
* @param {boolean} cond The condition to assert as `true`
* @param {string} msg The error message to emit when the assertion fails
* @throws {Error}
*/
function assert(cond, msg) {
	if(!cond) throw new Error(msg);
}

/**
* Determine the validity of a given block
* @param {Block} block The block to be validated
* @param {string} parentHash A hash of the block's parent
* @param {number} parentAge The timestamp of the parent block
* @returns {Promise<null>} resolves if the block is valid, fails otherwise
*/
async function validateBlock(block, parentHash, parentAge) {
	// Validate the parent hash:
	assert(block.prev_hash.length === 64,
		`Parent hash '${block.prev_hash}' must be exactly 64 characters long`);
	assert(hexValidator.test(block.prev_hash),
		`Parent hash '${block.prev_hash}' is not a valid hex string`);
	assert(block.prev_hash === parentHash,
		`Parent hash '${block.prev_hash}' does not match '${parentHash}'`);

	// Validate each account:
	assert(block.accounts.length > 0,
		'A block cannot be formed with an empty accounts list');
	for(account of block.accounts) {
		assert(account.address.length === 64,
			`Address '${account.address}' must be exactly 64 characters long`);
		assert(hexValidator.test(account.address),
			`Address '${account.address}' is not a valid hex string`);
		assert(account.balance >= 0,
			`Balance ${account.balance} should be greater than or equal to 0`);
	}

	// Validate the merkle root:
	assert(hexValidator.test(block.root_hash),
		`Merkle root '${block.root_hash}' is not valid hex`);
	const tree = await mktree(block.accounts);
	assert(tree[0][0] === block.root_hash,
		`Merkle root '${block.root_hash}' does not line up with root hash '${tree[0][0]}'`);

	// Validate the timestamp:
	assert(Number.isInteger(block.timestamp),
		`Timestamp '${block.timestamp}' must be an integer`);
	assert(block.timestamp > 0,
		`Timestamp '${block.timestamp}' must be a positive value`);
	assert(parentAge < block.timestamp,
		`Timestamp '${block.timestamp}' must be after parent '${parentAge}'`);

	// Validate the target difficulty:
	assert(block.target.length > 0,
		`Target '${block.target}' must not be empty`);
	assert(block.target.length <= 64,
		`Target '${block.target}' must be at most 64 characters long`);
	assert(hexValidator.test(block.target),
		`Target '${block.target}' must be valid hex`);
	assert(compare_hashes(block.target, '1'.padStart(64, '0')) === 1,
		`Target '${block.target}' must be greater than 1`);
	assert(compare_hashes(block.target, ''.padStart(64, 'f')) === -1,
		`Target '${block.target}' must be less than '${''.padStart(64, 'f')}'`);

	// Validate the nonce:
	assert(block.nonce !== null,
		`Nonce '${block.nonce}' is null`);
	const nonce = await try_nonce(block.nonce, block.root_hash, block.target);
	assert(block.nonce === nonce,
		`Nonce '${block.nonce}' produces '${nonce}' when tested`);

	// Signal that the block is valid:
	return null;
}

/**
* Determine the validity of a block chain
* @param {Array<Block>} chain The block chain to be validated
* @returns {Promise<null>} resolves if the block is valid, fails otherwise
*/
async function validateChain(chain) {
	// Validate the chain length:
	assert(chain.length > 0,
		'Chain must contain at least one block');
}

