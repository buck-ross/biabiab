class Block{
	constructor(prev_hash,root_hash,target,nonce,accounts){
		this.prev_hash=prev_hash;
		this.root_hash=root_hash;
		this.timestamp=Date.now();
		this.target=target;
		this.nonce=nonce;
		this.accounts=accounts;
		this.print_account
	}
	stringify_header(){
		let out="";
		out+="BEGIN HEADER\n";
		out+=stringify_hash(this.prev_hash)+'\n';
		out+=stringify_hash(this.root_hash)+'\n';
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
async function create_block(prev,root_hash,target,accounts){
	let prev_hash=hash_string(prev);
	let nonce=calculate_nonce(root_hash,target);
	[prev_hash,nonce]=await Promise.all([prev_hash,nonce]);
	let block=new Block(prev_hash,root_hash,target,nonce,accounts);
	return block;
}
async function test_block(){
	let block=await create_block(0,await hash_string('test hash'),1,[]);
	console.log(block.print(true));
}
