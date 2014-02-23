var roomsRef;
var postitsRef;
var membersRef;
var groupsRef;
var flag;
var roomRef;
var hash;

var cookieParam = { expires: 3, };

function onload() {
    hash = window.location.hash;
    hash = hash.substr(2);
    flag = $.cookie("flag");
    console.log(flag);
    if(flag == "true"){
    }
    else if (hash.length > 0) {
        document.getElementById('hover').style.display = "inline";
    }
    else{
    }
    roomsRef = new Firebase('https://brainstorming.firebaseio.com/rooms');
    roomRef = roomsRef.child(hash);
    membersRef = roomRef.child('members');
    postitsRef = roomRef.child('postits');
    groupsRef = roomRef.child('groups');
    roomRef.child('theme').once('value',function(snapshot){
        var title = snapshot.val();
        console.log(title);
        $("#title").text(title);
    });
    /* members child_add event
    * insert member_name into member_list
    */
    membersRef.on('child_added',function(snapshot){
       var member = snapshot.val();
       var member_name = document.createElement("li");
       member_name.innerHTML = member.name;
       var member_list = document.getElementById('member_list');
       member_list.appendChild(member_name);
    });

    /* postits child_add event
    *
    */
    postitsRef.on('child_added',function(snapshot){
        var postit_id = snapshot.name();
        var postit = snapshot.val();
        if(postit.holding_id != $.cookie("member_id")){
            var t = PostIts.fn.create({text:'Hello'});
            t.id = postit_id;
            t.color = postit.color;
            t.render($("#brestField"));
            t.elem.offset({
                top:postit.pos_x,
                left:postit.pos_y,
            })
            t.setEnv();
            t.changeCSS();
            $('.content', $("#" + snapshot.name())).text(postit.content);
        }
    });

    /* groups child_add event
    *
    */
    groupsRef.on('child_added',function(snapshot){
        var group = snapshot.val();
    });

    /* postits child_changed event
    *
    */
    postitsRef.on('child_changed',function(snapshot){
        var postit = snapshot.val();
        console.log("B");
        if(postit.holding_id == $.cookie("member_id")){
        }
        else{
        $aaa = $('.content', $("#" + snapshot.name())).text(postit.content);
        console.log($aaa);
        }
    });

    /* groups child_changed event
    *
    */
    groupsRef.on('child_changed',function(snapshot){
        var group = snapshot.val();
        if(group.holding_id != "NULL"){
        }
        else{
            element = document.getElementById(snapshot.name());
            element.innerHTML = group.name;
            //element style pos_x,pos_y
        }
    });

}

/* create new room
* @param theme
* @param name
* @return room_id and member_id and color
*/
function create(theme,name){
    roomsRef = new Firebase('https://brainstorming.firebaseio.com/rooms');
    // <input type="text" name="theme" value="">
    // <input type="text" name="oner_name" value="">

    //input theme name on html -> create
    //roomRef https://brainstorming.firebaseio.com/rooms/room_id
    var roomRef = roomsRef.push({theme:theme});
    membersRef =  roomRef.child('members');
    var color = random_color();
    var memberRef = membersRef.push({name:name,color:color,owner_flag:"true"});
    groupsRef = roomRef.child('groups');

    //return room_id
    return {room_id:roomRef.name(),member_id:memberRef.name(),color:color,flag:"true"};
}
function click_create(){
    room = create(document.getElementById('theme').value, document.getElementById('owner_name').value);
    roomId = room.room_id;
    cookieParam.path = './ymnk/#/' + roomId;
    $.cookie("member_id",room.member_id,cookieParam);
    $.cookie("color",room.color,cookieParam);
    $.cookie("flag",room.flag,cookieParam);
    roomsRef.on('child_added',function(){
        //redirect url
        location.href = './ymnk/#/' + roomId;
    })
}

/* member's login
* @param name
* @return member_id and color and flag
*/
function member(name){
    // <input type="text" name="txtb" value=""><br>
    // <input type="button" value="OK" onclick="tbox1()"><br>

    // input member name on html -> OK
    //var mem_name = document.js.txtb.value ;
    var color = random_color();
    memberRef = membersRef.push({name:name,color:color,owner_flag:"false"});
    groupsRef = roomRef.child('groups');
    return {member_id:memberRef.name(),color:color,flag:"false"};

}

