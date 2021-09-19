async function hash(message){
	const encoder=new TextEncoder();
	const data=encoder.encode(message);
	const hash=await crypto.subtle.digest('SHA-256',data);
	let array=new Uint8Array(hash);
	//let string=new TextDecoder().decode(array);
	let string=array.reduce((i,j)=>i+j.toString(16));
	return string;
}
let test_clear='this is a test of this';
let buffer=hash(test_clear).then((str)=>console.log(str));
