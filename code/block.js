class Block{
	constructor(prev_hash,acc_tree,target,nonce){
		this.prev_hash=prev_hash;
		this.root_hash=acc_tree[0][0];
		this.timestamp=Date.now();
		this.target=target;
		this.nonce=nonce;
		this.accounts=acc_tree[acc_tree.length-1];
		this.print_account
	}
	stringify_header(){
		let out="";
		out+="BEGIN HEADER\n";
		out+=this.prev_hash+'\n';
		out+=this.root_hash+'\n';
		out+=this.timestamp+'\n';
		out+=this.target+'\n';
		out+=this.nonce+'\n';
		out+="END HEADER\n";
		return out;
	}
	stringify_accounts(enable){
		let out="";
		if(enable){
			this.accounts.forEach(account=>{
				out+=account.address+' '+account.balance+'\n';
			});
		}
		return out;
	}
	// for printing the full block, the enable param will take true if ledger should be printed, false otherwise
	stringify_block(enable){
		let out="";
		out+="BEGIN BLOCK\n";
		out+=this.stringify_header();
		out+=this.stringify_accounts(enable);
		out+="END BLOCK\n";
		return out;
	}
	toString(){
		return this.stringify_block(true);
	}
	print(enable){
		console.log(this.stringify_block(enable));
	}
}
// stand-in until nonce branch completion
async function calculate_nonce(root_hash,target){
	return 2;
}
// returns the hash of the header of a completed block object
async function hash_header(block){
	if(typeof(block)!='string'){
		let header=""+block.prev_hash+block.root_hash+block.timestamp+block.target+block.nonce;
		let header_hashed=stringify_hash(await hash_string(header));
		return header_hashed;
	}
	return('0');
}
// creates a block asynchronously
// @param prev the block it is on added after, takes either '0' or a promise which will resolve to the completed block
// @param accounts the merkle tree of accounts and balances
// @param target the target for the nonce to beat
// @returns the newly added block
async function create_block(prev,accounts,target){
	let prev_hash;
	console.log(prev);
	if(prev=='0'){
		prev_hash='0';
	}
	else{
		prev_hash=await hash_header(await prev);
	}
	let nonce=calculate_nonce(accounts[accounts.length-1],target);
	[prev_hash,nonce]=await Promise.all([prev_hash,nonce]);
	let block=new Block(prev_hash,accounts,target,nonce);
	console.log("block added");
	console.log(block);
	return block;
}
