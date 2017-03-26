/**
 * Created by tianhao on 17-3-26.
 */
var canvasWidth = document.body.offsetWidth;;
var canvasHeight = 300;
var r = 20;
var n=3;
var thcircle = [];
var thSelected=[];
var secondSelected=[];
var canvas = document.getElementById("Lockcanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var thcanvas = canvas.getContext("2d");


window.onload = function (){
    drawCircle(thcanvas,r,3);   //参数为圆的半径,３×３的密码锁
}


function radio_change(){
    var obj  = document.getElementsByName('pwd');
    var notice = document.getElementById("notice");
    for(var i=0;i<obj.length;i++){
        console.log(obj[i].checked);
        if(obj[i].checked==true){
            if(obj[i].value=='setpassword'){
                notice.innerHTML='请输入手势密码';


            }else if(obj[i].value=='testpassword'){
                notice.innerHTML='验证密码';
            }
        }
    }
}


function drawCircle(thcanvas,r,n){
    for(var row = 0; row < n; row++){
        for(var col = 0; col <n; col++){
            // 计算圆心坐标
            var circlePoint = {
                X: (canvasWidth/(n*2) + canvasWidth*col/n),
                Y: (canvasHeight/(n*2) + canvasHeight*row/n)
            };
            thcircle.push(circlePoint);
        }
    }
    for (var i = 0; i < thcircle.length; i++) {
        circlePoint = thcircle[i];
        thcanvas.fillStyle = "#c3c3c3";
        thcanvas.beginPath();
        thcanvas.arc(circlePoint.X, circlePoint.Y, r, 0, Math.PI * 2, true);
        thcanvas.closePath();
        thcanvas.fill();
        thcanvas.fillStyle = "#ffffff";
        thcanvas.beginPath();
        thcanvas.arc(circlePoint.X, circlePoint.Y, r - 3, 0, Math.PI * 2, true);
        thcanvas.closePath();
        thcanvas.fill();


    }
}
function reset(){
    thcircle = [];
    thSelected = [];
    thcanvas.clearRect(0, 0, canvasWidth, canvasHeight);
    drawCircle(thcanvas, r, n);
}

canvas.addEventListener("touchstart", function (e) {
    getSelectPwd(e.touches[0],thSelected,r);
}, false);
canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    var touches = e.touches[0];
    getSelectPwd(touches,thSelected,r);
    thcanvas.clearRect(0,0,canvasWidth,canvasHeight);
    drawLine(thcanvas,thcircle,thSelected,{X:touches.pageX,Y:touches.pageY});
}, false);
canvas.addEventListener("touchend", function (e) {
    thcanvas.clearRect(0,0,canvasWidth,canvasHeight);
    drawLine(thcanvas,thcircle,thSelected,null);
  //  alert("密码结果是："+thSelected.join("->"));
    console.log(localStorage.temp);
    var obj  = document.getElementsByName('pwd');
    if(obj[0].checked==true) {
        if (thSelected.length < 5) {
            document.getElementById("notice").innerHTML = '密码太短，至少需要５个点';
            console.log("密码太短，至少需要５个点" + thSelected);
            reset();
        } else if (typeof localStorage.temp == "undefined") {
            localStorage.temp = thSelected;
            document.getElementById("notice").innerHTML = "请再次输入手势密码";
            console.log("请再次输入手势密码" + thSelected);
            reset();
        }
        else if (localStorage.temp == thSelected) {
            localStorage.pwd = thSelected;
            document.getElementById("notice").innerHTML = "密码设置成功";
            reset();
            localStorage.removeItem("temp");
        } else {
            document.getElementById("notice").innerHTML = "两次输入不一致</br>请重置";
            reset();
            localStorage.removeItem("temp");
        }
    }else if(obj[1].checked==true){
        console.log(localStorage.pwd);
        if(localStorage.pwd == thSelected){
            document.getElementById("notice").innerHTML = "密码正确！";
            reset();
        }else{
            document.getElementById("notice").innerHTML = "输入的密码不正确";
            reset();
        }
    }else{
        document.getElementById("notice").innerHTML = "请选中";
    }
}, false);
function getSelectPwd(touches,thSelected,r){
    for (var i = 0; i < thcircle.length; i++) {
        var currentPoint = thcircle[i];
        var xdiff = Math.abs(currentPoint.X - touches.pageX);
        var ydiff = Math.abs(currentPoint.Y - touches.pageY);
        var dir = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
        if(dir > r || thSelected.indexOf(i) >= 0)
            continue;

        thSelected.push(i);

        break;
    }
  //  console.log(thSelected);
}
function drawLine(thcanvas,thcircle,thSelected,touchPoint){
    if (thSelected.length > 0) {
        thcanvas.beginPath();
        for (var i = 0; i < thSelected.length; i++) {
            var pointIndex = thSelected[i];
            thcanvas.lineTo(thcircle[pointIndex].X, thcircle[pointIndex].Y);
        }
        thcanvas.lineWidth = 3;
        thcanvas.strokeStyle = "#ee381d";
        thcanvas.stroke();
        thcanvas.closePath();
        if(touchPoint!=null){
            var lastPointIndex=thSelected[thSelected.length-1];
            var lastPoint=thcircle[lastPointIndex];
            thcanvas.beginPath();
            thcanvas.moveTo(lastPoint.X,lastPoint.Y);
            thcanvas.lineTo(touchPoint.X-r/2,touchPoint.Y-r/2);
            thcanvas.stroke();
            thcanvas.closePath();
        }

    }
    for (var i = 0; i < thcircle.length; i++) {
        var circlePoint = thcircle[i];
        thcanvas.fillStyle = "#c3c3c3";
        thcanvas.beginPath();
        thcanvas.arc(circlePoint.X, circlePoint.Y, r, 0, Math.PI * 2, true);
        thcanvas.closePath();
        thcanvas.fill();
        thcanvas.fillStyle = "#ffffff";
        thcanvas.beginPath();
        thcanvas.arc(circlePoint.X, circlePoint.Y, r - 3, 0, Math.PI * 2, true);
        thcanvas.closePath();
        thcanvas.fill();
        if(thSelected.indexOf(i)>=0){
            thcanvas.fillStyle = "#ee8f18";
            thcanvas.beginPath();
            thcanvas.arc(circlePoint.X, circlePoint.Y, r, 0, Math.PI * 2, true);
            thcanvas.closePath();
            thcanvas.fill();
        }

    }
}