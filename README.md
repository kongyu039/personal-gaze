## 注意
> [!NOTE]
>
> 本项目和APP(DoingWhat) 不会存储任何数据到本人的服务器（因为我懒，没有服务器）中，数据只是存储在公共的中转服务器中。

## 零 项目说明
> 不知道说啥，这是一个想法几年前的项目，懒狗一条，拖拉了好几年就是不想学，不想写。
>
> 正好一年前(2025)的某个晚上在b站刷到了 [写了一个能让各位知道我睡没睡着的网页](https://www.bilibili.com/video/BV1fE421A7PE/)，然后每隔一段
> 时间就会蹦出一个新的“视频” 完善了“睡着”，但是又不止“睡着”，项目都很好
> 1. B站UP[WinMEMZ](https://space.bilibili.com/417031122)
     2024-07-02 [写了一个能让各位知道我睡没睡着的网页](https://www.bilibili.com/video/BV1fE421A7PE/)
> 2. B站UP[1812z](https://space.bilibili.com/336130050)
     2024-11-27 [改了个能让各位实时视奸我的网站](https://www.bilibili.com/video/BV1LjB9YjEi3/)
> 3. B站UP[晅弌Xanthichi](https://space.bilibili.com/400669188)
     2025-06-18 [我也改了个让各位不仅能实时视奸我还能电击我的网站](https://www.bilibili.com/video/BV1r7NjzCE26/)
> 4. B站UP[账号已重置](https://space.bilibili.com/213203496)
     2025-09-07 [【赛博生命系列】做了个让各位24h实时视奸的网站](https://www.bilibili.com/video/BV1JKYLzgENR)
> 5. B站UP[永远の文学部](https://space.bilibili.com/314386144)
     2026-03-15 [开源了一个实时视奸自己的二次元面板，多种应用都会自动播报](https://www.bilibili.com/video/BV1XdwhzAE5Y)
>
> 还有蛮多的这种类似的站点与相同的视频，非常感谢。

## 一 项目功能

1. DoingWhat(**Android8.0+**)：获取个人设备使用情况，上传到一个公共服务器中存储数据
2. Gaze：本项目只是一个静态页面，用于展示对应APP端（DoingWhat）上传到中转公共服务器的数据
3. Gaze：项目默认展示的是“作者”的状态，但是也可以通过修改URL的参数为“自己”的状态
   + 例子：https://gaze.kongyu039.dpdns.org/?read=你自己的READ值
   + <span style="color:red">PS：使用DoingWhat时，用户的KEY不要暴露哦，复杂点避免KEY重复，以防READ到其他人的“状态”</font>


## 二 项目原因
明明这么多视频了，我为什么还要搞一个这个项目呢？

我认为上面的视频都只是想让"自己"被别人知道有没有“睡”，如果观众也想“赛博LU出”那将毫无办法(在视频下面也有蛮多人在问怎么自己部署)

这主要就是因为 B站UP[永远の文学部](https://space.bilibili.com/314386144) 这位大佬的视频和项目，把"一套"都弄好了，但是对“路人”来说太复杂了

最终：被上面4位大哥的视频，以及最终这位“永远の文学部”大佬给我“压迫”的不行了

此项目应运而生，**主要就是零门槛，让看了的人哪怕自己没有“技术”，也能满足“赛博LU出”癖**

## N 致谢
感谢以下开源项目和作者(Thanks to the following projects and authors)

1. [1812z](https://github.com/1812z/RunTime_Tracker)
2. [Monika-Dream](https://github.com/Monika-Dream/live-dashboard)
