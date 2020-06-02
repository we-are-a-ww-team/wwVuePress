# 分布式事务

## TCC

代码示例：



创建数据库hmily，以及wang



数据库建表脚本：

```sql
CREATE TABLE `account` (

  `id` int(11) NOT NULL AUTO_INCREMENT,

  `account` varchar(255) DEFAULT NULL,

  `mount` varchar(255) DEFAULT NULL,

  `created_time` datetime DEFAULT NULL,

  `updated_time` datetime DEFAULT NULL,

  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
```





数据脚本：

```
INSERT INTO `wang`.`account`(`id`, `account`, `mount`, `created_time`, `updated_time`) VALUES (1, 'zhangsan', '100', NULL, NULL);

INSERT INTO `wang`.`account`(`id`, `account`, `mount`, `created_time`, `updated_time`) VALUES (2, 'lisi', '100', NULL, NULL);
```



测试场景：zhangsan向lisi转帐10元

```
测试链接：http://localhost:10002/wykd-tcc-zhangsan/accountController/pay/zhangsan/10
```



## Seata