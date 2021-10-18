// call this to hash a string
// message: a string to be hashed
// returns a string of hex digits of SHA-256 hash
async function hash_string(message){
	const encoder=new TextEncoder();
	const data=encoder.encode(message);
	return await hash(data);
}

// call this to hash an array
// data: a Uint8Array to be hashed
// returns SHA-256 hash of data in message
async function hash(data){
	const hash=await crypto.subtle.digest('SHA-256',data);
	const array=new Uint8Array(hash);
	return array;
}

// call this to turn hashed data into a string of hex digits
// hash: Uint8Array of hashed data
// returns a string of hex digits of the hashed data (Note: do not use the returned string for hashing in hash_string()!, put the array into hash())
function stringify_hash(hash){
	const string=hash.reduce((i,j)=>i+j.toString(16).padStart(2,'0'),"");
	return string.padStart(64, '0');
}

/**
* Allow two stringified hashes to be compared to one another
* @param {string} hash1 The first hash
* @param {string} hash2 The second hash
* @returns {number} 0 if hash1 === hash2, -1 if hash1 < hash2, 1 if hash1 > hash2
*/
function compare_hashes(hash1, hash2) {
	if(hash1 === hash2)
		return 0;

	for(let i = 0; i < 64; i += 8) {
		const c1 = parseInt(hash1.slice(i, i + 8), 16);
		const c2 = parseInt(hash2.slice(i, i + 8), 16);
		if(c1 > c2)
			return 1;
		if(c1 < c2)
			return -1;
	}

	// Unreachable:
	throw new Error(`Unable to compare hashes '${hash1}' and '${hash2}'`);
}

