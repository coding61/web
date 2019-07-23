
/*QuestionHelp*/
var QuestionHelp = {
	// 选择题，判断option是否被选中在 myAnswers 中
	choiceHasItemInAnswer: function (item, myAnswers) {
		// console.log(item, myAnswers);
		if (myAnswers.indexOf(item) > -1) {
			return true
		} else {
			return false
		}
	},
	// 选择题，显示你选的答案
	choiceMyAnswerToString: function (myAnswers) {
		return myAnswers.join(",");
	},
	// 填空题的action 帮助方法
	blankQuestionAction: function (actions, myAnswers) {
		var array = JSON.parse(JSON.stringify(actions));
		for (var i = 0; i < myAnswers.length; i++) {
			if (myAnswers[i].type == "blank" && myAnswers[i].content != "") {
				// 如果空白选项中有内容，则把对应 action 中的内容去掉
				var index = myAnswers[i].index;
				console.log(myAnswers[i].index, myAnswers[i].content, myAnswers[i].type);
				// array[index]["content"] = "";
				array[index].content = "";
			}
		}
		console.log("新 action:", array, actions);
		return array;
	},
	// 填空题显示你选的答案
	blankMyAnswerToString: function (myAnswers) {
		var answers = [];
		for (var i = 0; i < myAnswers.length; i++) {
			if (myAnswers[i].type == "blank") {
				// 未知选项，
				answers.push(myAnswers[i].content);
			}
		}
		return answers.join(",");
	},
	// 顺序题显示你选的答案
	sequenceMyAnswerToString: function (myAnswers) {
		var answers = [];
		for (var i = 0; i < myAnswers.length; i++) {
			answers.push(myAnswers[i].content);
		}
		return answers.join(",");
	},
	arrayToString: function (arr) {
		var str = arr.join(",");
		return str;
	},
}

//模板帮助方法 
template.helper('choiceHasItemInAnswer', function (content, myAnswer) {
	return QuestionHelp.choiceHasItemInAnswer(content, myAnswer);
});
template.helper('choiceMyAnswerToString', function (myAnswer) {
	return QuestionHelp.choiceMyAnswerToString(myAnswer);
});
template.helper('blankQuestionAction', function (actions, myAnswers) {
	return QuestionHelp.blankQuestionAction(actions, myAnswers);
});
template.helper('blankMyAnswerToString', function (myAnswers) {
	return QuestionHelp.blankMyAnswerToString(myAnswers);
});
template.helper('sequenceMyAnswerToString', function (myAnswers) {
	return QuestionHelp.sequenceMyAnswerToString(myAnswers);
});
template.helper('arrayToString', function (arr) {
	return QuestionHelp.arrayToString(arr);
});

//模板帮助方法 
template.helper('TheMessage', function (message) {
	try {
		// var msg = message.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g, "<br/>")
		var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\n/g, "<br/>");
		return msg
	}
	catch (err) {
		return message;
	}
});

/*选择题，填空题，顺序题模板*/
var choiceTemplate = '<!-- 选择题 overlay -->\
		<script type="text/html" id="choice-problem-view-template">\
			<div class="choice-problem-view">\
				<div class="choice-exercise-view">\
					<!-- 题目 -->\
					<div class="choice-question-view">\
						<span class="choice-question-view-title">{{item.message}}</span>\
						\
						{{if item.imgs && item.imgs.length}}\
						<div class="choice-question-view-imgs">\
							{{each item.imgs}}\
								<div class="choice-question-view-img"><img class="img" src="{{$value}}" alt=""></div>\
							{{/each}}\
						</div>\
						{{/if}}\
					</div>\
					<!-- 选项 -->\
					<ul class="choice-options">\
						{{each item.options}}\
						<li class="choice-option {{choiceHasItemInAnswer($value.content, myAnswerArr)?"choice-option-select":"choice-option-unselect"}}" data-choiceType="{{item.choiceType}}" data-content="{{$value.content}}">\
							<span class="choice-option-letter">{{$value.content}}.</span>\
							<div class="choice-option-view">\
								{{if $value.message}}\
								<span class="choice-option-view-title">{{$value.message}}</span>\
								{{/if}}\
								{{if $value.imgs && $value.imgs.length}}\
								<div class="choice-option-view-imgs">\
									{{each $value.imgs}}\
										<div class="choice-option-view-img"><img class="img" src="{{$value}}" alt=""></div>\
									{{/each}}\
								</div>\
								{{/if}}\
							</div>\
						</li>\
						{{/each}}\
					</ul>\
				</div>\
				{{if typeView === "mistake"}}\
				<!-- 结果展示 -->\
				<div class="answer-view">\
					<div class="answer-view-right">\
						<span class="answer-view-right-label">正确答案</span>\
						<span class="answer-view-right-text">{{item.answer}}</span>\
					</div>\
					<div class="answer-view-your">\
						<span class="answer-view-your-label">你的答案</span>\
						<span class="answer-view-your-text">{{choiceMyAnswerToString(myAnswerArr)}}</span>\
					</div>\
					<div class="{{item.answer == choiceMyAnswerToString(myAnswerArr)?"answer-view-result-blue":"answer-view-result-red"}}">\
						<span class="{{item.answer == choiceMyAnswerToString(myAnswerArr)?"answer-view-result-blue-text":"answer-view-result-red-text"}}">{{item.answer == choiceMyAnswerToString(myAnswerArr)?"正确":"错误"}}</span>\
					</div>\
				</div>\
				{{/if}}\
			</div>\
		</script>'