function click_room_in(){
    member = member(document.getElementById('user_name').value);
    cookieParam.path = './ymnk/#/' + hash;
    $.cookie("member_id",member.member_id,cookieParam);
    $.cookie("color",member.color,cookieParam);
    $.cookie("flag",member.flag);
    document.getElementById('hover').style.display = "none";
}


/* create postits
* @param pos_x
* @param pos_y
* @param color
* @created_id
* @return postit_id and holding_id
*/
function create_postit(pos_x,pos_y,color,created_id){
    // postit.position.x = pos_x
    // postit.position.y = pos_y
    // postit.val = content

    // double click pos_x,pos_y on hthml ->
    var postitRef = postitsRef.push({pos_x:pos_x, pos_y:pos_y, color:color, created_id:created_id, holding_id:created_id});

    return {postit_id:postitRef.name(),holding_id:created_id};
}

//var postitId = create_postit("20","10","#ff00ff",memberId).postit_id;

/*
* Create new group information
* @param pos_x
* @param pos_y
* @param created_id
* @return group_id and holding_id
*/
function create_group(pos_x,pos_y,width,height,created_id){
    // width, height, color
    groupsRef = roomRef.child('groups');
    var color = random_color();
    var groupRef = groupsRef.push({pos_x:pos_x,pos_y:pos_y,width:width,height:height,created_id:created_id,holding_id:"NULL",color:color });
    return {group_id:groupRef.name(),holding_id:"NULL"};
}

/*holding postit
* @param member_id
* @param postit_id
*/
function postit_hold(postit_id,member_id){
    var postitRef = postitsRef.child(postit_id);
    postitRef.update({holding_id:member_id});
}

/* holding group
* @param member_id
* @param postit_id
*/
function group_hold(member_id,group_id){
    var groupRef = groupsRef.child(group_id);
    groupRef.update({holding_id:member_id});
}

/* move postit
* @param postit_id
* @param pos_x
* @param pos_y
*/
function postit_move(postit_id,pos_x,pos_y){
    var postitRef = postitsRef.child(postit_id);
    postitRef.update({pos_x:pos_x,pos_y:pos_y,holding_id:"NULL"});
}

/*
* Move group (or postit)
* @param group_id (or postit_id)
* @param pos_x
* @param pos_y
*/
function group_move(group_id,pos_x,pos_y){
    var groupRef = groupsRef.child(group_id);
    groupRef.update({pos_x:pos_x,pos_y:pos_y,holding_id:"NULL"});
}

/*edit content
* @param postit_id
* @param content
* @return success
*/
function postit_edit(postit_id,content,member_id){
    //content = postit.val

    //press enter postit_id content on html ->
    var postitRef = postitsRef.child(postit_id);
    postitRef.update({content:content});
    message = "success";

    return message;
}

/* edit group name
* @param name
* @param group_id
*/
function group_edit(name,gruop_id){
    var groupRef = groupsRef.child(group_id);
    gruopRef.update({name:name,holding_id:"NULL"});
    message = "success";

    return message;
}

/*
* Setup times and number
* @param owner_flag
* @param time
* @param number
*/
function setup(owner_flag,time,number){
    //if (user == owner)
    // setup times and number
    if( owner_flag ){
        var timeRef = room.child('time');
        var numberRef = room.child('number');
        timeRef.push({time:time});
        numberRef.push({number:number});
    }
}



/* random create color
* @return color
*/
function random_color(){
    //create color random
    // use "https://github.com/eligrey/color.js/blob/master/color.js"
    var hue = Math.random();
    var saturation = 1.0;
    var lightness = 0.5;
    var color = Color.hsl(hue, saturation, lightness).hexTriplet();

    return color;
}



/* rooms{
    room_id:{
        theme,
        members:{
            name,
            id,
            color,
            owner_flag
        }
        postits:{
            id,
            content,
            pos_x,
            pos_y,
            color,
            create_id,
            holding_id
        }
        groups:{
            id,
            name,
            pos_x,
            pos,y,
            width,
            height,
            create_id,
            holding_id,
            color
        }
        time
        number
    }
*/

function test(){
        var content = document.getElementById('content').value;
        member(content);
    }