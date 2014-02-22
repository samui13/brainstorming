var roomsRef;
var postitsRef;
var membersRef;
var groupsRef;

function onload() {
    hash = window.location.hash;
    if (hash.index('rooms')> 0) {
        setup();
    }
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
    return {room_id:roomRef.name(),member_id:memberRef.name(),color:color,flag:true};
}

roomId = create('ddd', 'aaa').room_id;

//redirect url
//location.href = '/room/' + roomId;

/* member's login
* @param name
* @return member_id and color and flag
*/
function member(name){
    //var hash = window.location.hash
    var hash = roomId;
    roomsRef = new Firebase('https://brainstorming.firebaseio.com/rooms');
    roomRef = roomsRef.child(hash);
    // <input type="text" name="txtb" value=""><br>
    // <input type="button" value="OK" onclick="tbox1()"><br>

    // input member name on html -> OK
    //var mem_name = document.js.txtb.value ;
    membersRef = roomRef.child('members');
    var color = random_color();
    memberRef = membersRef.push({name:name,color:color,owner_flag:"false"});
    groupsRef = roomRef.child('groups');
    return {member_id:memberRef.name(),color:color,flag:false};
}

var memberId = member('bbb').member_id;

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
    postitsRef = roomRef.child('postits');
    var postitRef = postitsRef.push({pos_x:pos_x, pos_y:pos_y, color:color, created_id:created_id, holding_id:"NULL"});

    return {postit_id:postitRef.name(),holding_id:"NULL"};
}

var postitId = create_postit("20","10","#ff00ff",memberId).postit_id;

/*
* Create new group information
* @param pos_x
* @param pos_y
* @param created_id
* @return group_id and holding_id
*/
function create_group(name,pos_x,pos_y,created_id){
    // width, height, color
    groupsRef = roomRef.child('groups');
    var color = random_color();
    var width = 2.0;   // default length
    var height = 1.0;
    var groupRef = groupsRef.push({pos_x:pos_x,pos_y:pos_y,width:width,height:height,created_id:created_id,holding_id:"NULL",color:color });
    return {group_id:groupRef.name(),holding_id:"NULL"};
}

/*holding postit
* @param member_id
* @param postit_id
*/
function postit_hold(member_id,postit_id){
    var postitRef = postitsRef.child(postit_id);
    postitRed.update({holding_id:member_id});
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
function postit_edit(postit_id,content){
    //content = postit.val

    //press enter postit_id content on html ->
    var postitRef = postitsRef.child(postit_id);
    postitRef.update({content:content,holding_id:"NULL"});
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


/* members child_add event
*
*/
membersRef.on('child_added',function(snapshot){
   var member = snapshot.val();
   var member_name = document.createElement("a");
   member_name.innerHTML = member.name;
   var member_list = document.getElementById('member_list');
   member_list.appendChild(member_name);
});

/* postits child_add event
*
*/
postitsRef.on('child_added',function(snapshot){
    var postit = snapshot.val();
});

/* groups child_add event
*
*/
groupsRef.on('child_added',function(snapshot){
    var group = snapshot.val();
});

postitsRef.on('child_changed',function(snapshot){
    console.log(name);
});

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
        postit_edit(postitId,content);
    }