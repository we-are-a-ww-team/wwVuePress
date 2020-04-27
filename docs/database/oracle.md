# Oracle

## Oracle分页

```
SELECT *
  FROM (SELECT a.*, ROWNUM rn
          FROM (SELECT *
                  FROM table_name order by id asc) a
         WHERE ROWNUM <= 40)
 WHERE rn >= 21
```