var blankTemplate = '<!-- 填空题 overlay -->\
		<script type="text/html" id="blank-problem-view-template">\
			<div class="blank-problem-view">\
				<div class="blank-exercise-view">\
					<div class="blank-question-view">\
						<span class="blank-question-view-title">{{item.message}}</span>\
					</div>\
					\
					<div class="blank-question-options">\
						{{each myAnswerArr}}\
						<div class="blank-question-option {{$value.type==="blank"? !$value.content? "blank-question-option-blank":"blank-question-option-exist":""}}">\
							<span class="blank-question-option-title">{{$value.content}}</span>\
						</div>\
						{{/each}}\
					</div>\
					<div class="blank-question-actions">\
						{{each actions}}\
						<div class="blank-question-action {{!$value.content? "blank-question-action-unselect":"blank-question-action-select"}}" data-index="{{$index}}">\
							<span class="blank-question-action-title">{{$value.content}}</span>\
						</div>\
						{{/each}}\
					</div>\
				</div>\
				{{if typeView === "mistake"}}\
				<div class="answer-view">\
					<div class="answer-view-right">\
						<span class="answer-view-right-label">正确答案</span>\
						<span class="answer-view-right-text">{{arrayToString(item.answer)}}</span>\
					</div>\
					<div class="answer-view-your">\
						<span class="answer-view-your-label">你的答案</span>\
						<span class="answer-view-your-text">{{blankMyAnswerToString(myAnswerArr)}}</span>\
					</div>\
					<div class="{{arrayToString(item.answer) == blankMyAnswerToString(myAnswerArr)?"answer-view-result-blue":"answer-view-result-red"}}">\
						<span class="{{arrayToString(item.answer) == blankMyAnswerToString(myAnswerArr)?"answer-view-result-blue-text":"answer-view-result-red-text"}}">{{arrayToString(item.answer) == blankMyAnswerToString(myAnswerArr)?"正确":"错误"}}</span>\
					</div>\
				</div>\
				{{/if}}\
			</div>\
		</script>'
var sequenceTemplate = '<!-- 顺序题 -->\
		<script type="text/html" id="sequence-problem-view-template">\
			<div class="sequence-problem-view">\
				<div class="sequence-exercise-view">\
					<div class="sequence-question-view">\
						<span class="sequence-question-view-title">{{item.message}}</span>\
						<div class="sequence-question-view-imgs">\
							{{each item.imgs}}\
								<div class="sequence-question-view-img"><img class="img" src="{{$value}}" alt=""></div>\
							{{/each}}\
						</div>\
					</div>\
					<div class="sequence-question-options" id="sequence-question-options">\
						{{each myAnswerArr}}\
						<div class="sequence-question-option" data-content="{{$value.content}}">\
							<div class="sequence-question-option-view">\
								<span class="sequence-question-option-view-title"><span class="sequence-question-view-number">{{$value.content}}</span>{{$value.message}}</span>\
							</div>\
							<div class="sequence-question-option-imgs">\
								{{each $value.imgs}}\
									<div class="sequence-question-option-img"><img class="img" src="{{$value}}" alt=""></div>\
								{{/each}}\
							</div>\
							<img class="sequence-question-option-move" src="../../statics/images/move.png" alt="">\
						</div>\
						{{/each}}\
					</div>\
				</div>\
				{{if typeView === "mistake"}}\
				<div class="answer-view">\
					<div class="answer-view-right">\
						<span class="answer-view-right-label">正确答案</span>\
						<span class="answer-view-right-text">{{arrayToString(item.answer)}}</span>\
					</div>\
					<div class="answer-view-your">\
						<span class="answer-view-your-label">你的答案</span>\
						<span class="answer-view-your-text">{{sequenceMyAnswerToString(myAnswerArr)}}</span>\
					</div>\
					<div class="{{arrayToString(item.answer) == sequenceMyAnswerToString(myAnswerArr)?"answer-view-result-blue":"answer-view-result-red"}}">\
						<span class="{{arrayToString(item.answer) == sequenceMyAnswerToString(myAnswerArr)?"answer-view-result-blue-text":"answer-view-result-red-text"}}">{{arrayToString(item.answer) == sequenceMyAnswerToString(myAnswerArr)?"正确":"错误"}}</span>\
					</div>\
				</div>\
				{{/if}}\
			</div>\
		</script>';
