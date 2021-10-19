function find_account(address, blockchain){
    let cnt_b = 0;
    let cnt_a = 0;
    
    // return location of account in block
    for (block of blockchain){
        cnt_a=0;
        for ( account of block.accounts){ // loop leaf nodes
            if (address == account.address) {
                break;
            };
            cnt_a++;
        }
        cnt_b++;
    }


    // blockchain[cnt_b].accounts[cnt_a] == account
    let valid = proof_of_membership(blockchain[cnt_b].accounts[cnt_a], 
        blockchain[cnt_b], 
        blockchain, 
        [cnt_b, cnt_a]);

    return valid;
}

function proof_of_membership(account, block, blockchain, indices){
    // returns: [hashes up tree], hash of block, header of block, [hashes forward in time]



    return null;
}