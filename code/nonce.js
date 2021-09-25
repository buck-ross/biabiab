async function try_nonce(nonce, root_hash, target){
    // concatenate
    // hash
    let nonce_hash = await hash(root_hash + i); // TODO concat properly

    // test against target
    if (nonce_hash <= target) {
        return nonce;
    }

    return Promise.reject();
}

/* calculate nonce
 * @param root_hash 
 * @param target
 * @return correct nonce */
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