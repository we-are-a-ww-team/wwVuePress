



# SpringAOP

## HandWritten-SpringAOP

## AOP+注解

> 新建一个springboot项目

```java
package com.wykd.redis.annotation;

import java.lang.annotation.*;


@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface CacheRemoveAnno {

    String value() default "";

    String key() default "";

    String[] keys() default {};
}

```

```java
package com.wykd.redis.annotation;

import com.alibaba.fastjson.JSON;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.LocalVariableTableParameterNameDiscoverer;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;

@Aspect
@Component
public class CacheRemoveAOP {

    @Pointcut("@annotation(com.wykd.redis.annotation.CacheRemoveAnno)")
    public void LogAspect() {
    }

    @Before("LogAspect()")
    public void deBefore(JoinPoint joinPoint) {
        System.out.println("目标方法名为:" + joinPoint.getSignature().getName());
        System.out.println("目标方法所属类的简单类名:" + joinPoint.getSignature().getDeclaringType().getSimpleName());
        System.out.println("目标方法所属类的类名:" + joinPoint.getSignature().getDeclaringTypeName());
        System.out.println("目标方法声明类型:" + Modifier.toString(joinPoint.getSignature().getModifiers()));
        //获取传入目标方法的参数
        Object[] args = joinPoint.getArgs();
        for (int i = 0; i < args.length; i++) {
            System.out.println("第" + (i + 1) + "个参数为:" + args[i]);
        }
        System.out.println("被代理的对象:" + joinPoint.getTarget());
        System.out.println("代理对象自己:" + joinPoint.getThis());
    }

    @Around("LogAspect()")
    public Object deAround(ProceedingJoinPoint joinPoint) throws Throwable {

        //通过反射，取目标方法对象
        Method method = getMethod(joinPoint);

        // 根据目标方法对象获取注解对象
        CacheRemoveAnno cacheAnnotation = method.getDeclaredAnnotation(CacheRemoveAnno.class);

        // 取得key值
        String spel = cacheAnnotation.key();
		String[] keys = cacheAnnotation.keys();
        
        //从方法中，找出key（spel格式）对应的参数的值
        Object[] args = joinPoint.getArgs();
        System.out.println("args===>"+JSON.toJSONString(args));

        String value = parseSpel(method, args, spel, String.class);
        System.out.println("key（spel格式）==>"+spel+"===参数值==>" + value);

        //执行业务
        Object result = joinPoint.proceed();

        //环绕执行
        System.out.println("after...");

        return result;
    }

    /**
     * 获取目标方法对象
     * @param joinPoint
     * @return
     */
    private Method getMethod(ProceedingJoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();  //
        System.out.println("method.getDeclaringClass().isInterface()==>"+method.getDeclaringClass().isInterface());
        if (method.getDeclaringClass().isInterface()) {
            //接口，则需要通过反射取
            System.out.println("若为接口，则会生成动态代理对象，则需要从动态代理对象中取值！");
            try {
                method = joinPoint
                        .getTarget()  //被代理对象
                        .getClass()
                        .getDeclaredMethod(joinPoint.getSignature().getName(),   //目标方法名
                                method.getParameterTypes());    //参数类型数组
            } catch (SecurityException | NoSuchMethodException e) {
                throw new RuntimeException(e);
            }
        }else{
            System.out.println("若不为接口，代理对象与被代理对象相同！");
        }
        return method;
    }

    private ExpressionParser parser = new SpelExpressionParser();

    private LocalVariableTableParameterNameDiscoverer discoverer = new LocalVariableTableParameterNameDiscoverer();

    private <T> T parseSpel(Method method, Object[] arguments, String spel, Class<T> clazz) {

        String[] params = discoverer.getParameterNames(method);
        EvaluationContext context = new StandardEvaluationContext();
        for (int len = 0; len < params.length; len++) {
            context.setVariable(params[len], arguments[len]);
        }
        try {
            Expression expression = parser.parseExpression(spel);
            return expression.getValue(context, clazz);
        } catch (Exception e) {
//            return defaultResult;
            e.printStackTrace();
        }

        return null;
    }

}
```

```java
package com.wykd.redis.annotation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 功能：
 * Created by [Alex]
 * 2020/5/12 11:53
 */
@RestController
public class CacheController {

    @GetMapping("test")
    @CacheRemoveAnno(value = "cache",key = "#param" ,keys = "{abc,jkfe}")
    public String test(@RequestParam("param") String param){
        return "test";
    }


}
```


