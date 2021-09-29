async function try_nonce(nonce, root_hash, target){
	// Compute the hash of the root hash concatenated with the nonce:
	const nonce_hash = stringify_hash(await hash_string(root_hash + nonce));

	// test against target
	if (parseInt(nonce_hash, 16) <= target) {
		return nonce;
	}

	return Promise.reject();
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
		try {
			// Try to compute the current nonce:
			return await try_nonce(i, root_hash, target);
		} catch(e) {
			// Increment `i` & try the next nonce:
			++i;
		}
	}
}
