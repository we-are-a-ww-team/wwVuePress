# Maven

常见命令

```
#查看版本
mvn -version

#打包
mvn package
#上传到本地仓库
mvn install
#发布到私服（包含mvn install）
mvn deploy
#清理
mvn clear
#源码打包
mvn source:jar



```

属性：

```
#强制更新依赖
-U
#打印完整的stack trace，以方便分析错误原因
-e
#指定Profile
-P
	#打包profile=dev
	mvn -Pdev package
#修改属性
-D
	#跳过测试
	mvn install -Dmaven.test.skip=true
```

其他：

```
#生成eclipse项目
mvn eclipse:eclipse
#生成idea项目
mvn idea:idea
```





