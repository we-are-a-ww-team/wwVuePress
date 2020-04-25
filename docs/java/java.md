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

## JVM内存模型

1. 常量池：存放**字符串常量**和**基本类型常量**（public static final）。
2. 栈（stack）：主要保存**基本数据类型**（char、byte、short、int、long、float、double、boolean）
3. 堆（heap）：用于存储对象（new的对象）

| 属性 | 描述                                                        |
| ---- | ----------------------------------------------------------- |
| -Xms | 初始堆内存                                                  |
| -Xmx | 最大堆内存                                                  |
| -Xss | 每个线程的堆栈大小，根据jvm规范，一个线程默认最大栈大小为1M |



## IO流





## LindedList双向链表的使用
[https://www.cnblogs.com/yijinqincai/p/10964188.html](https://note.youdao.com/)