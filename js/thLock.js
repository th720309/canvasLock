/**
 * Created by tianhao on 17-3-30.
 */
(function(){
    window.thLock = function (obj) {
            this.canvasWidth = obj.canvasWidth;
            this.canvasHeight = obj.canvasHeight;
            this.radius = obj.radius;
            this.linecolor = obj.linecolor;
            this.circlecolor = obj.circlecolor;
            this.n =3;             　　　　　　　　　　　　　　 //矩阵nxn
            this.thcircle = [];          　　　　　　　　　　　　　　　//存储圆
            this.thSelected=[];           　　　　　　　　　　　　　　 //被选中的圆
            //既然是插件 就不能把要用到的区域写死，应该取参数里传入的区域ID，
            this.notice = document.getElementById("notice");
            this.canvas = document.getElementById("Lockcanvas");
            this.setPwd = document.getElementById("setpassword");
            this.testPwd = document.getElementById("testpassword");
            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
            this.thcanvas = this.canvas.getContext("2d");
            this.drawCircle();
    }

    thLock.prototype = {
            drawCircle: function () {
                var self = this;
                for(var row = 0; row < this.n; row++){
                    for(var col = 0; col < this.n; col++){
                        // 计算圆心坐标
                        var circlePoint = {
                            X: (this.canvasWidth/(this.n*2) + this.canvasWidth*col/this.n),　　　//根据canvasWidth与n计算x,y坐标
                            Y: (this.canvasHeight/(this.n*2) + this.canvasHeight*row/this.n)
                        };
                        this.thcircle.push(circlePoint);
                    }
                }
                //console.log(thcircle);
                for (var i = 0; i < this.thcircle.length; i++){
                    circlePoint = this.thcircle[i];
                    this.thcanvas.fillStyle = "#c3c3c3";
                    this.thcanvas.beginPath();
                    this.thcanvas.arc(circlePoint.X, circlePoint.Y, this.radius, 0, Math.PI * 2, true);
                    this.thcanvas.closePath();
                    this.thcanvas.fill();
                    this.thcanvas.fillStyle = "#ffffff";
                    this.thcanvas.beginPath();
                    this.thcanvas.arc(circlePoint.X, circlePoint.Y, this.radius - 3, 0, Math.PI * 2, true);
                    this.thcanvas.closePath();
                    this.thcanvas.fill();
                }

                this.setPwd.addEventListener("click",function () {
                    self.testPwd.checked = false;
                    self.notice.innerHTML = "请输入手势密码";
                },false);

                this.testPwd.addEventListener("click",function () {
                    self.setPwd.checked = false;
                    self.notice.innerHTML = "验证密码";
                },false);

                this.canvas.addEventListener("touchstart", function (e) {
                    self.choosePwd(e.touches[0],self.thSelected,self.radius);
                }, false);


                this.canvas.addEventListener("touchmove", function (e) {
                    e.preventDefault();
                    self.choosePwd(e.touches[0],self.thSelected,self.radius);
                    self.thcanvas.clearRect(0,0,self.canvasWidth,self.canvasHeight);
                    self.drawLine(self.thcanvas,self.thcircle,self.thSelected,{　X:e.touches[0].pageX,　Y:e.touches[0].pageY　});
                }, false);


                this.canvas.addEventListener("touchend", function (e) {
                    self.thcanvas.clearRect(0,0,self.canvasWidth,self.canvasHeight);
                    self.drawLine(self.thcanvas,self.thcircle,self.thSelected,null);
                    var obj  = document.getElementsByName('pwd');
                    //设置密码被选中
                    //这个地方用switch case 然后把判断的结果用变量保存一下 便于修改
                    if(self.setPwd.checked==true) {
                        if (self.thSelected.length == 0) {
                            self.reSet();
                        }
                        else if (self.thSelected.length < 5 && self.thSelected.length > 0) {
                            self.notice.innerHTML = '密码太短，至少需要５个点';
                            self.reSet();
                        } else if (typeof localStorage.temp == "undefined") {
                            localStorage.temp = self.thSelected;
                            self.notice.innerHTML = "请再次输入手势密码";
                            self.reSet();
                        }
                        else if (localStorage.temp == self.thSelected) {
                            localStorage.pwd = self.thSelected;
                            self.notice.innerHTML = "密码设置成功";
                            self.reSet();
                            localStorage.removeItem("temp");
                        } else {
                            self.notice.innerHTML = "两次输入不一致</br>请重新设置";
                            self.reSet();
                            localStorage.removeItem("temp");
                        }
                    }
                    //验证密码被选中
                    else if(self.testPwd.checked==true){
                        if (self.thSelected.length == 0) {
                            self.reSet();
                        } else if(localStorage.pwd == self.thSelected){
                            self.notice.innerHTML = "密码正确！";
                            self.reSet();
                        }else{
                            self.notice.innerHTML = "输入的密码不正确";
                            self.reSet();
                        }
                    }
                }, false);
            },

            reSet: function () {
                this.thcircle = [];
                this.thSelected = [];
                this.thcanvas.clearRect(0, 0, this.canvasWidth,this.canvasHeight);
                this.drawCircle(this.thcanvas, this.radius, this.n);
            },

            choosePwd: function (touches,thSelected,r) {
                for (var i = 0; i < this.thcircle.length; i++) {
                    //console.log(thcircle[i]);
                    var circlePoint = this.thcircle[i];
                    var shiftx = Math.abs(circlePoint.X - touches.pageX + (document.body.offsetWidth-this.canvasWidth)/2);
                    var shifty = Math.abs(circlePoint.Y - touches.pageY + 20);
                    var shift = Math.pow((shiftx * shiftx + shifty * shifty), 0.5);　　　//勾股定理
                    if(shift > r || thSelected.indexOf(i) >= 0) continue;
                    thSelected.push(i);
                    break;
                }
            },

            drawLine: function (thcanvas,thcircle,thSelected,touchPoint) {
                if (thSelected.length > 0) {
                    thcanvas.beginPath();
                    for (var i = 0; i < thSelected.length; i++) {
                        var pointIndex = thSelected[i];
                        thcanvas.lineTo(thcircle[pointIndex].X, thcircle[pointIndex].Y);
                    }
                    thcanvas.lineWidth = 3;
                    thcanvas.strokeStyle = this.linecolor;
                    thcanvas.stroke();
                    thcanvas.closePath();
                    if(touchPoint!=null){
                        var endPointIndex=thSelected[thSelected.length-1];
                        var endPoint=thcircle[endPointIndex];
                        thcanvas.beginPath();
                        thcanvas.moveTo(endPoint.X,endPoint.Y);

                        thcanvas.lineTo(touchPoint.X-(document.body.offsetWidth-this.canvasWidth)/2,touchPoint.Y-20);
                        thcanvas.stroke();
                        thcanvas.closePath();
                    }

                }
                for (var i = 0; i < thcircle.length; i++) {
                    var circlePoint = thcircle[i];
                    thcanvas.fillStyle = "#c3c3c3";
                    thcanvas.beginPath();
                    thcanvas.arc(circlePoint.X, circlePoint.Y, this.radius, 0, Math.PI * 2, true);
                    thcanvas.closePath();
                    thcanvas.fill();
                    thcanvas.fillStyle = "#ffffff";
                    thcanvas.beginPath();
                    thcanvas.arc(circlePoint.X, circlePoint.Y, this.radius - 3, 0, Math.PI * 2, true);
                    thcanvas.closePath();
                    thcanvas.fill();
                    if(thSelected.indexOf(i)>=0){
                        thcanvas.fillStyle = this.circlecolor;
                        thcanvas.beginPath();
                        thcanvas.arc(circlePoint.X, circlePoint.Y, this.radius, 0, Math.PI * 2, true);
                        thcanvas.closePath();
                        thcanvas.fill();
                    }

                }
            }

    };




})();