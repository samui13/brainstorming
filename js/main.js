//public variable
/*var roomsRef;
var postitsRef;
var membersRef;
var groupsRef;
var flag;
var roomRef;
var hash;*/

//URL of firebase
var firebaseUrl = 'https://brainstorming-data.firebaseio.com/rooms';

conDB = {
    room:{},
    roomsRef:{},
    roomRef:{},
    postitsRef:{},
    membersRef:{},
    groupsRef:{},
    flag:{},
    hash:{},
    cookieParam:{
        expires:3,
        path:"/",
    },
};
conDB.registfn = {};
conDB.order = {};

conDB.init = function(){
    this.hash = window.location.hash;
    this.hash = this.hash.substr(2);
    this.flag = $.cookie("flag");
    if(this.flag == "true" || this.flag == "false"){
    }else if(this.hash.length>0){
        $("#hover").css('display','block');
    }
    this.roomsRef = new Firebase(firebaseUrl);
    this.roomRef = this.roomsRef.child(this.hash);
    this.membersRef = this.roomRef.child('members');
    this.postitsRef = this.roomRef.child('postits');
    this.groupsRef = this.roomRef.child('groups');
    this.roomRef.child('theme').once('value',function(snapshot){
        var title = snapshot.val();
        $('#title').text(title);
    });


    //read actions
    conDB.registfn.memberAddEvent();
    conDB.registfn.postitAddEvent();
    conDB.registfn.groupAddEvent();
    /*conDB.registfn.postitChangeEvent();
    conDB.registfn.groupChangeEvent();*/
};

//memberAdd of read actions
conDB.registfn.memberAddEvent = function(){
    conDB.membersRef.on('child_added',function(snapshot){
        var member = snapshot.val();
        $("<li>"+member.name+"</li>").appendTo('#member_list');
    });
}

//postitAdd of read actions
conDB.registfn.postitAddEvent = function(){
    conDB.postitsRef.on('child_added',function(snapshot){
        var postit_id = snapshot.name();
        var postit_param = snapshot.val();
        var postit = PostIts.fn.create({text:""});
        postit.id = postit_id;
        postit.color = postit_param.color;
        postit.render($("#brestField"));
        postit.elem.offset({
            top:postit_param.pos_x,
            left:postit_param.pos_y,
        });
        postit.setEnv();
        postit.changeCSS();
        $('.content',$("#" + snapshot.name())).text(postit_param.content);
    });
}

//groupAdd of read actons
conDB.registfn.groupAddEvent = function(){
    conDB.groupsRef.on('child_added',function(snapshot){
        var group_id = snapshot.name();
        var group_param = snapshot.val();
        var group = Groups.fn.create({text:""});
        group.id = group_id;
        group.color = group_param.color;
        group.render($("#brestField"));
        group.elem.offset({
            top:group_param.pos_x,
            left:group_param.pos_y,
        });
        group.setEnv();
        group.changeCSS();
        $('.footer',$("#" + snapshot.name())).text(group_param.name);
    })
}


//click actions
//createRoom of click actions
conDB.order.createRoom = function(){
    conDB.roomsRef = new Fierebase(firebaseUrl);
    var roomRef = conDB.roomsRef.push({theme:$("#theme").val()});
    conDB.membersRef = roomRef.child('members');
    var color = random_color();
    var memberRef = conDB.membersRef.push({name:$("#owner_name").val(),color:color,owner_flag:"true"});

    conDB.roomsRef.on('child_added',function(){
        conDB.hash = roomRef.name();
        conDB.cookieParam.path = "./room/#/" + conDB.hash;
        $.cookie("member_id",memberRef.name(),conDB.cookieParam);
        $.cookie("color",color,conDB.cookieParam);
        $.cookie("flag","true",conDB.cookieParam);
        location.href = "./room/#/" + conDB.hash;
    })
}

//enterRoom of click actions
conDB.order.enterRoom = function(){
    var color = random_color();
    conDB.membersRef = conDB.membersRef.push({name:$("#user_name").val(),owner_flag:"false"});
    conDB.cookieParam.path = './room/#/' + conDB.hash;
    $.cookie("member_id",conDB.membersRef.name(),conDB.cookieParam);
    $.cookie("color",color,conDB.cookieParam);
    $.cookie("flag","false",conDB.cookieParam);
    $('#hover').css("display","none");
}

//createPostit of click actions
conDB.order.createPostit = function(){
    var postitRef = conDB.postitsRef.push({pos_x:0,pos_y:0,color:$.cookie("color"),create_id:$.cookie("member_id"),holding_id:"NULL"});
}

//createGroup of click actions
conDB.order.createGroup = function(){
    var groupRef = conDB.groupsRef.push({pos_x:0,pos_y:0,width:200,height:100,create_id:$.cookie("member_id"),holding_id:"NULL",color:$.cookie("color")});
}

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