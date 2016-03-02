# ls-db

A simple database runs on LocalStorage.

# Usage
集合:
---
- 创建集合: lsDB.collection.create(Name);   true || false
- 取出集合: lsDB.collection.use(Name);   集合实例 collectionObj.
- 删除集合: lsDB.collection.drop(Name);   true || false
- 查询集合: lsDB.collection.find(Name);   true || false
  
集合对象:
---
- 创建一条文档: collectionObj.insert(key, value);   true || false
- 查询一条文档: collectionObj.find(String || RegExp);   value
- 更新一条文档: collectionObj.update(key, value);   true || false
- 删除一条文档: collectionObj.remove(key);   true || false
- 批量删除文档: collectionObj.batchRemove(Function);   true || false
- 清空集合文档: collectionObj.clear();   true || false
  
# 存储 Key 结构:
LSDB_COLLECTIONNAME_ITEMNAME, value
