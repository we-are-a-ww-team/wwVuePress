# Mybatis

## Mybatis基本语法

## MybatisPlus

### SpringBoot引入MybatisPlus

分页

```xml
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

```java
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

```java
package com.wykd.user.model;

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
@Data
public class UserModel implements Serializable {

    //标记数据表主键
    @TableId(value = "id", type = IdType.AUTO)
    private int id;
    private String username;
    private String password;
}

```

```java
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

```java
package com.wykd.user.controller;

/**
 * 功能：
 * Created by [Alex]
 * 2020/4/8 11:03
 */
import com.baomidou.mybatisplus.plugins.Page;
import com.wykd.oppo.model.UserModel;
import com.wykd.oppo.user.ce.UserService;
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

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org/DTD Mapper 3.0" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<!-- 指明当前xml对应的Mapper -->
<mapper namespace="com.wykd.user.mapper.UserMapper">
    <select id="listCount" resultType="Integer">
        select count(*) from user_info;
    </select>
</mapper>

```

```yml
server:
  port: 12000
spring:
  application:
    name: javademo-tyh-service-base
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
    url: jdbc:mysql://localhost:3306/mydb?useUnicode=true&characterEncoding=utf8
    username: root
    password: root



#mybatis plus
mybatis-plus:
  mapper-locations: classpath*:/mapper/**Mapper.xml
  typeAliasesPackage: javademo.tyh.model.base;javademo.tyh.model.hotel;
  global-config:
    id-type: 0
    field-strategy: 2
    db-column-underline: true
    refresh-mapper: false

```

```xml
generator.jdbc.driver=com.mysql.jdbc.Driver
generator.jdbc.url=jdbc:mysql://localhost:3306/mydb?useUnicode=true&characterEncoding=utf8
generator.jdbc.username=root
generator.jdbc.password=root

```

```java
@SpringBootApplication
@MapperScan("com.wykd.user.mapper")
public class ProjSpringbootMybatisPlusApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjSpringbootMybatisPlusApplication.class, args);
    }

}
```



```java
@Configuration
public class MybatisPlusConfig {


    @Bean
    @ConditionalOnClass(value = {PaginationInterceptor.class})
    public PaginationInterceptor paginationInterceptor(){
        return new PaginationInterceptor();
    }


}
```

### **代码生成器**

code-generate

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

### 开启mapper文件热部署

https://blog.csdn.net/Tomorrow_csdn/article/details/105615364

### sql打印

https://blog.csdn.net/xiaocy66/article/details/83309903

## HandWritten-Mybatis

### 入口类：

```java


import java.util.List;

import com.alibaba.fastjson.JSON;
import com.wykd.config.WConfiguration;
import com.wykd.dao.IUserDao;
import com.wykd.proxy.DynamicProxy;
import com.wykd.sqlsession.WSqlSession;
import com.wykd.sqlsession.WSqlSessionFactory;
import com.wykd.vo.User;

public class TestMybatis {

	
	public static void main(String[] args) {
		new TestMybatis().test01();
	}
	
	/**
	 * ibatis测试
	 */
	public void test01() {
		WConfiguration config = new WConfiguration();
		WSqlSession sqlSession = WSqlSessionFactory.openSession(config);
		List<User> list = sqlSession.selectList("com.wykd.dao.IUserDao.getUserList", null);
		System.out.println(JSON.toJSON(list));
	}
	
	/**
	 * Mybatis测试
	 */
	public void test02() {
		WConfiguration config = new WConfiguration();
		WSqlSession sqlSession = WSqlSessionFactory.openSession(config);
		DynamicProxy proxy = new DynamicProxy(sqlSession);
		
		
		IUserDao userDao = (IUserDao) proxy.getInstance(IUserDao.class);
		List<User> list = userDao.getUserList();
		System.out.println(JSON.toJSON(list));
		
	}
}

```

### 配置

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>
    <groupId>com.wykd</groupId>
    <version>1.0-SNAPSHOT</version>
    <artifactId>ww-handwritten-mybatis</artifactId>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.11</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.68</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.48</version>
        </dependency>

        <dependency>
            <groupId>dom4j</groupId>
            <artifactId>dom4j</artifactId>
            <version>1.6.1</version>
        </dependency>
    </dependencies>

</project>
```

userMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "mybatis-3-mapper.dtd" >
<mapper namespace="com.wykd.dao.IUserDao">

    <select id="selectUsers" parameterType="com.wykd.vo.User">
       	select * from sec_user
    </select>
    
    
    <select id="selectUserById" parameterType="com.wykd.vo.User">
       	select * from sec_user where id = 1
    </select>
    
</mapper>
```

jdbc.properties

```properties
db.driverClass=com.mysql.jdbc.Driver
db.url=jdbc:mysql://120.24.87.121:3307/wang?useSSL=false
db.username=root
db.password=root

```

### Configuration

Configuration类

```java
package com.wykd.config;

import java.io.File;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class WConfiguration {

	//将连接数据库信息放到WConfiguration中
	
	//将接口，对应的mapper放到WConfiguration中
	private Map<String,WMapper> batisMapper = new HashMap<String,WMapper>();
	
	
	public WConfiguration() {
		doScanMapper();
	}
	
	/**
	 * 扫描 xml文件，将信息保存在batisMapper中
	 */
	public void doScanMapper() {
		
		
//		scanPackageClass("");
		
		WMapper mapper01 = new WMapper();
		mapper01.setMethodId("com.wykd.dao.IUserDao");
		mapper01.setNamespace("getUserList");
		mapper01.setSql("select * from sec_user");
		mapper01.setReturnType("com.wykd.vo.User");
		batisMapper.put("com.wykd.dao.IUserDao.getUserList", mapper01);
		
		
		WMapper mapper02 = new WMapper();
		mapper02.setMethodId("com.wykd.dao.IUserDao");
		mapper02.setNamespace("selectUserById");
		mapper02.setSql("select * from sec_user where id = 1");
		mapper02.setReturnType("com.wykd.vo.User");
		batisMapper.put("com.wykd.dao.IUserDao.selectUserById", mapper02);
	}

	public Map<String, WMapper> getBatisMapper() {
		return batisMapper;
	}
	
	private void scanPackageClass(String packagePath) {
		
		packagePath = packagePath.replaceAll("\\.", "/");
//		System.out.println(packagePath);
		URL url = this.getClass().getClassLoader().getResource(packagePath);
//		System.out.println(url.getFile());
		
		File packageFile = new File(url.getFile());
		File[] files = packageFile.listFiles();
		for (int i = 0; i < files.length; i++) {
			File file = files[i];
			if(!file.isDirectory()) {
				
//				System.out.println("扫描的文件名为："+packagePath +"/"+ file.getName());
				
				String absolutePaht = (packagePath +"/"+ file.getName())
						.replaceAll("/", "\\.")
						.replaceAll(".class", "");
				
				
//				System.out.println("扫描的文件名为======================>"+absolutePaht);
				
			}else {
				scanPackageClass(packagePath +"/"+ file.getName());
			}
		}
		
		
	}
	
	
}

```

Mapping类

```java
package com.wykd.config;

public class WMapper {

	private String namespace ;
	
	private String methodId ;
	
	private String sql;
	
	private String returnType;

	public String getNamespace() {
		return namespace;
	}

	public void setNamespace(String namespace) {
		this.namespace = namespace;
	}

	public String getMethodId() {
		return methodId;
	}

	public void setMethodId(String methodId) {
		this.methodId = methodId;
	}

	public String getSql() {
		return sql;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}

	public String getReturnType() {
		return returnType;
	}

	public void setReturnType(String returnType) {
		this.returnType = returnType;
	}
	
}

```

### Proxy

```java
package com.wykd.proxy;

import java.lang.reflect.Proxy;

import com.wykd.config.WConfiguration;
import com.wykd.dao.IUserDao;
import com.wykd.sqlsession.WSqlSession;

public class DynamicProxy {

	private  WSqlSession sqlSession ;
	
	public DynamicProxy() {
		
	}
	
	public DynamicProxy(WSqlSession sqlSession ) {
		this.sqlSession = sqlSession;
	}
	
	public static void main(String[] args) {
		System.out.println(new DynamicProxy().getClass().getCanonicalName());
	}
	
	public Object getInstance(Class<IUserDao> class1) {
		Object obj = Proxy.newProxyInstance(class1.getClassLoader(), new Class[] {class1}, 
				new MybatisHandler(sqlSession));
		return obj;
	}

	
	
}

```

```java
package com.wykd.proxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.util.Collection;

import com.wykd.config.WConfiguration;
import com.wykd.sqlsession.WSqlSession;

