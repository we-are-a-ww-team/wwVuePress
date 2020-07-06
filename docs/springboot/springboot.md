# Springboot

## 源码解读

### 内嵌tomcat

### autoconfigure原理

## SPI机制

## HandWritten-SpringBootStarter



## RestTemplate发送Http请求

```java

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

public class TestRestTemplate {

    public static void main(String[] args) {

        try {
            //1 传参
            JSONArray arrParam = new JSONArray();
            JSONObject objParam = new JSONObject();
            objParam.put("id", (int) (Math.random() * 100000));
            objParam.put("hash", "fejflejlfekfljfl");
            arrParam.add(objParam);

            //2 获取http客户端工具restTemplate
            SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
            requestFactory.setConnectTimeout(30 * 1000); //30秒的超时时间
            requestFactory.setReadTimeout(30 * 1000);
            RestTemplate restTemplate = new RestTemplate(requestFactory);

            //3 设置Header
            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType("application/json");
            headers.set("Content-type", "application/json");
//                String authorization = getAuthorizationHead(arrParam.toString());
//                System.out.println("authorization-->"+authorization);
//                headers.set("Authorization",authorization);

            //4 构造HttpEntity
            HttpEntity<String> entity = new HttpEntity<String>(arrParam.toString(), headers);

            //5 发送请求
            String url = "http://localhost:8080/wspringboot/hello";
            ResponseEntity<String> exchange = restTemplate.exchange(url,
                    HttpMethod.POST, entity, String.class);

            System.out.println(JSON.toJSONString(exchange));

            //6 获取响应结果
            String result = exchange.getBody();
            System.out.println("result========>" + result);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```

## 集成mybatisPlus

https://www.cnblogs.com/taiyonghai/p/9284269.html



## Springboot集成shiro

参考：https://www.jianshu.com/p/7f724bec3dc3



## Springboot集成WebSocket

参考：https://blog.csdn.net/qq_35387940/article/details/93483678



## Springboot集成SpringCache

参考：https://blog.csdn.net/chachapaofan/article/details/88829265

## Springboot集成Swagger
参考：https://www.cnblogs.com/hanstrovsky/p/12725112.html