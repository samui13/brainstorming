userUI = {};
userUI.fn = {};
userUI.fn.orderField = function(){

}

userUI.addPostIt = function(){
//    userUI.fn.orderField();
    var t = PostIts.fn.create({text:'Hello'});
    postit = create_postit(0,0,$.cookie("color"),$.cookie("member_id"));
    t.id = postit.postit_id;
    t.render($("#brestField"));
    t.setEnv();
    t.changeCSS();

};

userUI.addGroup = function(){
    var obj = Groups.fn.create({tag:'Group'});
    create_group(0,0,300,300,$.cookie("member_id"));
    obj.render($("#brestField"));
    obj.setEnv();
};
