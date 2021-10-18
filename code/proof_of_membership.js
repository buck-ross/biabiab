function find_account(account, blockchain){
    let cnt_b = 0;
    let cnt_a = 0;
    // return location of account in block
    for (block of blockchain){
        cnt_a=0;
        for ( acc of block.accounts){
            if (account == acc) {
                break;
            };
            cnt_a++;
        }
        cnt_b++;
    }


    // blockchain[cnt_b].accounts[cnt_a] == account
    proof_of_membership(blockchain[cnt_b].accounts[cnt_a], blockchain[cnt_b], blockchain);

    return null;
}

function proof_of_membership(account, block, blockchain){
    // returns: [hashes up tree], hash of block, header of block, [hashes forward in time]

    return null;
}