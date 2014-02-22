var roomRef;

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
    membersRef.push({name:name});

    //return room_id
    return roomRef.name();
}

//roomId = create('ddd', 'aaa');
//location.href = '/room/' + roomId

// member's login
function member(name){
    //var hash = window.location.hash
    var hash = "JGONgtHFr_R5ocA-6kz";
    var roomsRef = new Firebase('https://brainstorming.firebaseio.com/rooms');
    roomRef = roomsRef.child(hash);
    // <input type="text" name="txtb" value=""><br>
    // <input type="button" value="OK" onclick="tbox1()"><br>

    // input member name on html -> OK
    //var mem_name = document.js.txtb.value ;
    var membersRef = roomRef.child('members');

    //create color random
    // use "https://github.com/eligrey/color.js/blob/master/color.js"
    var hue = Math.random();
    var saturation = 1.0;
    var lightness = 0.5;
    var color = Color.hsl(hue, saturation, lightness).hexTriplet();
    membersRef.push({name:name,color:color});

    return membersRef.name();
}

memberId = member('bbb');


// create postits
function create_postit(pos_x,pos_y,color,created_id){
    // postit.position.x = pos_x
    // postit.position.y = pos_y
    // postit.val = content

    // double click pos_x,pos_y on hthml ->
    var postitsRef = roomRef.child('postits');
    postitsRef.push({pos_x:pos_x, pos_y:pos_y, color:color, created_id:created_id, holding_id:"NULL"});
}

create_postit("20","10","#ff00ff","JGP0OBTfyIe33YllOal");

// setup times and number
function setup(){
    //if (user == owner)
    // setup times and number
}


// create group
function group(){

}




/* rooms{
    room_id:{
        theme,
        owner:{
            owner_id,
            name
        }
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