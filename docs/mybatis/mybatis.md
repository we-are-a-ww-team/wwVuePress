# Mybatis

## Mybatis基本语法

## MybatisPlus

分页



```
<dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>2.3</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.1.10</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.9</version>
        </dependency>
```

```
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public int insert(UserModel model) {
        return userMapper.insert(model);
    }

    public int delete(int id) {
        return userMapper.deleteById(id);
    }

    public int update(UserModel model) {
        //更新全部字段，但可以跟application.yml中的field-strategy字段策略相配合，不更新为null或为空的字段
        return userMapper.updateById(model);
        //更新全部字段，且不可为NULL
        //return mapper.updateAllColumnById(model);
    }

    public UserModel get(int id) {
        return userMapper.selectById(id);
    }

    public List<UserModel> list() {
        EntityWrapper ew = new EntityWrapper();
        ew.where("1={0}", 1);
        return userMapper.selectList(ew);
    }

    //调用自定义方法
    public int listCount() {
        return userMapper.listCount();
    }


    public Page getUserPage() {
        Page<UserModel> userPage = new Page<UserModel>(1, 5);//参数一是当前页，参数二是每页个数
        List<UserModel> userList = userMapper.selectPage(userPage, null);
        userPage.setRecords(userList);
        return userPage;
    }


}
```

```
package com.wykd.oppo.user.model;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.enums.IdType;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 功能：
 * Created by [Alex]
 * 2020/4/8 11:00
 */
@TableName("user_info")
public class UserModel implements Serializable {

    //标记数据表主键
    @TableId(value = "id", type = IdType.AUTO)
    private int id;
    private String username;
    private String password;
//    private int sex;
//    private int age;
//    private LocalDateTime createTime;
//    //标记数据表中不存在的字段
//    @TableField(exist = false)
//    private String showName;
//    //标记数据表中的column名
//    @TableField("username")
//    private String showUsername;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

//    public int getSex() {
//        return sex;
//    }
//
//    public void setSex(int sex) {
//        this.sex = sex;
//    }
//
//    public int getAge() {
//        return age;
//    }
//
//    public void setAge(int age) {
//        this.age = age;
//    }
//
//    public LocalDateTime getCreateTime() {
//        return createTime;
//    }
//
//    public void setCreateTime(LocalDateTime createTime) {
//        this.createTime = createTime;
//    }
//
//    public String getShowName() {
//        return showName;
//    }
//
//    public void setShowName(String showName) {
//        this.showName = showName;
//    }
//
//    public String getShowUsername() {
//        return showUsername;
//    }
//
//    public void setShowUsername(String showUsername) {
//        this.showUsername = showUsername;
//    }
}

```

```
/**
 * 功能：
 * Created by [Alex]
 * 2020/4/8 10:59
 */
@Mapper
public interface UserMapper extends BaseMapper<UserModel> {
    //自定义方法
    int listCount();
}

```

```
package com.wykd.oppo.user.controller;

/**
 * 功能：
 * Created by [Alex]
 * 2020/4/8 11:03
 */
import com.baomidou.mybatisplus.plugins.Page;
import com.wykd.oppo.user.model.UserModel;
import com.wykd.oppo.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("/user")
public class UserController {


    @Autowired
    UserService service;

    @ResponseBody
    @RequestMapping("/insert")
    public int insert() {
        UserModel model = new UserModel();
        model.setUsername("taiyonghai");
        model.setPassword("111111");
//        model.setSex(1);
//        model.setAge(30);
//        model.setCreateTime(LocalDateTime.now());
        return service.insert(model);
    }

    @ResponseBody
    @RequestMapping("/delete")
    public int delete(int id) {
        return service.delete(id);
    }

    @ResponseBody
    @RequestMapping("/update")
    public int update() {
        UserModel model = new UserModel();
        model.setId(1);
        model.setUsername("taiyonghai"+LocalDateTime.now());
        model.setPassword("111111");
//        model.setSex(1);
//        model.setAge(30);
        return service.update(model);
    }

    @ResponseBody
    @RequestMapping("/get")
    public UserModel get(int id) {
        return service.get(id);
    }

    @ResponseBody
    @RequestMapping("/list")
    public List<UserModel> list() {
        List<UserModel> list = service.list();
        return list;
    }

    @ResponseBody
    @RequestMapping("/listCount")
    public int listCount() {
        return service.listCount();
    }

    @ResponseBody
    @RequestMapping("/getUserPage")
    public Page getUserPage() {
        return service.getUserPage();
    }
}

```

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org/DTD Mapper 3.0" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<!-- 指明当前xml对应的Mapper -->
<mapper namespace="com.wykd.oppo.user.mapper.UserMapper">
    <select id="listCount" resultType="Integer">
        select count(*) from user_info;
    </select>
