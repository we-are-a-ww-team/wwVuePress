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

> - 1.8编译
> - 设置启动类

```xml

    <build>
        <finalName>springboot-with-docker-0.0.1-SNAPSHOT</finalName>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.0.3.RELEASE</version>
                <configuration>
                    <mainClass>com.dubbo.provider.service.bootstrap.Consumer</mainClass>
                </configuration>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>





```

静态资源访问：

```xml
<build>
<!-- 配置将哪些资源文件(静态文件/模板文件/mapper文件)加载到tomcat输出目录里 -->
        <resources>
            <resource>
                <directory>src/main/java</directory><!--java文件的路径-->
                <includes>
                    <include>**/*.*</include>
                </includes>
                <!-- <filtering>false</filtering>-->
            </resource>
            <resource>
                <directory>src/main/resources</directory><!--资源文件的路径-->
                <includes>
                    <include>**/*.*</include>
                </includes>
                <!-- <filtering>false</filtering>-->
            </resource>
        </resources>
</build>
```

