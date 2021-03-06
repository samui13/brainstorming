PostIts = {list:[]};
PostIts.__template = '\
<div id="{{data.id}}" class="draggablePostIt">\n\
<div class="content" contenteditable="true">\n\
{{data.text}}\n\
</div>\n\
</div>\n\
';
PostIts.draggableOpt = {
    // あとでかかないかも
    start:function(e,ui){
    	var id = $(ui.helper[0]).get(0).id;
		var obj = $("#"+id);
		conDB.registfn.postitHold(id);
    },
    drag:function(e,ui){
    	var id = $(ui.helper[0]).get(0).id;
    	var obj = $("#" + id);
		var parent_offset = obj.parent().offset();
		var offset = obj.offset();
		var pos_x = offset.left - parent_offset.left;
		var pos_y = offset.top - parent_offset.top;
    	conDB.registfn.postitDrag(id,pos_x,pos_y);
    },
    stop:function(e,ui){
    	var id = $(ui.helper[0]).get(0).id;
		var obj = $("#"+id);
		var parent_offset = obj.parent().offset();
		var offset = obj.offset();
		var pos_x = offset.left - parent_offset.left;
		var pos_y = offset.top - parent_offset.top;
		conDB.registfn.postitRelease(id,pos_x,pos_y);
    },
    zIndex:4,
};
PostIts.fn = {};
PostIts.fn.create = function(params){
    var obj = {
	x:0,
	y:0,
	text:'',
	color:'#A0A0A0',
	elem:{},
    };
    for(var key in params){
	obj[key] = params[key];
    }
    obj.id = PostIts.list.length;
    obj.view = function(){
	var rawHtml = Mustache.render(PostIts.__template,{
	    data:obj,
	});
	return rawHtml;
    };
    obj.render = function(elem){
	var raw = obj.view();
	obj.elem = $(raw);
	obj.elem.appendTo(elem);
	obj.x = obj.elem.offset().left;
	obj.y = obj.elem.offset().top;
    };
    obj.setEnv = function(){
	$(".draggablePostIt").on('click',function(e){
	    if(!$(e.toElement).hasClass('content')){
		//console.log(obj.elem);
		//console.log('Move!');
	    }
	});
	$(".draggablePostIt").on('dblclick',function(e){
	    //obj.elem.appendTo($("#brestField"));
	    $("#"+e.currentTarget.id).appendTo($("#brestField"));
	});
	obj.elem.draggable(PostIts.draggableOpt);
	obj.elem.on('mouseover',function(e){
	    if(!$(e.toElement).hasClass('content')){
		obj.elem.draggable('enable');
	    }
	});
	obj.elem.on('mouseout',function(e){
	    obj.elem.draggable('disable');
	});
	obj.elem.on('keyup',function(e){
		console.log($(this).children(".content").text());
	})
    };
    obj.changeCSS = function(){
	obj.elem.css('position','absolute');
	obj.elem.offset({top:obj.y,left:obj.x});
    };
    PostIts.list.push(obj);
    return obj;
};
