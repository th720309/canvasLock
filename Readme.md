## 前端星大作业　　by 田浩 ##


----------


## 前言 ##
> 这次参加360公司的前端星计划，心里是非常兴奋的，360公司真的是我从大一就特别向往的互联网公司，所以对待这次作业的态度不敢有一丝怠慢。
在这里表示一下对月影大神的敬仰，我学习前端时间不长，之前奇舞团特训营由于课业没有机会去北京参加，不过一直跟进网上的视频，真的是非常收益。
可惜这次笔试答的不是很好，大作业也刚完成，无论最后结果如何，过程是很开心的，我也觉得学到了好多。

## 内容 ##
thLock.html
js/thLock.js
js/thLock.min.js

本作业完成品为一个jquery组件。 可自定义canvas宽度和高度以及圆圈数量，选中颜色与线条颜色。


----------
## 具体思路 ##

　  　1.　根据屏幕宽比以及canvasWidth和canvasHeight获得各个圆心点的坐标。
 

```
for(var row = 0; row < n; row++){
    for(var col = 0; col <n; col++){
         // 计算圆心坐标
        var circlePoint = {
              X: (options.canvasWidth/(n*2) + options.canvasWidth*col/n),　　　//根据canvasWidth与n计算x,y坐标
              Y: (options.canvasHeight/(n*2) + options.canvasHeight*row/n)
         };
        thcircle.push(circlePoint);
     }
}
```
      
　　2.  绑定radio 点击事件以及移动端touch事件，判断手指滑动的轨迹，经过两次设置输入确定密码，九宫格圆圈分别对应（０，１，２，３，４，５，６，７，８）,根据勾股定理判断手指是否划过某圆圈。将确定的密码利用localstorage存储，在验证密码的时候获取滑动轨迹与localstorage进行匹配。
 
                   var obj  = document.getElementsByName('pwd');
                //设置密码被选中
                if(obj[0].checked==true) {
                    if (thSelected.length == 0) {
                        reSet();
                    }
                    else if (thSelected.length < 5 && thSelected.length > 0) {
                        notice.innerHTML = '密码太短，至少需要５个点';
                        reSet();
                    } else if (typeof localStorage.temp == "undefined") {
                        localStorage.temp = thSelected;
                        notice.innerHTML = "请再次输入手势密码";
                        reSet();
                    }
                    else if (localStorage.temp == thSelected) {
                        localStorage.pwd = thSelected;
                        notice.innerHTML = "密码设置成功";
                        reSet();
                        localStorage.removeItem("temp");
                    } else {
                        notice.innerHTML = "两次输入不一致</br>请重新设置";
                        reSet();
                        localStorage.removeItem("temp");
                    }
                }
                //验证密码被选中
                else if(obj[1].checked==true){
                    if (thSelected.length == 0) {
                        reSet();
                    } else if(localStorage.pwd == thSelected){
                        notice.innerHTML = "密码正确！";
                        reSet();
                    }else{
                        notice.innerHTML = "输入的密码不正确";
                        reSet();
                    }
               }


通过localstorage的存储值类型和设置密码的匹配，来判断各种可能。
