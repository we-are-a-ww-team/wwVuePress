# Sql语句

## 常用基本命令

```sql
## 查看版本号
select version();

## 查看引擎
show variables like '%engine%';

## 查看隔离级别
show global variables like '%isolation%';
```

## 事务相关

```sql
## mysql默认 开启了 自动提交
show variables like '%autocommit%';

## 开启自动提交
set session autocommit = on;  ##  关闭：off 开启: on

## 开启事务
begin;
## 回滚事务
rollback;
## 提交事务
commit;


```

