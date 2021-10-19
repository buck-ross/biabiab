function find_balance(address, chain){
	for(block of chain)
		for(account of block.accounts)
			if(account.address === address)
				return account.balance;
	return null;
}
