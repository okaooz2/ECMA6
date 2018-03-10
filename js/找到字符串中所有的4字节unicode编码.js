//找到字符串中所有的4字节unicode编码

let str = `fsg𠮷𠮷sdf𠮷𠮷448adf你感觉𠮷𠮷𐐁𐐁很大方𐐁𐓓𐓓第三𐓓𐐁𐐁𐐁`;
console.log(str);

let arr = str.match(/[\ud800-\udbff][\udc00-\udfff]/g);
console.log(arr);

let resual = find(str);
for(let prop in resual) {
    console.log(`"${prop}"出现了${resual[prop]}次`);
}

function find(str) {
    let resual = {};
    let len = str.length;

    while(str.length !== 0) {
        let index = str.search(/[\ud800-\udbff][\udc00-\udfff]/);
        if(index === -1) {
            return resual;
        }
        else {
            let one_resual = str.slice(index, index+2);
            resual[one_resual] ? ++resual[one_resual] : resual[one_resual]=1;
            str = str.slice(index+2);
        }
    }

    return resual;
}