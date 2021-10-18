/* Yiqun */
var input = "071acd5321b712745db188369d63619c8a654ef5208fe6a5c408f200ca69bd71"
let input_ = new RegExp(input);
var flag = false;
fetch('testing.txt').then(response => response.text()).then(text => {
    var array = text.split(/\r?\n/)
    //we aim for the address and balance which looks like:
    // 071acd5321b712745db188369d63619c8a654ef5208fe6a5c408f200ca69bd71 3945441296
    for(let i = array.length-1; i>=0;i--){ //search from new to old.
        if (array[i].match(input_)) {
            //split array by space
            var myArr = array[i].split(" ");
            flag = true;
        }
    }
    if(flag == true){
        console.log(myArr[1]);
    } else {
        console.log("false");
        //then we need to return a proof of membership
    }
});