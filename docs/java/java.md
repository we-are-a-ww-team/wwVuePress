# Java基础

## String

**"=="与equals的区别**

> - “==” 用于比较基本数据类型时比较的是值，用于比较引用类型时比较的是引用指向的地址。 
> - Object 中的equals() 与 “==” 的作用相同，但String类重写了equals()方法，比较的是对象中的内容。

```
String s1 = "hello"; 
String s2 = "hello";
System.out.println(s1==s2);

输出：true
jvm在内存中查找是否有hello这个值，如有，将会把s2的头指针指向已存在的hello值。
运行时JVM(JAVA虚拟机)则认为这两个变量赋的是同一个对象，所以返回true
```

```
String s1 = new String("hello");
String s2 = new String("hello");
System.out.println(s1==s2);

输出：false
new出来的字符串，不管内存中本来有没有hello值，都会新建一块内存，把hello存进去。
s1,s2内容相同,内存地址不同，返回false
```

```
String str1 = "a" + "b";//常量池中的对象
String str2 = "ab";		//常量池中的对象
String str3 = a + b; 	//在堆上创建的新的对象     

System.out.println(str1 == str2);//true
System.out.println(str1 == str3);//false 
```

String重写equals源码如下：

```
public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    }
    if (anObject instanceof String) {
        String anotherString = (String)anObject;
        int n = value.length;
        if (n == anotherString.value.length) {
            char v1[] = value;
            char v2[] = anotherString.value;
            int i = 0;
            while (n-- != 0) {
                if (v1[i] != v2[i])  //对比字符串的每个字符是否相同,不同则返回false
                    return false;
                i++;
            }
            return true;
        }
    }
    return false;
}
```



## LindedList双向链表的使用
[https://www.cnblogs.com/yijinqincai/p/10964188.html](https://note.youdao.com/)



## 编码解码Encoding

```java
package com.wykd.encoding;

import com.alibaba.fastjson.JSON;

import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;

public class TestEncoding {

	public static void main(String[] args) {

		try {
			System.out.println("-----------------ASCII定义的128个字符中，a的十进制码为97，A的十进制码为65");
			byte[] aaa = new byte[0];
			aaa = "aA".getBytes("utf-8");
			for (int j = 0; j < aaa.length ; j++) {
				System.out.print(aaa[j]+" ");
			}
			System.out.println("");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		//默认编码格式
		System.out.println("---------------------");
		System.out.println(Charset.defaultCharset().name()+"   <======默认编码");
		System.out.println(System.getProperty("file.encoding"));

		try {
			System.out.println("-----------------------");
			System.out.println("国".getBytes("ISO-8859-1").length+"   <======一个中文字ISO-8859-1编码 占用1个字节");
			System.out.println("国".getBytes("GBK").length+"   <======一个中文字GBK编码占2个字节");
			System.out.println("国".getBytes("UTF-8").length+"   <======一个中文字UTF-8编码占3个字节");
			//结论：一个中文字，ISO-8859-1 占用1个字节，GBK占2个字节，UTF-8占3个字节
			
			System.out.println("----------------------- ISO-8859-1编码 ，1个中文占1个字节");
			byte[] guo = "国".getBytes("ISO-8859-1");
			for (int i = 0; i < guo.length; i++) {
				System.out.print(guo[i]+" ");
			}
			System.out.println("");
			//ISO-8859-1没有中文标准，解码出现乱码
			System.out.println(new String(guo,"ISO-8859-1") +"   <======ISO-8859-1没有中文标准，即使用ISO-8859-1解码,仍然会出现乱码");


			System.out.println("----------------------- GBK编码 ，1个中文占2个字节");

			byte[] guoGbk = "国".getBytes("GBK");
			for (int g = 0; g < guoGbk.length; g++) {
				System.out.print(guoGbk[g]+" ");
			}
			System.out.println("");
			System.out.println(new String(guoGbk,"GBK") +"   <======用GBK解码");
			System.out.println(new String(guoGbk,"UTF-8") +"   <======用utf8解码，出现乱码");

			System.out.println("----------------------- UTF-8编码，1个中文占3个字节");
			byte[] guo2 = "国".getBytes("UTF-8");
			for (int i = 0; i < guo2.length; i++) {
				System.out.print(guo2[i]+" ");
			}
			System.out.println("");
			//ISO-8859-1没有中文标准，解码出现乱码
			System.out.println(new String(guo2,"UTF-8")+"   <======用UTF-8解码");
			System.out.println(new String(guo2,"GBK")+"   <======用GBK解码，出现乱码");
			
			System.out.println("----------------------- ");
			String str = new String("国".getBytes("UTF-8"),"ISO-8859-1");
			System.out.println(new String(str.getBytes("ISO-8859-1"),"UTF-8") + "   <======先用UTF-8获取字节数组，转换成ISO-8859-1传输;再用ISO-8859-1获取字节数组，转换utf-8，成功得到最终的值!");
			
			
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}

```

```
执行结果如下：

-----------------ASCII定义的128个字符中，a的十进制码为97，A的十进制码为65
97 65 
---------------------
UTF-8   <======默认编码
UTF-8
-----------------------
1   <======一个中文字ISO-8859-1编码 占用1个字节
2   <======一个中文字GBK编码占2个字节
3   <======一个中文字UTF-8编码占3个字节
----------------------- ISO-8859-1编码 ，1个中文占1个字节
63 
?   <======ISO-8859-1没有中文标准，即使用ISO-8859-1解码,仍然会出现乱码
----------------------- GBK编码 ，1个中文占2个字节
-71 -6 
国   <======用GBK解码
��   <======用utf8解码，出现乱码
----------------------- UTF-8编码，1个中文占3个字节
-27 -101 -67 
国   <======用UTF-8解码
鍥�   <======用GBK解码，出现乱码
----------------------- 
国   <======先用UTF-8获取字节数组，转换成ISO-8859-1传输;再用ISO-8859-1获取字节数组，转换utf-8，成功得到最终的值!
```

