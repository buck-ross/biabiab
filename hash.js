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
	return string;
}

function test_hash(){
	let test_string='this is a test of this';
	hash_string(test_string).then((hashed)=>console.log(stringify_hash(hashed)));
}
