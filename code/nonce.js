async function try_nonce(nonce, root_hash, target){
	// Compute the hash of the root hash concatenated with the nonce:
	const nonce_hash = stringify_hash(await hash_string(root_hash + nonce));

	// test against target
	if (compare_hashes(nonce_hash, target) === -1) {
		return nonce;
	}

	return null;
}

/**
* calculate nonce
* @param root_hash
* @param target
* @return correct nonce
*/
async function calculate_nonce(root_hash, target) {
	let i = 0;
	while (true) {
		// Try to compute the current nonce:
		let nonce = await try_nonce(i, root_hash, target);
		if(nonce !== null)
			return nonce;

		// Increment `i` & try the next nonce:
		++i;
	}
}