</mapper>

```

```

#\u8BBE\u7F6E\u63D0\u4F9B\u7684\u670D\u52A1\u540D
spring:
  application:
    name: javademo-tyh-service-base
  #\u914D\u7F6E\u6570\u636E\u5E93
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
    url: jdbc:mysql://localhost:3306/mydb?useUnicode=true&characterEncoding=utf8
    username: root
    password: root

#\u8BBE\u7F6E\u81EA\u5DF1\u542F\u52A8\u7684\u7AEF\u53E3
server:
  port: 12000




#mybatis plus
mybatis-plus:
  #\u6307\u660Emapper.xml\u626B\u63CF\u4F4D\u7F6E(classpath* \u4EE3\u8868\u7F16\u8BD1\u540E\u7C7B\u6587\u4EF6\u6839\u76EE\u5F55)
  mapper-locations: classpath*:/mapper/**Mapper.xml
  #\u6307\u660E\u5B9E\u4F53\u626B\u63CF(\u591A\u4E2Apackage\u7528\u9017\u53F7\u6216\u8005\u5206\u53F7\u5206\u9694)
  typeAliasesPackage: javademo.tyh.model.base;javademo.tyh.model.hotel;
  global-config:
    #\u4E3B\u952E\u7C7B\u578B 0:\u6570\u636E\u5E93ID\u81EA\u589E, 1:\u7528\u6237\u8F93\u5165ID,2:\u5168\u5C40\u552F\u4E00ID (\u6570\u5B57\u7C7B\u578B\u552F\u4E00ID), 3:\u5168\u5C40\u552F\u4E00ID UUID
    id-type: 0
    #\u5B57\u6BB5\u7B56\u7565(\u62FC\u63A5sql\u65F6\u7528\u4E8E\u5224\u65AD\u5C5E\u6027\u503C\u662F\u5426\u62FC\u63A5) 0:\u5FFD\u7565\u5224\u65AD,1:\u975ENULL\u5224\u65AD,2:\u975E\u7A7A\u5224\u65AD
    field-strategy: 2
    #\u9A7C\u5CF0\u4E0B\u5212\u7EBF\u8F6C\u6362\u542B\u67E5\u8BE2column\u53CA\u8FD4\u56DEcolumn(column\u4E0B\u5212\u7EBF\u547D\u540Dcreate_time\uFF0C\u8FD4\u56DEjava\u5B9E\u4F53\u662F\u9A7C\u5CF0\u547D\u540DcreateTime\uFF0C\u5F00\u542F\u540E\u81EA\u52A8\u8F6C\u6362\u5426\u5219\u4FDD\u7559\u539F\u6837)
    db-column-underline: true
    #\u662F\u5426\u52A8\u6001\u5237\u65B0mapper
    refresh-mapper: false
    #\u6570\u636E\u5E93\u5927\u5199\u547D\u540D\u4E0B\u5212\u7EBF\u8F6C\u6362
    #capital-mode: true


```

```
generator.jdbc.driver=com.mysql.jdbc.Driver
generator.jdbc.url=jdbc:mysql://localhost:3306/mydb?useUnicode=true&characterEncoding=utf8
generator.jdbc.username=root
generator.jdbc.password=root

```

```
@SpringBootApplication
@MapperScan("com.wykd.oppo.user.mapper")
public class ProjSpringbootMybatisPlusApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjSpringbootMybatisPlusApplication.class, args);
    }

}
```



```
@Configuration
public class MybatisPlusConfig {


    @Bean
    @ConditionalOnClass(value = {PaginationInterceptor.class})
    public PaginationInterceptor paginationInterceptor(){
        return new PaginationInterceptor();
    }


}
```

**code-generate**

```java
package com.wykd.oppo;

/**
 * 功能：
 * Created by [Alex]
 * 2020/4/8 11:46
 */

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.InjectionConfig;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.FileOutConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.PackageConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.TemplateConfig;
import com.baomidou.mybatisplus.generator.config.converts.MySqlTypeConvert;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.DbColumnType;
import com.baomidou.mybatisplus.generator.config.rules.DbType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;

