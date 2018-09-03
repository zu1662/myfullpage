# myfullpage

#### 项目介绍
自己实现的jquery全面屏滚动插件。[demo](https://zu1662.github.io/myfullpage/)

#### 使用说明

1. HTML骨架

```
    <div id="fullpage">
        <div class="sections">
            <div class="section"><span>第一屏</span></div>
            <div class="section"><span>第二屏</span></div>
            <div class="section"><span>第三屏</span></div>
            <div class="section"><span>第四屏</span></div>
        </div>
    </div>
```

2. js代码初始化

```
    $("#fullpage").fullpage({
        //初始化参数
         //各种参数、各种属性
            scrollingSpeed: .7, //滚动速度
            animateType: "ease-in", //滚动动画方式
            navigation: true, //是否显示导航按钮
            navigationPosition: "right", //导航按钮位置(left|right)
            keyboardScrolling: true, //是否适用键盘方向键切换
            loopScroll: true, //是否循环滚动
            nowPage: 0, //初始页面值
            setPageColor: true, //是否希望自动设置分页背景颜色
    },beforeMove,afterMove)//页面滚动前和滚动完成回调函数。不需要可以不写。

    function beforeMove(nowPage){}
    function afterMove(nowPage){}
```
