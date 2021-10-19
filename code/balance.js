function balance(input,array){//input is the address and the array is the block
  var flag = false;
    //var array = text.split(/\r?\n/)
  var input_ = new RegExp(input);

  for(let i = array.length-1; i>=0;i--){//search from new to old. 
  if (array[i].match(input_)) {
//split array by space
  var myArr = array[i].split(" ");
  flag = true;
}
  }
    if(flag == true){
      return (myArr[1]);
    //console.log(myArr[1]);
  }else{
   return false;//then we need to return a proof of membership
  }
}
