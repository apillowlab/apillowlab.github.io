function getFileUrl(file){
    var url;
    var agent = navigator.userAgent;
    if (agent.indexOf("MSIE") >= 1 || agent.indexOf("NET") != -1){
        url = window.URL.createObjectURL(file);
    }else if (agent.indexOf("Firefox") > 0){
        url = window.URL.createObjectURL(file);
    }else if (agent.indexOf("Chrome") > 0){
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

function textSize(fontSize,fontFamily,text){
    var span = document.createElement("span");
    var result = {};
    result.width = span.offsetWidth;
    result.height = span.offsetHeight;
    span.style.visibility = "hidden";
    span.style.fontSize = fontSize;
    span.style.fontFamily = fontFamily;
    span.style.display = "inline-block";
    document.body.appendChild(span);
    if(typeof span.textContent != "undefined"){
        span.textContent = text;
    }else{
        span.innerText = text;
    }
    result.width = parseFloat(window.getComputedStyle(span).width) - result.width;
    result.height = parseFloat(window.getComputedStyle(span).height) - result.height;
    return result;
}

String.prototype.byteLength = function() {
    var len = 0;
    for (var i=0;i<this.length;i++){
        if (this.charCodeAt(i)>127||this.charCodeAt(i)==94){
            len+=2;
        }
        else{
            len++;
        }
    }
    return len;
}

function generate(){
    var getPixelRatio = function (context) {
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
    };
    var width = 600, height = 100;
    var avatarurl = '../images/avatar_0.png';

    var c=document.getElementById('canvas'), ctx=c.getContext('2d'), r = getPixelRatio(ctx);
    var cx = 0, cy = 0;
    var radius = 16, borderradius = 5, margin_avatar_bubble = 10, margin_bubble_message = 8;
    var ratio = 1;
    var name_font_size = 12, msg_font_size = 14.5;
    var name = "";
    var msg = "";
    if (document.getElementById("avatar").files.length > 0){
        var avatarfile = document.getElementById("avatar").files[0];
        avatarurl = getFileUrl(avatarfile);
    }
    var fontfamily = "serif";
    var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (isMac){
        fontfamily = "\"Heiti SC\"";
    }

    name = document.getElementById("name").value;
    msg = document.getElementById("message").value;

    c.style.width = width + 'px';
    c.style.height = height + 'px';
    c.style.margin = '30px';

    c.width = width * r;
    c.height = height * r;

    ctx.scale(r, r);
    //bg
    ctx.rect(0, 0,c.width,c.height);
    ctx.fillStyle='transparent';
    ctx.fill();
    //msgbubble
    //var message_width = msg.byteLength();
    var message_width = textSize(msg_font_size+"px",fontfamily,msg).width;
    //console.log(textSize(msg_font_size+"px","source-han-sans-simplified-c",msg));
    var message_height = 35;
    drawRoundRect(ctx, (cx + radius * 2 + margin_avatar_bubble) * ratio, (cy + radius * 1.3) * ratio, (message_width + margin_bubble_message * 2) * ratio, message_height * ratio, borderradius * ratio);
    ctx.fillStyle = "#eff0f1";
    ctx.fill();
    //name
    ctx.fillStyle = "#9aa1aa";
    ctx.font = "normal "+name_font_size * ratio + "px " + fontfamily;
    ctx.fillText(name, (cx + radius * 2 + margin_avatar_bubble) * ratio, (cy + name_font_size) * ratio, 999);
    //message
    ctx.fillStyle = "#1f232a";
    ctx.font = "normal "+msg_font_size * ratio + "px " + fontfamily;
    ctx.fillText(msg, (cx + radius * 2 + margin_avatar_bubble + margin_bubble_message) * ratio, (cy + radius * 1.3 + margin_bubble_message + msg_font_size) * ratio, 999);

    ctx.restore();

    function drawing(n){
        if(n==0){
            var img=new Image;
            //img.crossOrigin = 'Anonymous'; //解决跨域
            img.src=avatarurl;
            img.onload=function(){

                ctx.beginPath();
                ctx.arc((cx + radius) * ratio,(cy + radius) * ratio,radius * ratio,0,Math.PI*2,true);
                ctx.clip();
                ctx.drawImage(img,cx,cy,radius * 2 * ratio,radius * 2 * ratio);
                ctx.closePath();

                drawing(n+1);//递归
            }
        }
        else{
            //convertCanvasToImage(c);
        }
    }
    drawing(0);
}

function convertCanvasToImage(canvas) {
    var hc_image = new Image();
    hc_image.src = canvas.toDataURL("image/png");
    $('#imgBox').html(hc_image);
}

function drawRoundRect(ctx, x, y, width, height, radius){
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
    ctx.lineTo(width - radius + x, y);
    ctx.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
    ctx.lineTo(width + x, height + y - radius);
    ctx.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
    ctx.lineTo(radius + x, height +y);
    ctx.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
    ctx.closePath();
}