let str = "𠮷fjdsjkl就离开过级三等奖副科级娄底市解放路看看书";

let json = {};
//遍历4字节大小的字符不会报错，但结果会出错
// for(let i=0, len=str.length; i<len; ++i) {
//     if(typeof json[str[i]] === "undefined") {
//         json[str[i]] = 1;
//     }
//     else {
//         ++json[str[i]];
//     }
// }
//可以正确遍历4字节大小的字符
for(let val of str) {
    if(typeof json[val] === "undefined") {
        json[val] = 1;
    }
    else {
        ++json[val];
    }
}

for(let prop in json) {
    console.log(`字符“${prop}”出现了${json[prop]}次`);
}