$("body").append(choiceTemplate);
$("body").append(blankTemplate);
$("body").append(sequenceTemplate);


var a = '<div class="question-shadow-view">\
			<div class="question-close-view">关闭</div>\
			<div class="question-exercise-view">\
				<!-- 选择题、填空题、顺序题 -->\
			</div>\
			<div class="question-submit-view">提交</div>\
		</div>'

var dic = { "message": "是否掌握编程基础", "options": [{ "message": "是", "content": "A" }, { "message": "否", "content": "B" }], "action": [{ "type": "text", "content": "A" }, { "type": "text", "content": "B" }], "answer": "A", "grade": "儿童编程基础" }
var dic1 = { "type": "adaptProblem", "choiceType": "single", "message": "学习编程的目标是", "options": [{ "message": "编程基础5-8岁", "content": "A" }, { "message": "编程基础8-12岁", "content": "B" }, { "message": "NOIP", "content": "C" }, { "message": "前端", "content": "D" }, { "message": "服务器", "content": "E" }, { "message": "人工智能", "content": "G" }], "action": [{ "type": "text", "content": "A" }, { "type": "text", "content": "B" }, { "type": "text", "content": "C" }, { "type": "text", "content": "D" }, { "type": "text", "content": "E" }, { "type": "text", "content": "F" }] }
var dic2 = { "type": "adaptProblem", "answer": "C", "tag": "1", "exercises": true, "message": "scratch中能够保证角色反弹时不会头朝下的模块是：scratch中能够保证角色反弹时不会头朝下的模块是：", "imgs": [], "options": [{ "message": "scratch中能够保证角色反弹时不会头朝下的模块是", "imgs": ["https://static1.bcjiaoyu.com/%E5%9B%BE%E7%89%87%201.png"], "content": "A" }, { "message": "分解爱福家SD卡接发的撒卡京东方科技", "imgs": ["https://static1.bcjiaoyu.com/%E5%9B%BE%E7%89%87%202.png"], "content": "B" }, { "message": "", "imgs": ["https://static1.bcjiaoyu.com/%E5%9B%BE%E7%89%87%203.png"], "content": "C" }], "action": [{ "type": "text", "content": "A" }, { "type": "text", "content": "B" }, { "type": "text", "content": "C" }], "wrong": [{ "message": "答错了", "action": "下一条" }], "correct": [{ "message": "答对了", "action": "下一条" }] }
var dic3 = { "type": "sequenceProblem", "answer": ["1", "2", "3"], "tag": "1", "exercises": true, "message": "把大象放进冰箱的顺序？", "imgs": [], "options": [{ "message": "打开冰箱门", "imgs": [], "content": "1" }, { "message": "大象放进去", "imgs": [], "content": "2" }, { "message": "关闭冰箱门", "imgs": [], "content": "3" }], "action": [{ "type": "text", "content": "1" }, { "type": "text", "content": "2" }, { "type": "text", "content": "3" }], "wrong": [{ "message": "答错了", "action": "下一条" }], "correct": [{ "message": "答对了", "action": "下一条" }] }
var dic4 = { "tag": "1", "type": "blankProblem", "message": "请翻译我是一个男孩", "detailMessage": ["I", "", "a", ""], "options": [{ "message": "am" }, { "message": "boy" }, { "message": "i" }], "action": [{ "type": "text", "content": "am" }, { "type": "text", "content": "boy" }, { "type": "text", "content": "i" }], "answer": ["am", "boy"], "exercises": true, "wrong": [{ "message": "答错了", "action": "下一条" }], "correct": [{ "message": "答对了", "action": "下一条" }] }