/**
 * <p>
 * 代码生成器演示
 * </p>
 */
public class MpGenerator {

    /**
     * <p>
     * MySQL 生成演示
     * </p>
     */
    public static void main(String[] args) {
        AutoGenerator mpg = new AutoGenerator();
        // 选择 freemarker 引擎，默认 Veloctiy
        mpg.setTemplateEngine(new FreemarkerTemplateEngine());

        // 全局配置
        GlobalConfig gc = new GlobalConfig();
        gc.setAuthor("Mht");
        gc.setOutputDir("D:\\workspace\\test\\proj_springboot_mybatis_plus\\src\\main\\java");
        gc.setFileOverride(false);// 是否覆盖同名文件，默认是false
        gc.setActiveRecord(true);// 不需要ActiveRecord特性的请改为false
        gc.setEnableCache(false);// XML 二级缓存
        gc.setBaseResultMap(true);// XML ResultMap
        gc.setBaseColumnList(false);// XML columList
        /* 自定义文件命名，注意 %s 会自动填充表实体属性！ */
        // gc.setMapperName("%sDao");
        // gc.setXmlName("%sDao");
        // gc.setServiceName("MP%sService");
        // gc.setServiceImplName("%sServiceDiy");
        // gc.setControllerName("%sAction");
        mpg.setGlobalConfig(gc);

        // 数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setDbType(DbType.MYSQL);
        dsc.setTypeConvert(new MySqlTypeConvert() {
            // 自定义数据库表字段类型转换【可选】
            @Override
            public DbColumnType processTypeConvert(String fieldType) {
                System.out.println("转换类型：" + fieldType);
                // 注意！！processTypeConvert 存在默认类型转换，如果不是你要的效果请自定义返回、非如下直接返回。
                return super.processTypeConvert(fieldType);
            }
        });
        dsc.setDriverName("com.mysql.jdbc.Driver");
        dsc.setUsername("root");
        dsc.setPassword("root");
        dsc.setUrl("jdbc:mysql://localhost:3306/mydb?useUnicode=true&characterEncoding=utf8");
        mpg.setDataSource(dsc);

        // 策略配置
        StrategyConfig strategy = new StrategyConfig();
        // strategy.setCapitalMode(true);// 全局大写命名 ORACLE 注意
        strategy.setTablePrefix(new String[] { "user_" });// 此处可以修改为您的表前缀
        strategy.setNaming(NamingStrategy.nochange);// 表名生成策略
        strategy.setInclude(new String[] { "user_info" }); // 需要生成的表
        // strategy.setExclude(new String[]{"test"}); // 排除生成的表
        // 自定义实体父类
        // strategy.setSuperEntityClass("com.baomidou.demo.TestEntity");
        // 自定义实体，公共字段
        // strategy.setSuperEntityColumns(new String[] { "test_id", "age" });
        // 自定义 mapper 父类
        // strategy.setSuperMapperClass("com.baomidou.demo.TestMapper");
        // 自定义 service 父类
        // strategy.setSuperServiceClass("com.baomidou.demo.TestService");
        // 自定义 service 实现类父类
        // strategy.setSuperServiceImplClass("com.baomidou.demo.TestServiceImpl");
        // 自定义 controller 父类
        // strategy.setSuperControllerClass("com.baomidou.demo.TestController");
        // 【实体】是否生成字段常量（默认 false）
        // public static final String ID = "test_id";
        // strategy.setEntityColumnConstant(true);
        // 【实体】是否为构建者模型（默认 false）
        // public User setName(String name) {this.name = name; return this;}
        // strategy.setEntityBuilderModel(true);
        mpg.setStrategy(strategy);

        // 包配置
        PackageConfig pc = new PackageConfig();
        pc.setParent("com.mht.springbootmybatis");
//        pc.setModuleName("test");
        mpg.setPackageInfo(pc);

        // 注入自定义配置，可以在 VM 中使用 cfg.abc 【可无】
//        InjectionConfig cfg = new InjectionConfig() {
//            @Override
//            public void initMap() {
//                Map<String, Object> map = new HashMap<String, Object>();
//                map.put("abc", this.getConfig().getGlobalConfig().getAuthor() + "-mp");
//                this.setMap(map);
//            }
//        };
//
//        // 自定义 xxList.jsp 生成
//        List<FileOutConfig> focList = new ArrayList<>();
//        focList.add(new FileOutConfig("/template/list.jsp.vm") {
//            @Override
//            public String outputFile(TableInfo tableInfo) {
//                // 自定义输入文件名称
//                return "D://my_" + tableInfo.getEntityName() + ".jsp";
//            }
//        });
//        cfg.setFileOutConfigList(focList);
//        mpg.setCfg(cfg);
//
//        // 调整 xml 生成目录演示
//        focList.add(new FileOutConfig("/templates/mapper.xml.vm") {
//            @Override
//            public String outputFile(TableInfo tableInfo) {
//                return "/develop/code/xml/" + tableInfo.getEntityName() + ".xml";
//            }
//        });
//        cfg.setFileOutConfigList(focList);
//        mpg.setCfg(cfg);
//
//        // 关闭默认 xml 生成，调整生成 至 根目录
//        TemplateConfig tc = new TemplateConfig();
//        tc.setXml(null);
//        mpg.setTemplate(tc);

        // 自定义模板配置，可以 copy 源码 mybatis-plus/src/main/resources/templates 下面内容修改，
        // 放置自己项目的 src/main/resources/templates 目录下, 默认名称一下可以不配置，也可以自定义模板名称
        // TemplateConfig tc = new TemplateConfig();
        // tc.setController("...");
        // tc.setEntity("...");
        // tc.setMapper("...");
        // tc.setXml("...");
        // tc.setService("...");
        // tc.setServiceImpl("...");
        // 如上任何一个模块如果设置 空 OR Null 将不生成该模块。
        // mpg.setTemplate(tc);

        // 执行生成
        mpg.execute();

        // 打印注入设置【可无】
//        System.err.println(mpg.getCfg().getMap().get("abc"));
    }

}

```



## Jdbc

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DbUtil {

    public static final String URL = "jdbc:mysql://localhost:3306/mysql";
    public static final String USER = "root";
    public static final String PASSWORD = "123456";

    public static void main(String[] args) throws Exception {
        //1.加载驱动程序
        Class.forName("com.mysql.jdbc.Driver");
        //2. 获得数据库连接
        Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
        //3.操作数据库，实现增删改查
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT user_name, age FROM imooc_goddess");
        //如果有数据，rs.next()返回true
        while(rs.next()){
            System.out.println(rs.getString("user_name")+" 年龄："+rs.getInt("age"));
        }
    }
}
```



## 手写连接池

## Druid连接池