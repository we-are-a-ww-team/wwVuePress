# Mysql

## 事务隔离级别

```
读未提交（read-uncommitted）
不可重复读（read-committed）	
可重复读（repeatable-read）【mysql默认】
串行化（serializable）
```

参考：https://www.cnblogs.com/wyaokai/p/10921323.html

## 三大范式和反范式设计

## SQL优化

### sql优化基本规则

### sql优化工作实例

开启事务

- **BEGIN**/**start Transaction** 开始一个事务
- **ROLLBACK** 事务回滚
- **COMMIT** 事务确认

### 执行计划

```
system > const > eq_ref > ref > fulltext > ref_or_null > index_merge
> unique_subquery > index_subquery > range > index > ALL
```

参考：http://www.wenjiangs.com/article/mysql-explain.html

**查看sql语句在mysql引擎最终的执行语句：**

```
EXPLAIN
select * from etc_test where id = 1;
show WARNINGS
```