var QuestionView = {
	typeView: "exercise",
	myAnswerArr: [],
	options: [],
	init: function (dic, typeView, yourAnswerArr) {
		
		QuestionView.typeView = typeView;
		QuestionView.options = [];
		QuestionView.myAnswerArr = [];

		var tempDic = dic;
		QuestionView.adjustExerciseJson(tempDic, yourAnswerArr);
	},
	adjustExerciseJson: function (item, yourAnswerArr) {
		var that = this;
		var dic = item;
		var myAnswers = [];
		// 填空题，对我的答案进行处理
		if (dic.type == "blankProblem") {
			var detailMsg = dic.detailMessage;
			for (var i = 0; i < detailMsg.length; i++) {
				var tempDic = { "content": detailMsg[i], "index": -1 };
				if (detailMsg[i]) {
					tempDic["type"] = "exist"
				} else {
					tempDic["type"] = "blank"
				}
				myAnswers.push(tempDic)
			}
			// 判断最初是否有答案
			if (yourAnswerArr && yourAnswerArr.length) {
				var tempYourAnswer = [];   //[{"content":"A", "index":0}]
				for (var i = 0; i < yourAnswerArr.length; i++) {
					for (var j = 0; j < dic.action.length; j++) {
						if (dic.action[j].content == yourAnswerArr[i]) {
							tempYourAnswer.push({ "content": yourAnswerArr[i], "index": j });
							break;
						}
					}
				}
				var j = 0;
				for (var i = 0; i < myAnswers.length; i++) {
					if (myAnswers[i].type === "blank") {
						myAnswers[i]["content"] = tempYourAnswer[j]["content"];
						myAnswers[i]["index"] = tempYourAnswer[j]["index"];
						j++;
					}
				}
			}
		} else if (dic.type === "sequenceProblem") {
			// 顺序题，对我的答案进行处理
			var options = dic.options;
			for (var i = 0; i < options.length; i++) {
				options[i]["id"] = i + 1;
				myAnswers.push(options[i]);
			}

			// 判断最初是否有答案
			if (yourAnswerArr && yourAnswerArr.length) {
				console.log("yourAnswerArr:", yourAnswerArr);
				var index = 0;
				var array = [];
				for (var i = 0; i < yourAnswerArr.length; i++) {
					for (var j = 0; j < myAnswers.length; j++) {
						if (yourAnswerArr[i] === myAnswers[j].content) {
							array.push(myAnswers[j]);
							break;
						}
					}
				}
				myAnswers = array;
			}
		} else {
			// 选择题,对我的答案进行处理
			if (yourAnswerArr && yourAnswerArr.length) {
				myAnswers = yourAnswerArr;
			}
		}

		// that.setState({
		//   item: dic,
		//   myAnswerArr: myAnswers
		// })
		var typeView = QuestionView.typeView;
		var finalDic = { item: dic, myAnswerArr: myAnswers, typeView: typeView }
		console.log(finalDic);
		if ($(".question-shadow-view").length) {
			$(".question-shadow-view").remove();
		}
		$(".chat").append(a);
		if (typeView === "exercise") {
			$(".question-submit-view").css({ display: 'flex' });
		} else {
			$(".question-submit-view").css({ display: 'none' });
		}

		if (dic.type === "blankProblem") {
			// 填空题
			finalDic["actions"] = QuestionHelp.blankQuestionAction(dic.action, myAnswers);
			var html = template("blank-problem-view-template", finalDic);
		} else if (dic.type === "sequenceProblem") {
			// 顺序题
			var html = template("sequence-problem-view-template", finalDic);
		} else {
			// 选择题
			var html = template("choice-problem-view-template", finalDic);
		}
		$(".question-exercise-view").html(html);
		if (dic.type === "sequenceProblem" && QuestionView.typeView !== "mistake") {
			// $(".sequence-question-options").sortable();
			// $(".sequence-question-option").css({cursor:"move"});
			// $( ".sequence-question-options" ).sortable();
			//    $( ".sequence-question-options" ).disableSelection();
			var byId = function (id) { return document.getElementById(id); };
			Sortable.create(byId('sequence-question-options'), {
				handle: '.sequence-question-option',
				animation: 150,
				ghostClass: "sequence-question-option-ghost",
				chosenClass: "sequence-question-option-chosen"
			});
		}

		QuestionView.clickEvent();
	},
	clickEvent: function () {
		// 关闭习题 overlay
		$(".question-close-view").unbind('click').click(function () {
			$(".question-shadow-view").css({ display: 'none' })
			$(".btn-wx-auth").attr({disabledImg:false});
		})
		//  	// 提交习题点击
		//  	$(".question-submit-view").unbind('click').click(function(){
		// if ($(".question-exercise-view").find(".choice-problem-view").length) {
		// 	console.log(QuestionView.options);
		// }else if($(".question-exercise-view").find(".blank-problem-view").length){
		// 	if ($(".blank-question-option.blank-question-option-blank").length) {
		// 		alert("需要明确的答案，才可以交卷哦！")
		// 	}
		// 	console.log(QuestionView.options);
		// }else if ($(".question-exercise-view").find(".sequence-problem-view").length) {
		// 	var myAnswers = [];
		// 	$(".sequence-question-option").each(function(item, i){
		// 		var content = $(this).attr("data-content");
		// 		myAnswers.push(content);
		// 	})
		// 	QuestionView.options = myAnswers;
		// 	console.log(QuestionView.options);
		// }
		//  	})
		// 选择题选项点击事件
		$(".choice-option").unbind('click').click(function () {
			if (QuestionView.typeView === "mistake") {
				return;
			}
			var choiceType = $(this).attr("data-choiceType");
			var content = $(this).attr("data-content");
			if (choiceType === "single") {
				// 单选题
				$(".choice-option").removeClass("choice-option-select").addClass("choice-option-unselect");
				$(this).removeClass("choice-option-unselect").addClass("choice-option-select");
				var myAnswers = [];
				myAnswers.push(content);
			} else {
				// 多选题
				if ($(this).hasClass("choice-option-select")) {
					$(this).removeClass("choice-option-select").addClass("choice-option-unselect");
				} else {
					$(this).removeClass("choice-option-unselect").addClass("choice-option-select");
				}
				var myAnswers = QuestionView.options;
				if (myAnswers.indexOf(content) > -1) {
					myAnswers.splice(myAnswers.indexOf(content), 1);
				} else {
					myAnswers.push(content);
				}
			}
			QuestionView.options = myAnswers;
			// console.log(myAnswers);
			// 选择题对用户选的答案排序
			QuestionView.options = QuestionView.options.sort();
		})
		// 填空题 option 点击事件
		$(".blank-question-option").unbind('click').click(function () {
			if (QuestionView.typeView === "mistake") {
				return;
			}
			if ($(this).hasClass("blank-question-option-exist")) {
				var content = $(this).find(".blank-question-option-title").html();
				var index = $(this).attr("data-index");
				// 找到第index个 action 为空的项
				var ele = $(".blank-question-action.blank-question-action-unselect[data-index=" + index + "]");
				ele.find(".blank-question-action-title").html(content);
				ele.removeClass("blank-question-action-unselect").addClass("blank-question-action-select");
				// 将 option 项置为空
				$(this).find(".blank-question-option-title").html("");
				$(this).removeClass("blank-question-option-exist").addClass("blank-question-option-blank");

				// 更改 QuestionView.options
				QuestionView.options.splice(QuestionView.options.indexOf(content), 1);
			}
		})
		// 填空题 action 点击事件
		$(".blank-question-action").unbind('click').click(function () {
			if (QuestionView.typeView === "mistake") {
				return;
			}
			if ($(this).hasClass("blank-question-action-unselect") || !$(".blank-question-option.blank-question-option-blank").length) {
				// action 项已为空 或 option 已填完
				return
			}
			var content = $(this).find(".blank-question-action-title").html();
			var index = $(this).attr("data-index");
			// 找到第一个 option 为空的项
			var ele = $(".blank-question-option.blank-question-option-blank").eq(0)
			ele.attr({ "data-index": index });
			ele.find(".blank-question-option-title").html(content);
			ele.removeClass("blank-question-option-blank").addClass("blank-question-option-exist");

			// 将 action 项置为空
			$(this).find(".blank-question-action-title").html("");
			$(this).removeClass("blank-question-action-select").addClass("blank-question-action-unselect");

			// 更改 QuestionView.options
			QuestionView.options.push(content);
		})

	}
}
// QuestionView.init(dic3, "exercise", []);
