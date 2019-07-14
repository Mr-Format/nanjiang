
/**
 * Created by Administrator on 2016/10/19.
 */
//    缩放比
var ty=[];
var block={
    "top":0,
    "left":0,
}
var scale={
    "scale_value":0.5,
    "value":0.5,
    "sumLength":0,
    "eachLength":[0,1],
    "moveLength":0,
    "center":{
        "x":0,
        "y":0,
        //刚刚缩放时，距离x0，x1的距离
        "distantOne":0,
        "distantTwo":0,
        //移动的时候距离中心点的距离
        "done_distant_One":0,
        "done_distant_Two":0,

    },
};
var touchSign={
    //判断2指
    "moved":false,
    "touch_num":0,
    "touch_list":[
        {
            "preX":0,
            "preY":0,
            "moveX":0,
            "moveY":0
        },
        {
            "preX":01,
            "preY":01,
            "moveX":01,
            "moveY":01
        }
    ],

}
$(document).on("touchstart",".block",function(e){
    ty=[];

    switch (e.originalEvent.touches.length) {
        case 1:
            console.log("单指");
            touchSign.touch_num=1;
            break;
        case 2:
            touchSign.moved=true;
            console.log("2指");
            touchSign.touch_num=2;
            touchSign.touch_list[0].preX=e.originalEvent.touches[0].screenX;
            touchSign.touch_list[0].preY=e.originalEvent.touches[0].screenY;
            touchSign.touch_list[1].preX=e.originalEvent.touches[1].screenX;
            touchSign.touch_list[1].preY=e.originalEvent.touches[1].screenY;
            //中心点
            scale.center.x=(e.originalEvent.touches[0].screenX+e.originalEvent.touches[1].screenX)/2;
            scale.center.y=(e.originalEvent.touches[0].screenY+e.originalEvent.touches[1].screenY)/2;
            break;
        default :
            touchSign.touch_num=0;
            break;
    }

})
$(document).on("touchmove",".block",function(e){
    //console.log(e.originalEvent.touches);
    if(touchSign.moved){
        switch (e.originalEvent.touches.length) {
            case 1:
                //console.log("单指1");
                touchSign.touch_num=1;
                flow=true;
                $(".btntranlate").show();
                $(".road").show();
                $(".size").show();
                break;
            case 2:
                //console.log("2指2");
                e.preventDefault();
                touchSign.touch_num=2;
                touchSign.touch_list[0].moveX=e.originalEvent.touches[0].screenX;
                touchSign.touch_list[0].moveY=e.originalEvent.touches[0].screenY;
                touchSign.touch_list[1].moveX=e.originalEvent.touches[1].screenX;
                touchSign.touch_list[1].moveY=e.originalEvent.touches[1].screenY;
                //手指移动的距离
                scale.eachLength[0]=Math.sqrt(
                    (Math.pow((touchSign.touch_list[0].preX-touchSign.touch_list[0].moveX),2))+(Math.pow(touchSign.touch_list[0].preY-touchSign.touch_list[0].moveY,2))
                );
                scale.eachLength[1]=Math.sqrt(
                    (Math.pow((touchSign.touch_list[1].preX-touchSign.touch_list[1].moveX),2))+(Math.pow(touchSign.touch_list[1].preY-touchSign.touch_list[1].moveY,2))
                );
                scale.sumLength=Math.sqrt(
                    (Math.pow((touchSign.touch_list[0].preX-touchSign.touch_list[1].preX),2))+(Math.pow(touchSign.touch_list[0].preY-touchSign.touch_list[1].preY,2))
                );
                scale.moveLength=Math.sqrt(
                    (Math.pow((touchSign.touch_list[0].moveX-touchSign.touch_list[1].moveX),2))+(Math.pow(touchSign.touch_list[0].moveY-touchSign.touch_list[1].moveY,2))
                );
                var k=scale.moveLength/scale.sumLength;

                scale.value=scale.scale_value*k;
                if(scale.value<img_index.min){
                    scale.value=img_index.min;
                }
                if(scale.value>img_index.max){
                    scale.value=img_index.max;
                }
                changewidth(scale.value);
                break;
            default :
                touchSign.touch_num=0;
                break;
        }
    }
})
$(document).on("touchend",".block",function(){
    touchSign.moved=false;
    //缩放结束之后，将这次的
    scale.scale_value=scale.value;

})