public class MybatisHandler implements InvocationHandler{

	private WSqlSession sqlSession;
	
	
	public MybatisHandler(WSqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
		
		Object ret = null;
		//根据返回的类型，执行sqlSession的方法
		Class<?> clazz = method.getReturnType();
		
		if(Collection.class.isAssignableFrom(clazz)) {
			ret = sqlSession.selectList(method.getDeclaringClass().getName()+"."+method.getName(), args);
		}else {
			ret = sqlSession.selectOne(method.getDeclaringClass().getName()+"."+method.getName(), args);
		}
		return ret;
	}
}

```



### SqlSession

```java
package com.wykd.sqlsession;

import com.wykd.config.WConfiguration;

public class WSqlSessionFactory {

	
	
	public static WSqlSession openSession(WConfiguration config) {
		return new DefaultSqlSession(config);
	}

}

```

```java
package com.wykd.sqlsession;

import java.util.List;

import com.wykd.vo.User;

public interface WSqlSession {

	User selectOne(String statement, Object[] args);
	
	List<User> selectList(String statement, Object[] args);

}

```

```java
package com.wykd.sqlsession;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.wykd.config.WConfiguration;
import com.wykd.config.WMapper;
import com.wykd.vo.User;

public class DefaultSqlSession implements WSqlSession {

	private WExecutor executor = new WExecutor();
	
	private WConfiguration config;
	
	public DefaultSqlSession(WConfiguration config) {
		this.config = config;
	}
	
	
	
	public WConfiguration getConfig() {
		return config;
	}

	public User selectOne(String statement, Object[] args) {
		System.out.println(statement);
		
		
		List<User> list = selectList(statement ,args);
		
		
		return list.get(0);
	}

	public List<User> selectList(String statement,Object[] args) {
		//根据statement解析sql
		Map<String, WMapper> mapper = config.getBatisMapper();
		WMapper wMapper = (WMapper) mapper.get(statement);
		String sql  = wMapper.getSql();
//		ResultSet result = null;
		
		return executor.selectData(sql ,args);
//		try {
//			result = executor.selectData(sql ,args);
//			while(result.next()) {
//				System.out.println(result.getString("username"));
//			}
//		} catch (SQLException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		 //将ResultSet转化成 mapper.xml配置的returnType对象
//		 
//		 
//		 return null;
	}
}

```

```java
package com.wykd.sqlsession;

import java.io.IOException;
import java.io.InputStream;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.PreparedStatement;
import com.wykd.vo.User;

public class WExecutor {
	
	private Properties properties = new Properties(); // 配置文件
	
	private static String url ;
	private static String username ;
	private static String password ;
	private static String driver;
	
