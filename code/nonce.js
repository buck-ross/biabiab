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
	let nonce = null;
	let a = 0;
	let b = 5; // batch size

	while (nonce == null) {
		let tmp = [];
		for (let i = a; i < a+b; i++) {
			tmp.push(try_nonce(i, root_hash, target));
		}

		nonce = await Promise.any(tmp).catch((reason)=>null);
		a += b;
	}

	return nonce;
}
