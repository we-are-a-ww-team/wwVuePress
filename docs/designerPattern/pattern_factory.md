# 工厂模式

> **简单工厂**：准备：工厂是一个普通的类；产品接口类，各产品类。
>
> 举例：根据名字类型获取对象。传参xiaomi,获取小米手机，传参huawei，获取华为手机
>
> 经典例子：BeanFactory是在调用getBean后创建，ApplicationContext是调用getBean前创建
>
> 
>
> **工厂方法**：准备：工厂是一个接口类，有一个创建产品的方法；不同产品的工厂都实现工厂接口，各自生产各自的产品。（与简单工厂的区别是，要什么产品就new什么工厂。）
>
> 举例：苹果手机工厂生产苹果，小米手机工厂生产小米。
>
> 
>
> **抽象工厂**：准备：工厂是一个抽象类，定义了一套方法。不同品牌的工厂创建自己品牌的产品。
>
> 举例：电脑工厂需要生产一套产品，包括键盘，鼠标等。同时，品牌有华硕，联想等。
>
> 创建一个抽象工厂，定义创建键盘，创建鼠标方法。华硕工厂生产华硕的鼠标，键盘。联想工厂生产华硕的键盘，鼠标。同时创建键盘接口类，鼠标接口类；
>
> 弊端：要增加创建主机的方法，得更改抽象工厂类。





## 简单工厂模式

```java
package com.wykd.pattern.simplefactory;

public interface Phone {

    String getPhoneCompnayName();

}


class HuaweiPhone implements  Phone{

    public String getPhoneCompnayName() {
        return "华为公司";
    }
}

class XiaomiPhone implements  Phone{
    public String getPhoneCompnayName() {
        return "小米公司";
    }
}

class ApplePhone implements  Phone{
    public String getPhoneCompnayName() {
        return "苹果公司";
    }
}

class SimpleFactory {

    public Phone getPhone(String type){

        if(type.equals("xiaomi")){
            return new XiaomiPhone();
        }else  if(type.equals("huawei")){
            return new HuaweiPhone();
        }else  if(type.equals("apple")){
            return new ApplePhone();
        }
        return null;
    }


}

class TestSimpleFactory {

    public static void main(String[] args) {

        SimpleFactory simpleFactory = new SimpleFactory();
        Phone phone = simpleFactory.getPhone("xiaomi");
        System.out.println(phone.getPhoneCompnayName());

    }
}

```



## 工厂方法模式

## 抽象工厂模式

