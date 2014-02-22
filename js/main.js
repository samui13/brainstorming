var roomRef;
var postitRef;

function onload() {
    hash = window.location.hash;
    if (hash.index('rooms')> 0) {
        setup();
    }
}


// create new room
function create(theme,name){
    var roomsRef = new Firebase('https://brainstorming.firebaseio.com/rooms');
    // <input type="text" name="theme" value="">
    // <input type="text" name="oner_name" value="">

    //input theme name on html -> create
    //roomRef https://brainstorming.firebaseio.com/rooms/room_id
    var roomRef = roomsRef.push({theme:theme});
    var membersRef =  roomRef.child('members');
    var color = random_color();
    var memberRef = membersRef.push({name:name,color:color,owner_flag:"true"});

    //return room_id
    return {room_id:roomRef.name(),member_id:memberRef.name(),color:color,flag:true}
    return roomRef.name();
}

roomId = create('ddd', 'aaa').room_id;

//redirect url
//location.href = '/room/' + roomId;

// member's login
function member(name){
    //var hash = window.location.hash
    var hash = roomId;
    var roomsRef = new Firebase('https://brainstorming.firebaseio.com/rooms');
    roomRef = roomsRef.child(hash);
    // <input type="text" name="txtb" value=""><br>
    // <input type="button" value="OK" onclick="tbox1()"><br>

    // input member name on html -> OK
    //var mem_name = document.js.txtb.value ;
    var membersRef = roomRef.child('members');
    var color = random_color();
    var memberRef = membersRef.push({name:name,color:color,owner_flag:"false"});

    return {member_id:memberRef.name(),color:color,flag:false};
}

var memberId = member('bbb').member_id;
console.log(memberId);

// create postits
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

//edit content
function edit(postit_id,content){
    //content = postit.val

    //press enter postit_id content on html ->
    var postitRef = postitsRef.child(postit_id);
    postitRef.update({content:content});
}

edit(postitId,"test");

// setup times and number
function setup(){
    //if (user == owner)
    // setup times and number
}


// create group
function group(){

}

//random color
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