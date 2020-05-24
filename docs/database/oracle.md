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



## 五星级SQL语句

|                          | **五星级****sql**                                            |
| ------------------------ | ------------------------------------------------------------ |
| 复制字段值               | **如：EX_GDBS_SL_tmp表** **的ywlsh 字段值复制到yxtywlsh 字段中**   update EX_GDBS_SL_tmp t      set yxtywlsh =          (select ywlsh from EX_GDBS_SL_tmp p   where p.sblsh = t.sblsh) |
| 复制一条记录,修改多个列  | **如：复制一条记录，主键改为****490**   insert into   plat_file_upload     (upload_id, SYSTEM)     select upload_id, SYSTEM       from (select '490' upload_id, SYSTEM               from (select *                       from plat_file_upload                      where busi_id = '489'                      order by upload_id desc) C              where rownum = 1) |
| 分页查询                 | **如：****查前****5****条记录**   select rownum, n.*     from (select rownum row01, t.*             from BW_TASK_ASSIGN t            where doc_no = '08-201401593'            order by ta_no) n    where rownum < = 5 |
| 取子表的最新的记录       | **如：取子表最近的一条记录****<****关键：子表的主键取最大，时间最近****>**   select b.*     from bw_task_assign b,          (select b.doc_no, max(b.ta_no) ta_no             from bw_task_assign b, bw_file_task   a            where a.doc_no = b.doc_no            and a.doc_type = 'Q'            group by b.doc_no) c    where b.ta_no = c.ta_no |
| 修改多个字段的值         | **如：修改结果表的tbcxjsrq，jgcsrq的值**   update ex_gdbs_tbcxjg   jg      set (jg.tbcxjsrq,jg.jgcsrq) =          (select sq.tbcxksrq,sq.tbcxksrq             from ex_gdbs_tbcxsq sq            where jg.sblsh = sq.sblsh              and jg.xh = sq.xh)       范例：严格执行where条件，而不是执行set的条件。   UPDATE   BW_BLDG_LICENSE_BOOKS CP1      SET (CP1.LOT_NO, CP1.PARCEL_CODE) =          (select P.LOT_NO, P.PARCEL_CODE             from parcel_code_trans P            WHERE P.PARCEL_NO = CP1.PARCEL_NO)    WHERE exists   (select P1.PARCEL_NO             from parcel_code_trans P1            where P1.PARCEL_NO = CP1.PARCEL_NO            GROUP BY P1.PARCEL_NO           HAVING COUNT(P1.PARCEL_NO) = 1)      and CP1.PARCEL_NO IS NOT NULL; |
| 字符串截取函数           | **如：查询HQJZ20101410-19的子项最大值：****19**   SELECT   MAX(TO_NUMBER(SUBSTR(PROJ_NO,                               instr(PROJ_NO,   '-', -1, 1) + 1,                                 LENGTH(PROJ_NO)))) MAXID     FROM BW_CIVICISM_PROJECT    WHERE PROJ_NO LIKE 'HQJZ20101410-%' |
| 查询外键表               | **如：查找Orcale中有几个表引用了某个特定表主键做为其外键的**   select t.table_name     from user_constraints t    where t.constraint_type = 'R'      and t.r_constraint_name in          (select s.constraint_name             from user_constraints s            where s.table_name = 'BW_FILE_TASK'              and s.constraint_type = 'P') |
| 获取‘-’后的字符长度      | **获取‘****-****’后的字符长度**   select   length(substr(parcel_no, instr(parcel_no, '-') + 1))     from PARCEL_CODE_TRANS    where parcel_no = 'G10401-0658' |
| 替换字段的某个字符       | **将路径的** **f** **改为** **h**   update   bw_file_attach  set  save_path = replace(save_path,'f:','h:')   where save_path like '%f:%' and create_time >   to_date('2016-09-01','YYYY-MM-DD') |
| **获取列表**             | select * from   bw_xkz_modify_log where 1=1         and (status is null or status = '1')           start with old_bus_no = ?      connect by prior new_bus_no =  old_bus_no     order by modify_date |
| sql保留一位小数          | /*     FM ：除空格           9999999.0099：允许小数点左边最大正数为7位，小数点右边最少2位，最多4位，且在第5位进行四舍五入   */    Select   TO_CHAR(123.0233,'FM9999999.0099') FROM DUAL |
| 最高效的删除重复记录方法 | 最高效的删除重复记录方法     DELETE  FROM    EMP E  WHERE  E.ROWID > (SELECT MIN(X.ROWID)    FROM    EMP X  WHERE  X.EMP_NO   = E.EMP_NO); |