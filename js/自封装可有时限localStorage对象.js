//自封装可有时限localStorage对象


let myLocalStorage = {
    storage: localStorage,

    setItem: function(name, val, expires) {
        //首先添加信息到localStorage
        this.storage.setItem(name, val);
        //再设定时限
        this.addExpires(name, expires);
    },
    getItem: function(name) {
        return this.storage.getItem(name);
    },
    removeItem(name) {
        //不允许删除时间量
        if(name === `expires`) {
            return false;
        }
        this.storage.removeItem(name);
        this.removeExpires(name);
    },
    checkOverdue: function() {
        let data = this.storage.getItem(`expires`);
        if((data==="") || (data===null)) {
            return ;
        }
        
        const reg_name = /(?<=(&|^)).*?(?==\d)/ug;
        const reg_val = /(?<==)\d*(?=&)/ug;
        let name_arr = data.match(reg_name);
        let val_arr = data.match(reg_val);
        
        let date = (new Date()).getTime();
        for(let i=name_arr.length-1; i>=0; --i) {
            if(val_arr[i] <= date) {
                this.removeItem(name_arr[i]);
            }
        }
    },
    //添加expires数据
    addExpires: function(name, expires) {
        if(!(expires instanceof Date)) {
            return false;
        }

        const reg = this.getReg(name);
        const replace_text = this.getReplaceText(name, expires);
        let data = this.storage.getItem(`expires`);
        //把时间信息添加到localStorage.expires上
        if(data === null) {
            this.storage.setItem(`expires`, "");
            data = this.storage.getItem(`expires`);
        }
        if(data.search(reg) !== -1) {   //更新数据
            data = data.replace(reg, replace_text);
        }
        else {  //创建数据
            data += replace_text;
        }
        this.storage.setItem(`expires`, data);
    },
    //删除expires数据
    removeExpires: function(name) {
        const reg = this.getReg(name);
        let data = this.storage.getItem(`expires`);
        if(data !== null) {
            data = data.replace(reg, "");
            this.storage.setItem(`expires`, data);
        }
    },
    //返回匹配expires键值对的正则式
    getReg: function(name) {
        return new RegExp(`((?<=&)|^)${name}=\\d*&`, `u`);  //你妹的火狐居然不支持正则?<=
    },
    //返回expires正则匹配项要修改的值
    getReplaceText: function(name, expires) {
        return `${name}=${expires.getTime()}&`;
    }
};
//当加载本对象后就检索并删除超期数据
myLocalStorage.checkOverdue();
