;
(function ($) {
    $.fn.fullpage = function (options, beforeMove, afterMove) {
        var defaults = {
            //各种参数、各种属性
            scrollingSpeed: .7, //滚动速度
            animateType: "ease-in", //滚动动画方式
            navigation: true, //是否显示导航按钮
            navigationPosition: "right", //导航按钮位置(left|right)
            keyboardScrolling: true, //是否适用键盘方向键切换
            loopScroll: true, //是否循环滚动
            nowPage: 0, //初始页面值
            setPageColor: true, //是否希望自动设置分页背景颜色
        };

        //options合并到defaults上,defaults继承了options上的各种属性和方法,将所有的赋值给endOptions
        var endOptions = $.extend(defaults, options);

        this.each(function () {
            //实现功能的代码
            init(endOptions);
            var pageCounts = $('.section').length;
            var nowPage = endOptions.nowPage;
            var targetPage = 0;


            //当页面大小变化时，重新执行init函数
            var resizeTimer = null;
            $(window).resize(function () {
                if (resizeTimer) {
                    clearTimeout(resizeTimer)
                }
                resizeTimer = setTimeout(function () {
                    init(endOptions);
                }, 300);
            })

            var startTime = 0,
                endTime = 0;


            //键盘控制滚动
            if (endOptions.keyboardScrolling) {
                $(document).keydown(function (e) {
                    if (e.keyCode == 40) {
                        if (nowPage == pageCounts) {
                            if (endOptions.loopScroll) {
                                targetPage = 1;
                                moveTo(nowPage, targetPage,function(){
                                    nowPage = targetPage;
                                });
                            } else {
                                return;
                            }
                        } else {
                            targetPage = nowPage + 1;
                            moveTo(nowPage, targetPage,function(){
                                nowPage = targetPage;
                            });
                        }
                    }
                    if (e.keyCode == 38) {
                        if (nowPage == 1) {
                            if (endOptions.loopScroll) {
                                targetPage = pageCounts;
                                moveTo(nowPage, targetPage,function(){
                                    nowPage = targetPage;
                                });
                            } else {
                                return;
                            }
                        } else {
                            targetPage = nowPage - 1;
                            moveTo(nowPage, targetPage,function(){
                                nowPage = targetPage;
                            });
                        }
                    }
                })
            }
            //鼠标滚轮滚动，控制界面滚动
            $('.sections').on('mousewheel DOMMouseScroll', function (e) {
                var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                startTime = new Date().getTime();
                if (endTime - startTime < -500) {
                    if (delta < 0) { //鼠标滚轮向下，向下滚动
                        if (nowPage == pageCounts) {
                            if (endOptions.loopScroll) {
                                targetPage = 1;
                                moveTo(nowPage, targetPage,function(){
                                    nowPage = targetPage;
                                });
                            } else {
                                return;
                            }
                        } else {
                            targetPage = nowPage + 1;
                            moveTo(nowPage, targetPage,function(){
                                nowPage = targetPage;
                            });
                        }
                    } else { //鼠标滚轮向上，向上滚动
                        if (nowPage == 1) {
                            if (endOptions.loopScroll) {
                                targetPage = pageCounts;
                                moveTo(nowPage, targetPage,function(){
                                    nowPage = targetPage;
                                });
                            } else {
                                return;
                            }
                        } else {
                            targetPage = nowPage - 1;
                            moveTo(nowPage, targetPage,function(){
                                nowPage = targetPage;
                            });
                        }

                    }
                }
                endTime = new Date().getTime();
            });

            //导航按钮点击
            $(".anchors li").on("click",function(){
                var targetPage = $(this).index()+1;
                moveTo(nowPage,targetPage,function(){
                    nowPage = targetPage;
                });
            })
        });


        //界面初始化函数
        function init(endOptions) {
            //总页面数
            var pageCounts = $('.section').length;

            //获取页面高度
            var clientH = window.innerHeight;
            var clientW = window.outerWidth;


            $("#fullpage").height(clientH);
            $("#fullpage").width(clientW);
            $(".section").height(clientH);
            $(".section").width(clientW);

            //设置页面样式
            $("html,body").css({
                "padding": 0,
                "margin": 0
            })
            $("#fullpage").css({
                "overflow": "hidden",
                "position": "relative"
            })
            $(".section").css({"overflow": "hidden","position":"relative"});
            //设置页面的颜色
            if (endOptions.setPageColor) {

                let colorArr = ["#4DB6AC", "#03A9F4", "#26C6DA", "#AB47BC", "#FFA726", "#5C6BC0", "#8d6e63"];
                for (let i = 1; i <= pageCounts; i++) {
                    var index = Math.floor((Math.random() * colorArr.length));
                    $(`.section:nth-child(${i})`).css({
                        "background-color": colorArr[index]
                    })
                }
            }


            /**对给定的配置进行初始化*/
            //初始化开始页面
            var nowPage = endOptions.nowPage > pageCounts ? 1 : endOptions.nowPage;
            $(".sections").css({
                'transform': `translateY(${-(nowPage - 1) * clientH}px)`,
            });
            setTimeout(function () {
                $(".sections").css({
                    "transition": `transform ${endOptions.scrollingSpeed}s  ${endOptions.animateType}`
                });
            }, 1000)


            //初始化导航按钮
            if (endOptions.navigation) {
                var anchorStr = `
                    <ul class="anchors">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                `
                $("#fullpage").append(anchorStr);
                $(".anchors").css({
                    "list-style": "none",
                    "position": "absolute",
                    "top": clientH / 2 - 80 + "px",
                    "margin": 0,
                    "padding": 0
                })
                $(`.anchors li:nth-child(${nowPage})`).addClass("active").css({"background-color":"#fff"});
                if (endOptions.navigationPosition == "left") {
                    $(".anchors").css({
                        "left": "15px"
                    })
                } else {
                    $(".anchors").css({
                        "right": "15px"
                    })
                }

                $(".anchors li").css({
                    "width": "8px",
                    "height": "8px",
                    "border": "1px solid #fff",
                    "border-radius": "50%",
                    "margin-top": "10px",
                    "cursor":"pointer"
                })

            }

        }

        //跳转到第几页
        function moveTo(nowPage, targetPage,callback) {
            var clientH = $(window).height();
            var pageCounts = $('.section').length;
            var endTranslateY = -(nowPage - 1) * clientH - (targetPage - nowPage) * clientH;
            var startTranslateY = -(nowPage - 1) * clientH;

            //切换页面前回调
            if (beforeMove) {
                var flag = beforeMove(nowPage);
                if (flag == false) {
                    return;
                }
            }
            $(".sections").css({
                'transform': `translateY(${endTranslateY}px)`
            });
            //检测translateY数值，当到达指定数值，则表示切换完成
            var interval = setInterval(function () {
                var matrix = $(".sections").css("transform");
                //matrix(1, 0, 0, 1, 0, -943)
                var nowTranslateY = matrix.match(/matrix\(.*, (.*)\)/)[1];
                // console.log(nowTranslateY)
                if (nowTranslateY == endTranslateY) {
                    clearInterval(interval)
                    if ($(".anchors")) {
                        $(`.anchors li:nth-child(${targetPage})`).addClass("active").siblings().removeClass("active");
                        $(`.anchors li:nth-child(${targetPage})`).css({"background-color":"#fff"}).siblings().css({"background-color":"transparent"});
                    }
                    if(callback){
                        callback();
                    }
                    //切换页面完成回调函数
                    if (afterMove) {
                        afterMove(targetPage)
                    }
                }
            }, 100)
        }


    };


})(jQuery);
