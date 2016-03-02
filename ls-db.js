/*
 *  LocalStorage Database By LancerComet at 14:36, 2016/3/2.
 *  # Carry Your World #
 *  ---
 *  localStorage Database.
 *
 *  使用方法:
 *  ---
 * 
 *  集合:
 *  ---
 *   - 创建集合: lsDB.collection.create(Name);  // true || false
 *   - 取出集合: lsDB.collection.use(Name);  // 集合实例 collectionObj.
 *   - 删除集合: lsDB.collection.drop(Name);  // true || false
 *   - 查询集合: lsDB.collection.find(Name);  // true || false
 * 
 *  集合对象:
 *  ---
 *   - 创建一条文档: collectionObj.insert(key, value);  // true || false
 *   - 查询一条文档: collectionObj.find(String || RegExp);  // value
 *   - 更新一条文档: collectionObj.update(key, value);  // true || false
 *   - 删除一条文档: collectionObj.remove(key);  // true || false
 *   - 批量删除文档: collectionObj.batchRemove(Function);  // true || false
 *   - 清空集合文档: collectionObj.clear();  // true || false
 * 
 *  存储 Key 结构:
 *  ---
 *  LSDB_COLLECTIONNAME_ITEMNAME, value
 *  
 */



// Poor lsDB. Let's start here.
// ======================================
var lsDB = {
    author: "LancerComet",
    version: "0.1.0"
};



// Definition: lsDB configuration. | lsDB 设置.
// ======================================
lsDB.config = {
    keyPrefix: "LSDB_",
    infoKeyName: "LSDB_INNERDATA",
    consolePrefix: "lsDB: "    
};



// Definition: lsDB inner data operation. | lsDB 内部数据操作方法.
// ======================================
lsDB.LSDB_DATA = {
    init: function () {
        localStorage.setItem(lsDB.config.infoKeyName, JSON.stringify({collections: []}));        
    },
    checkout: function () {
        return JSON.parse(localStorage.getItem(lsDB.config.infoKeyName)) || {};
    },
    refresh: function (value) {
        value = typeof value === "string" ? value : JSON.stringify(value);
        localStorage.setItem(lsDB.config.infoKeyName, value);
        return true;
    }
};



// Definition: lsDB Initialization.
// ======================================
lsDB.init = function () {
    if (!window.localStorage) {
        console.log(lsDB._DATA.consoleText + "Sadly, Your browser doesn't support localStorage :(");
        return;
    }
        
    // 寻找 LSDB_DATA 条目进行初始化.
    var LSDB_DATA = lsDB.LSDB_DATA.checkout();
    /*  
        LSDB_INNERDATA is a document that stored in localStorage that contains all necessary information.
        LSDB_INNERDATA, {
            collections: []
        } 
    */
    console.log(LSDB_DATA);
    if (isEmptyObj(LSDB_DATA)) {
        lsDB.LSDB_DATA.init();
    } else {
        lsDB.collection.exists = LSDB_DATA.collections || [];  // 将集合信息缓存至 lsDB.collection.exists 中.        
    }
    
    function isEmptyObj (object) {
		var name;
		for (name in object) {
			return false;
		}
		return true;
	}
};




// Definition: lsDB Collection Operations. | lsDB 集合操作.
// ======================================
lsDB.collection = {
    // Collections in lsDB. | 当前的集合信息.
    exists: [],
    
    // Create a collection. | 创建集合对象.
    create: function (name) {
        if (lsDB.collection.exists.indexOf(name) > -1) {
            console.log(lsDB.config.consolePrefix + "Collection " + name + " already exists, please use a new name.");
            return;
        }
        
        lsDB.collection.exists.push(name);
        
        // 取出 LSDB_DATA， 改写其中的 collections, 加入新的 collection.
        var LSDB_DATA = lsDB.LSDB_DATA.checkout();  // LSDB_DATA is an Object.
        LSDB_DATA.collections = lsDB.collection.exists;
        lsDB.LSDB_DATA.refresh(LSDB_DATA);
        return lsDB.collection.use(name);
    },
    
    // Pickup collection and get the collectionObj. |　取出集合并返回为集合实例对象.
    use: function (name) {
        return new lsDB.collectionObj(name);        
    },
    
    // Find collection. | 查询集合.
    find: function (name) {
        return lsDB.collection.exists.indexOf(name) > -1;  // true || false.
    },
    
    // Drop collection. | 删除集合.
    drop: function (name) {
        var index = lsDB.collection.exists.indexOf(name);
        if (index < 0) {
            console.log(lsDB.config.consolePreifx + 'No Collection "' + name + '" in lsDB.');
            return false;
        }
        
        // 清除集合中文档数据.
        var dropCollection = new lsDB.collectionObj(name);
        dropCollection.clear();
        
        // 删除目标集合.
        lsDB.collection.exists.splice(index, 1);
        
        // 取出 LSDB_DATA， 改写其中的 collections, 删除目标 collection.
        var LSDB_DATA = lsDB.LSDB_DATA.checkout();  // LSDB_DATA is an Object.
        LSDB_DATA.collections = lsDB.collection.exists;
        lsDB.LSDB_DATA.refresh(LSDB_DATA);
        
        return true;
    },
    
    // 重命名集合名称.
    rename: function (oldName, newName) {
        var thisCollection = new lsDB.collectionObj(oldName);
    }
};


