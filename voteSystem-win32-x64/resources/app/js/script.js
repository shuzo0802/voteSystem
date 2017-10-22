// var fs = require("fs");
// var iconv = require("iconv-lite");
var voteData = {};
function movePage(current,direction,chosen){
	if(direction=="prev"){
		if(current==1){
			$(".vote-page").removeClass("on-open-1").addClass("on-open-0");
			$(".prev-button").hide();
			$(".quit-button").show();
			return 0;
		}else if(current==2){
			$(".vote-page").removeClass("on-open-2").addClass("on-open-1");
			$(".submit-button").hide();
			$(".next-button").show();
			return 1;
		}
	}else if(direction=="next"){
		if(current==0){
			$(".vote-page").removeClass("on-open-0").addClass("on-open-1");
			$(".quit-button").hide();
			$(".prev-button").show();
			return 1;
		}else if(current==1){
			$(".vote-page").removeClass("on-open-1").addClass("on-open-2");
			$(".next-button").hide();
			// if(chosen.toString() !== [-1,-1,-1].toString()){
				$(".submit-button").show();
			// }
			return 2;
		}
	}
}

function showConfirmWindow(chosen,data){
	$(".confirm-window__list").empty();
	var chosenDeco = [];
	chosen.forEach(function(num){
		if(num != -1){
			var deco = data[num];
			$(".confirm-window__list").append(
				"<li class='confirm-window__list__item' data-deco-id='"+deco["id"]+"'>"+
					"<span>"+deco["部門"]+"部門"+"</span>"+
					"<p>"+deco["デコ名"]+"「"+deco["タイトル"]+"」"+
				"</li>"
			);
		}
	});
	$(".confirm-window").fadeIn();
}

function voteToDeco(chosen,data){
	chosen.forEach(function(num){
		if(num != -1){
			var deco = data[num];
			deco["票数"] = parseInt(deco["票数"]) + 1;
		}
	});
	return data;
}

$(function(){
	// fs.readFile('../data/data.csv', 'utf8', function (err, csvData) {
	$.ajax({
		url: '../data/data.csv',
		complete: function(csvData){
			tmp = Papa.parse(csvData.responseText,{header: true});
			voteData = tmp["data"];
			for(var item in voteData){
				var belongTo, deco = voteData[item];
				switch(deco["部門名"]){
					case "展示": belongTo = 0;break;
					case "演劇": belongTo = 1;break;
					case "パフォーマンス": belongTo = 2;break;
				}
				$("[data-vote-page="+ belongTo +"] ul").append(
					"<li class='deco-block' data-deco-id='"+deco["id"]+ "'>"+
						"<p class='deco-name'>"+deco["デコ名"]+"</p>"+
						"<p class='deco-title'>"+deco["タイトル"]+"</p>"+
					"</li>"
				);
			}
		}
	});	
	
	var openPage,touchStartX = 0, touchStartY = 0, chosenDecoNum=[-1,-1,-1], parentPage;
	function initialize(){
		openPage = 0;
		chosenDecoNum = [-1,-1,-1];
		$(".prev-button,.submit-button").hide();
		$(".next-button,.quit-button").show();
		$(".vote-page").removeClass("on-open-1 on-open-2").addClass("on-open-0");
	}	
	initialize();
	$("body").on({
		"mousedown": function(e){
			parentPage = $(this).parent().parent().data("vote-page");
			if($(this).hasClass("is-chosen")){
				$(this).addClass("is-chooseout");
			}else{
				$(this).addClass("is-touched");
				// touchStartX = e.touches[0].pageX;
				// touchStartY = e.touches[0].pageY;
				touchStartX = e.clientX;
				touchStartY = e.clientY;
			}
		},
		"mousemove": function(e){
			if(!$(this).hasClass("is-touched")){return;}
			if(Math.abs(e.clientX - touchStartX) > 5 || Math.abs(e.clientY - touchStartY) > 5) {
				$(this).addClass("is-scrolled");
			}
		},
		"mouseup": function(){
			if($(this).hasClass("is-chosen")){
				$(this).removeClass("is-chosen is-chooseout");
				chosenDecoNum[parentPage] = -1;
				if(parentPage == 2 && chosenDecoNum.toString() == [-1,-1,-1].toString()){
					$(".submit-button").hide();
				}
			}else{
				if($(this).hasClass("is-scrolled")){
					$(this).removeClass("is-touched is-scrolled");
				}else{
					$("[data-vote-page='"+ parentPage +"'] .is-chosen").removeClass("is-chosen");
					$(this).addClass("is-chosen").removeClass("is-touched");
					chosenDecoNum[parentPage] = parseInt($(this).data("deco-id"));
					if(parentPage == 2){
						$(".submit-button").show();
					}
				}
			}
		}
	},".deco-block");

	$(".button").on({
		"mousedown": function(){$(this).addClass("is-touched");},
		"mouseup": function(){$(this).removeClass("is-touched");}
	});
	$(".top-page").on("mousedown",function(){
		$(this).fadeOut();
	});
	$(".go-ahead").on({
		"mouseup": function(){$(".explanation").fadeOut();}
	});
	$(".next-button").on({
		"mouseup": function(){openPage = movePage(openPage,"next",chosenDecoNum);}
	});
	$(".prev-button").on({
		"mouseup": function(){openPage = movePage(openPage,"prev",chosenDecoNum);}
	});
	$(".quit-button").on("mouseup",function(){
		$(".top-page").fadeIn(500);
		$(".explanation").delay(500).show(0);
		initialize();
	});
	$(".submit-button").on({
		"mouseup": function(){
			$(".confirm-window,.confirm-window__bg").fadeIn(500);
			showConfirmWindow(chosenDecoNum,voteData);
		}
	});
	$(".submit-quit").on("mouseup",function(){
		$(".confirm-window,.confirm-window__bg").fadeOut(500);
	});
	$(".submit-confirmed").on({
		"mouseup": function(){
			voteData = voteToDeco(chosenDecoNum,voteData);
			// fs.writeFile("../data/data.csv",iconv.encode(Papa.unparse(voteData,{header:true}), "Shift_JIS"));
			$(".confirm-window,.confirm-window__bg").fadeOut(500);
			$(".thanks-page").fadeIn(500);
		}
	});
	$(".thanks-page").on("click",function(){
		$(this).delay(250).fadeOut(500);
		$(".top-page").fadeIn(500);
		$(".explanation").delay(500).show();
		initialize();
	});
});