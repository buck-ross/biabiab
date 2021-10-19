async function find_account(address, blockchain){
    let cnt_b = 0;
    let cnt_a = 0;

    // return location of account in block
    for (block of blockchain){
        cnt_a=0;
        for ( account of block.accounts){ // loop leaf nodes
            if (address == account.address) {
                // console.log(cnt_b, cnt_b);
                // console.log(blockchain);
                // blockchain[cnt_b].accounts[cnt_a] == account
                let valid = await proof_of_membership(blockchain[cnt_b].accounts[cnt_a], 
                    blockchain[cnt_b], 
                    blockchain, 
                    [cnt_b, cnt_a]);

                return valid;
            };
            cnt_a++;
        }
        cnt_b++;
    }

    return undefined;
}

function structify_header(block) {
    const header = {
        prev_hash: block.prev_hash,
        root_hash: block.root_hash,
        timestamp: block.timestamp,
        target: block.target,
        nonce: block.nonce,
    };

    return header;
}

async function proof_of_membership(account, block, blockchain, indices){
    // returns: [hashes up tree], hash of block, header of block, [hashes forward in time]

    let cnt_b = indices[0];
    let cnt_a = indices[1];

    let hashes_mktree = [];

    let mtree = await mktree(block.accounts);

    let acc_node = mtree[mtree.length - 1][cnt_a];
    let acc_hash = stringify_hash(await hash_string(acc_node.address + acc_node.balance));

    let acc_sib;
    if (cnt_a%2 == 0) {
        acc_sib = mtree[mtree.length - 1][cnt_a+1];
    } else {
        acc_sib = mtree[mtree.length - 1][cnt_a-1];
    };

    let acc_sib_hash = stringify_hash(await hash_string(acc_sib.address + acc_sib.balance));

    hashes_mktree = [acc_hash, acc_sib_hash];

    let j = Math.floor(cnt_a/2);
    for (var i = mtree.length - 2; i >= 0; i--) {
        hashes_mktree.push(mtree[i][j]);

        if (i != 0) {
            if (j%2 == 0) {
                hashes_mktree.push(mtree[i][j+1]);
            } else {
                hashes_mktree.push(mtree[i][j-1]);
            };  
        };

        j = Math.floor(j/2);
    }; // hashes_mktree filled

    let hashes_from_block = [];
    // blockchain[cnt_b]

    for (var i = cnt_b; i < blockchain.length; i++) {
        let block_header = structify_header(blockchain[i]);
        hashes_from_block.push(block_header);
    }; // hashes_from_block filled

    // block_header = hashes_from_block[0]
    // block_hash = hashes_from_block[1].prev_hash 
    return [hashes_mktree, hashes_from_block];
}









