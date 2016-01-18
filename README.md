lCalendar v0.4移动端日期时间选择控件
==========
纯原生js的移动端日期插件，不依赖任何库，体积非常小只有10k
##用法
直接在html页面中引入input标签，绑定三种事件可调出不同的样式插件，对应说明为：`editDate(event)` 呼出日期选择、`editTime(event)`呼出时间选择、`editDateTime(event)`呼出日期时间选择，此外提供`data-hl-calendar`控制最小日期和最大日期：
```
...
<input type="text" readonly="" name="input_date" placeholder="请输入日期" onClick="editDate(event);" data-hl-calendar="2000-01-01,2018-01-29" />
...
```
样式文件记得引入到页面中：
```
...
<link rel="stylesheet" href="lCalendar.css">
...
```
不要忘了引入js文件到页面中：
```
...
<script src="lCalendar.js"></script>
...
```
欢迎来我的博客留言讨论：http://www.cnblogs.com/xfhxbb/p/lCalendar.html
