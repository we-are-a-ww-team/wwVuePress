# WebFlux

> 非阻塞（同步/异步） 
>
> 不再需要依赖servlet容器





> Mono 单数据集合
>
> Flux 多数据集合

```java
 /**
     * 单数据集合
     * @return
     */
    @GetMapping("mono3")
    public Mono<String> mono3() {

        // 执行顺序  11111  ->  33333  ->  22222
        System.out.println("11111");

        Mono mono =  Mono.fromSupplier(()->{
            System.out.println("22222");
            return "hello world fromSupplier";
        });


        System.out.println("33333");
        return mono;
    }
```

