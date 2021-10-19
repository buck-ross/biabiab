async function try_nonce(block){
	// Compute the hash of the root hash concatenated with the nonce:
	const nonce_hash = await hash_header(block);

	// test against target
	if (compare_hashes(nonce_hash, block.target) === -1) {
		return true;
	}

	return false;
}

/**
* calculate nonce
* @param root_hash
* @param target
* @return correct nonce
*/
async function calculate_nonce(block) {
	block.nonce = 0;
	while (true) {
		// Try to compute the current nonce:
		if(await try_nonce(block))
			return;

		// Increment the nonce & try the next nonce:
		++block.nonce;
	}
}