	public WExecutor() {
		getScanPackagePath();
	}
	
	
	public <T> List<T> selectData(String sql, Object[] args) {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		List<User> list = new ArrayList();
		try {
			Connection conn = getConn();
			pstmt = (PreparedStatement) conn.prepareStatement(sql);
			rs = pstmt.executeQuery();
			
			list = transform2Object(rs);
			
			return (List<T>) list;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return (List<T>) list;

	}


	private List<User> transform2Object(ResultSet rs) throws SQLException {
		
		List<User> list = new ArrayList();
		
		int col = rs.getMetaData().getColumnCount();
		
		ResultSetMetaData rsmd = rs.getMetaData();
		
//		System.out.println(rsmd.getColumnName(1));
//		System.out.println("============================");
		while (rs.next()) {
			User user = new User();
			for (int i = 1; i <= col; i++) {
//				System.out.print(rs.getString(i) + "\t");
//				
//				if ((i == 2) && (rs.getString(i).length() < 8)) {
//					System.out.print("\t");
//				}
				
				
				if("id".equalsIgnoreCase(rs.getMetaData().getColumnName(i))) {
					user.setId(rs.getInt(i));
				}
				if("username".equalsIgnoreCase(rs.getMetaData().getColumnName(i))) {
					user.setUsername(rs.getString(i));
				}
				if("password".equalsIgnoreCase(rs.getMetaData().getColumnName(i))) {
					user.setPassword(rs.getString(i));
				}
				
				
			}
			list.add(user);
//			System.out.println("");
		}
//		System.out.println("============================");
		
		
		return list;
	}

	private static Connection getConn() {
//		String driver = "com.mysql.jdbc.Driver";
//		String url = "jdbc:mysql://120.78.168.84:3306/wykddb?useSSL=false";
//		String username = "root";
//		String password = "2048";
		Connection conn = null;
		try {
			Class.forName(driver); // classLoader,加载对应驱动
			conn = (Connection) DriverManager.getConnection(url, username, password);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return conn;
	}

	
	
	private void getScanPackagePath() {

		InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream("jdbc.properties");
		try {
			properties.load(inputStream);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		this.driver = properties.getProperty("db.driverClass");
		this.url = properties.getProperty("db.url");
		this.username = properties.getProperty("db.username");
		this.password = properties.getProperty("db.password");
	}
}

```



### Dao

```java
package com.wykd.dao;

import java.util.List;

import com.wykd.vo.User;

public interface IUserDao {

	/**
	 * 
	 * @return
	 */
	public List<User> getUserList();
	
	public  User getUserById();
	
}

```

### VO

```java
package com.wykd.vo;

public class User {
	private int id ;
	private String username ;
	private String password ;
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
}

```



## JDBC

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



## HandWritten-DBPool

> 要点：
>
> 1.创建2个队列，一个空闲连接队列，一个繁忙连接队列
>
> 2.当获取连接时：
>
> ​		2.1 当空闲连接队列为空，且**活跃连接数**<**最大连接数**，则创建新连接。
>
> ​		2.2 当空闲连接不为空，则直接将连接从**空闲连接队列**转移到**繁忙连接队列**。
>
> ​		2.3 若以上2个条件均不满足，则等待连接释放，即空闲连接队列有值时，则从中获取到连接。
>
> 结论：数据库最大连接数始终不超过10个。业务操作执行完后，连接放入空闲队列。

```java
//JDBC连接
package com.wykd.dbpool.pool;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class JDBCUtil {
    public static final String URL = "jdbc:mysql://120.24.87.121:3307/dbpool";
    public static final String USER = "root";
    public static final String PASSWORD = "root";

    static{
        //加载驱动程序
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    /**
     * 创建数据库连接
     */
    public static Connection createConnection(){
        try {
            System.out.println("创建新连接");
            Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            return conn;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}

```

```java
//连接池接口类
package com.wykd.dbpool.pool;

import java.sql.Connection;

public interface DBPool {

    public void setMaxSize(int maxSize) ;

    public void init();

    public void destory();

    public Connection getConnection();

    public void releaseConn(Connection connection);

}

```

```java
//mysql连接池实现类
package com.wykd.dbpool.pool;

import java.sql.Connection;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class MysqlDBPool implements  DBPool {

    Lock lock = new ReentrantLock();

    Lock releaseLock = new ReentrantLock();

    /**
     * 最大连接数
     */
    private int maxSize = 10;

    /**
     * 活跃连接数
     */
    private AtomicInteger activeSize = new AtomicInteger(0);

    /**
     * 空闲连接集合
     */
    LinkedBlockingQueue<Connection> idleList;
    /**
     * 活跃连接集合
     */
    LinkedBlockingQueue<Connection> busyList;

    public void setMaxSize(int maxSize) {
        this.maxSize = maxSize;
    }

    /**
     * 初始化
     */
    public void init() {
        idleList = new LinkedBlockingQueue();
        busyList = new LinkedBlockingQueue();
    }

    /**
     * 销毁
     */
    public void destory() {
    }

    /**
     * 获取连接
     * @return
     */
    public Connection getConnection() {


        try {
            lock.lock();

            System.out.println("1获取连接开始。。。。。。。。。。。。。");

            System.out.println("1当前活跃连接数为：" + activeSize.get());
            System.out.println("1空闲连接数：" + idleList.size());
            System.out.println("1繁忙连接数：" + busyList.size());


            Connection conn = null;

            //idle有值，直接从idle转移到busy
            conn = idleList.poll();
            if (conn != null) {
                busyList.offer(conn);
                activeSize.incrementAndGet();

                System.out.println("1idle有值，直接从idle转移到busy");
                return conn;
            }

            //idle无值，且未达到最大连接数，则创建新的连接
            if (activeSize.get() < maxSize) {
                if (activeSize.incrementAndGet() <= maxSize) {
                    conn = JDBCUtil.createConnection();
                    busyList.offer(conn);

                    System.out.println("1idle无值，且未达到最大连接数，则创建新的连接");
                    return conn;
                }
            }

            //已经达到最大，等待10秒
            try {
                conn = idleList.poll(10, TimeUnit.SECONDS);
                if (conn == null) {
                    throw new RuntimeException("1连接超时！");
                } else {
                    busyList.offer(conn);
                    activeSize.incrementAndGet();

                    System.out.println("1等待十秒内，获得连接！");

                    return conn;
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return conn;
        }catch(Exception e){
            throw new RuntimeException(e);
        }finally{
            System.out.println("1获取连接结束。。。。。。。。。。。。。");
            lock.unlock();
        }
    }

    /**
     * 释放连接，将连接 从busy转移到idle
     */
    public void releaseConn(Connection conn) {


        try {
            releaseLock.lock();

            System.out.println("2释放连接开始。。。。。。。。。。。。。。。。。。");
            System.out.println("2释放连接前，活跃连接数为:"+activeSize.get() +" ==="+ Thread.currentThread().getName());

            busyList.remove(conn);
            idleList.offer(conn);
            activeSize.decrementAndGet();

            System.out.println("2当前活跃连接数为："+activeSize.get() +" ==="+ Thread.currentThread().getName());
            System.out.println("2空闲连接数："+idleList.size() +" ==="+ Thread.currentThread().getName());
            System.out.println("2繁忙连接数："+busyList.size() +" ==="+ Thread.currentThread().getName());
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            System.out.println("2释放连接结束。。。。。。。。。。。。。。。。。。");
            releaseLock.unlock();
        }
    }
}

```

```java
//将mysqlDBPool类注入到spring容器中，同时设置最大连接数。
package com.wykd.dbpool.config;

import com.wykd.dbpool.pool.MysqlDBPool;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DbConfig {
    @Bean
    public MysqlDBPool mysqlDBPool(){
        MysqlDBPool mysqlDBPool = new MysqlDBPool();
        mysqlDBPool.init();
        mysqlDBPool.setMaxSize(10);
        return mysqlDBPool;
    }

}
```

```java
//controller类
package com.wykd.dbpool.controller;

import com.wykd.dbpool.pool.DBPool;
import com.wykd.dbpool.pool.MysqlDBPool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.concurrent.CountDownLatch;

@RestController
public class DbController {

    //模拟并发20
    private CountDownLatch countDownLatch = new CountDownLatch(20);

    @Autowired
    private MysqlDBPool mysqlDBPool;

    @GetMapping("/insert")
    public String insertUser(){

        for (int i = 0; i < 20; i++) {
                new Thread(()->{

                    countDownLatch.countDown();
                    try {
                        countDownLatch.await();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    Connection conn = mysqlDBPool.getConnection();
                    Statement st = null;
                    try {
                        st = conn.createStatement();
                        st.executeUpdate("insert into user(name ,age) values('wang',22)");

                        Thread.sleep(2000);

                    } catch (SQLException e) {
                        e.printStackTrace();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    } finally {
                        try {
                            st.close();
                        } catch (SQLException e) {
                            e.printStackTrace();
                        }
                    }
                    mysqlDBPool.releaseConn(conn);

                }).start();
        }
        return "{\"success\":\"true\"}";
    }
}

```

```
输出结果：

2020-05-03 20:17:10.115  INFO 40572 --- [nio-8091-exec-1] o.a.c.c.C.[.[localhost].[/dbpool]        : Initializing Spring DispatcherServlet 'dispatcherServlet'
2020-05-03 20:17:10.116  INFO 40572 --- [nio-8091-exec-1] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
2020-05-03 20:17:10.120  INFO 40572 --- [nio-8091-exec-1] o.s.web.servlet.DispatcherServlet        : Completed initialization in 4 ms
1当前活跃连接数为：0
1空闲连接数：0
1繁忙连接数：0
创建新连接
Sun May 03 20:17:10 CST 2020 WARN: Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.
idle无值，且未达到最大连接数，则创建新的连接
1当前活跃连接数为：1
1空闲连接数：0
1繁忙连接数：1
创建新连接
Sun May 03 20:17:11 CST 2020 WARN: Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.
idle无值，且未达到最大连接数，则创建新的连接
1当前活跃连接数为：2
1空闲连接数：0
1繁忙连接数：2
创建新连接
Sun May 03 20:17:11 CST 2020 WARN: Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.
idle无值，且未达到最大连接数，则创建新的连接
1当前活跃连接数为：3
1空闲连接数：0
1繁忙连接数：3
创建新连接
Sun May 03 20:17:11 CST 2020 WARN: Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.
idle无值，且未达到最大连接数，则创建新的连接
1当前活跃连接数为：4
1空闲连接数：0
1繁忙连接数：4
创建新连接
Sun May 03 20:17:11 CST 2020 WARN: Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.
idle无值，且未达到最大连接数，则创建新的连接
1当前活跃连接数为：5
1空闲连接数：0
1繁忙连接数：5
创建新连接
Sun May 03 20:17:11 CST 2020 WARN: Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.
idle无值，且未达到最大连接数，则创建新的连接
1当前活跃连接数为：6
1空闲连接数：0
1繁忙连接数：6
创建新连接
Sun May 03 20:17:11 CST 2020 WARN: Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.
idle无值，且未达到最大连接数，则创建新的连接
1当前活跃连接数为：7
1空闲连接数：0
1繁忙连接数：7
创建新连接
Sun May 03 20:17:11 CST 2020 WARN: Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.
idle无值，且未达到最大连接数，则创建新的连接
1当前活跃连接数为：8
1空闲连接数：0
1繁忙连接数：8
创建新连接
Sun May 03 20:17:12 CST 2020 WARN: Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.
idle无值，且未达到最大连接数，则创建新的连接
1当前活跃连接数为：9
1空闲连接数：0
1繁忙连接数：9
创建新连接
Sun May 03 20:17:12 CST 2020 WARN: Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.
idle无值，且未达到最大连接数，则创建新的连接
1当前活跃连接数为：10
1空闲连接数：0
1繁忙连接数：10
释放连接开始！========== ===Thread-31
释放连接前，活跃连接数为:10 ===Thread-31
2当前活跃连接数为：9 ===Thread-31
2空闲连接数：0 ===Thread-31
等待十秒内，获得连接！
2繁忙连接数：10 ===Thread-31
1当前活跃连接数为：10
1空闲连接数：0
1繁忙连接数：10
释放连接开始！========== ===Thread-13
释放连接前，活跃连接数为:10 ===Thread-13
2当前活跃连接数为：9 ===Thread-13
2空闲连接数：0 ===Thread-13
2繁忙连接数：10 ===Thread-13
等待十秒内，获得连接！
1当前活跃连接数为：10
1空闲连接数：0
1繁忙连接数：10
释放连接开始！========== ===Thread-12
释放连接前，活跃连接数为:10 ===Thread-12
2当前活跃连接数为：9 ===Thread-12
2空闲连接数：1 ===Thread-12
2繁忙连接数：9 ===Thread-12
等待十秒内，获得连接！
1当前活跃连接数为：10
1空闲连接数：0
1繁忙连接数：10
释放连接开始！========== ===Thread-14
释放连接前，活跃连接数为:10 ===Thread-14
2当前活跃连接数为：9 ===Thread-14
2空闲连接数：1 ===Thread-14
2繁忙连接数：9 ===Thread-14
等待十秒内，获得连接！
1当前活跃连接数为：10
1空闲连接数：0
1繁忙连接数：10
释放连接开始！========== ===Thread-15
释放连接前，活跃连接数为:10 ===Thread-15
2当前活跃连接数为：9 ===Thread-15
2空闲连接数：1 ===Thread-15
2繁忙连接数：10 ===Thread-15
等待十秒内，获得连接！
1当前活跃连接数为：10
1空闲连接数：0
1繁忙连接数：10
释放连接开始！========== ===Thread-16
释放连接前，活跃连接数为:10 ===Thread-16
2当前活跃连接数为：9 ===Thread-16
2空闲连接数：1 ===Thread-16
2繁忙连接数：9 ===Thread-16
等待十秒内，获得连接！
1当前活跃连接数为：10
1空闲连接数：0
1繁忙连接数：10
释放连接开始！========== ===Thread-17
释放连接前，活跃连接数为:10 ===Thread-17
2当前活跃连接数为：9 ===Thread-17
2空闲连接数：1 ===Thread-17
2繁忙连接数：9 ===Thread-17
等待十秒内，获得连接！
1当前活跃连接数为：10
1空闲连接数：0
1繁忙连接数：10
释放连接开始！========== ===Thread-18
释放连接前，活跃连接数为:10 ===Thread-18
2当前活跃连接数为：9 ===Thread-18
等待十秒内，获得连接！
2空闲连接数：0 ===Thread-18
2繁忙连接数：10 ===Thread-18
1当前活跃连接数为：10
1空闲连接数：0
1繁忙连接数：10
释放连接开始！========== ===Thread-19
释放连接前，活跃连接数为:10 ===Thread-19
2当前活跃连接数为：9 ===Thread-19
2空闲连接数：1 ===Thread-19
2繁忙连接数：10 ===Thread-19
等待十秒内，获得连接！
1当前活跃连接数为：10
1空闲连接数：0
1繁忙连接数：10
释放连接开始！========== ===Thread-20
释放连接前，活跃连接数为:10 ===Thread-20
2当前活跃连接数为：9 ===Thread-20
2空闲连接数：0 ===Thread-20
2繁忙连接数：10 ===Thread-20
等待十秒内，获得连接！
释放连接开始！========== ===Thread-21
释放连接前，活跃连接数为:10 ===Thread-21
2当前活跃连接数为：9 ===Thread-21
2空闲连接数：1 ===Thread-21
2繁忙连接数：9 ===Thread-21
释放连接开始！========== ===Thread-22
释放连接前，活跃连接数为:9 ===Thread-22
2当前活跃连接数为：8 ===Thread-22
2空闲连接数：2 ===Thread-22
2繁忙连接数：8 ===Thread-22
释放连接开始！========== ===Thread-23
释放连接前，活跃连接数为:8 ===Thread-23
2当前活跃连接数为：7 ===Thread-23
2空闲连接数：3 ===Thread-23
2繁忙连接数：7 ===Thread-23
释放连接开始！========== ===Thread-24
释放连接前，活跃连接数为:7 ===Thread-24
2当前活跃连接数为：6 ===Thread-24
2空闲连接数：4 ===Thread-24
2繁忙连接数：6 ===Thread-24
释放连接开始！========== ===Thread-25
释放连接前，活跃连接数为:6 ===Thread-25
2当前活跃连接数为：5 ===Thread-25
2空闲连接数：5 ===Thread-25
2繁忙连接数：5 ===Thread-25
释放连接开始！========== ===Thread-26
释放连接前，活跃连接数为:5 ===Thread-26
2当前活跃连接数为：4 ===Thread-26
2空闲连接数：6 ===Thread-26
2繁忙连接数：4 ===Thread-26
释放连接开始！========== ===Thread-27
释放连接前，活跃连接数为:4 ===Thread-27
2当前活跃连接数为：3 ===Thread-27
2空闲连接数：7 ===Thread-27
2繁忙连接数：3 ===Thread-27
释放连接开始！========== ===Thread-28
释放连接前，活跃连接数为:3 ===Thread-28
2当前活跃连接数为：2 ===Thread-28
2空闲连接数：8 ===Thread-28
2繁忙连接数：2 ===Thread-28
释放连接开始！========== ===Thread-29
释放连接前，活跃连接数为:2 ===Thread-29
2当前活跃连接数为：1 ===Thread-29
2空闲连接数：9 ===Thread-29
2繁忙连接数：1 ===Thread-29
释放连接开始！========== ===Thread-30
释放连接前，活跃连接数为:1 ===Thread-30
2当前活跃连接数为：0 ===Thread-30
2空闲连接数：10 ===Thread-30
2繁忙连接数：0 ===Thread-30

```



## Druid连接池

## Mybatis语句

### 查询近2天的数据

```
<![CDATA[
   and t2.created_time < DATE_SUB(now(), interval 24 hour)
]]>
```

### Mybatis批量操作

批量更新信息

```xml
 
<!-- 批量更新信息 -->
    <update id="updateScoreList">
        update table_1
        <trim prefix="set" suffixOverrides=",">
            <trim prefix="updated_time = now(),name =case" suffix="end,">
                <foreach collection="list" item="item" index="index">
                    <if test="item.id != null">
                        when id=#{item.id} then #{item.name}
                    </if>
                </foreach>
            </trim>
        </trim>
        where id in
        <foreach collection="list"  item="item" index="index" open="(" separator="," close=")">
            #{item.id}
        </foreach>

    </update>
```

批量插入记录

```xml
<!-- 批量插入记录 -->
    <insert id="insertScoreList">
        insert into table_1( name ,created_time,updated_time) values
        <foreach collection="list" item="item" separator=",">
            (#{item.name},now(),now())
        </foreach>
    </insert>
```