// Definition: lsDB Document Object. | lsDB 文档对象.
// ======================================
lsDB.collectionObj = function (collectionName) {
    this.colName = collectionName;
    this.filter = lsDB.config.keyPrefix + collectionName + "_";  // 集合过滤器.
};

lsDB.collectionObj.prototype = {
    
    // 在集合内插入新文档.
    insert: function (key, value) {
        if (this.find(key)) {
            console.log(lsDB.config.consolePrefix + "Document \"" + key + "\" already exists. Use \"update()\" to rewrite value.");
            return false;
        };
        value = 
        this.update(key, typeof value === "string" ? value : JSON.stringify(value));
        return true;
    },
    
    // 更新集合内文档.
    update: function (key, value) {
        localStorage.setItem(this.filter + key, value);
        return true;        
    },
    
    // 查询集合内文档.
    find: function (key) {
        var result = [];
        
        // param "key" is just a word, but we are going to find "LSDB_this.colName_keyName".
        // "LSDB_this.colName_" is the filter.
        var filter = this.filter;
                
        for (var item in localStorage) {
            if (!localStorage.hasOwnProperty(item) || item.indexOf(filter) < 0) { continue; }
            var keyName = item.substr(filter.length);  // "keyName"" from "LSDB_this.colName_keyName"
            
            // If regexp is provided, go matching this regexp.
            if (Object.prototype.toString.call(key) === "[object RegExp]") {
                keyName.match(key) && (function () {
                    result.push({
                        key: keyName,
                        value: localStorage.getItem(item)
                    });
                })();
            } else {
                // Otherwise just use "indexOf".
                if (keyName.indexOf(key) > -1) {
                    result.push({
                        key: keyName,
                        value: localStorage.getItem(item)
                    });
                }
            }

        }
        
        return result.length > 0 ? result : null;
    },
    
    // 重命名集合内文档.
    rename: function (oldKey, newKey) {
        if (!this.find(oldKey)) {
            console.log(lsDB.config.consolePrefix + "Document \"" + oldKey + "\" doesn't exist. Please check it out.");
            return false;
        }
        if (this.find(newKey)) {
            console.log(lsDB.config.consolePrefix + "Document \"" + newKey + "\" already exists. Please use a new value :)");
            return false;
        }
        var value = this.find(oldKey)[0].value;
        console.log(value);
        this.remove(oldKey);
        this.insert(newKey, value);
        return true;
    },
    
    // 删除集合内文档.
    remove: function (key) {
        localStorage.removeItem(this.filter + key);
        return true;
    },
    
    // 批量删除集合内文档.
    batchRemove: function (roleFunc) {
        for (var item in localStorage) {
            if (!localStorage.hasOwnProperty(item) || item.indexOf(this.filter) < 0) { continue; }
            var keyName = item.substr(filter.length);  // "keyName"" from "LSDB_this.colName_keyName"
            roleFunc(keyName) ? this.remove(keyName) : void(0);            
        }
    },
    
    // 清空集合内文档.
    clear: function () {
        for (var item in localStorage) {
            if (!localStorage.hasOwnProperty(item) || item.indexOf(this.filter) < 0) { continue; }
            localStorage.removeItem(item);
        }
        return true;
    }
};

lsDB.init();  // Init.