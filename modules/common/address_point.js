define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
	var AppBridge = require("common/app-bridge.js");

	
	exports.addressToPoint = function(fx, address){
		var map = new BMap.Map("allmap");
		var myGeo = new BMap.Geocoder();
		myGeo.getPoint(address, function(point){
			map.centerAndZoom(point, 14);
			
			fx(point);


		});	
	};
	
	exports.shop = function(fx){
		if(Common.isApp()){
			AppBridge.getValue("address", function(key, value){
				/*
				//判断地址是否为空
				if (value == 'null' || value == '' || !value) {
					//地址为空请求定位
					exports.requestLocation(fx);
				} else {
					//获取最近店铺信息
					exports.nearby_shop.getNearbyShop(value, fx);
				}
				*/
				exports.nearby_shop.getNearbyShop(value, fx);
			});
		}else{
			if (localStorage.address == null) {
				localStorage.address = '济南';
			}
			exports.nearby_shop.getNearbyShop(localStorage.address, fx);
		}
	};
	
	exports.nearby_shop = {
		load:exports.shop,
		getNearbyShop:function(address, fx){
			exports.addressToPoint(function(point){
				$.ajax({
					type: "get",
					url: Common.domain + "shop/first/",
					data: {
						position: point.lat + ',' + point.lng,
					},
					dataType: "json",
					success: function(json){

						if (json.name == '') {
							//默认城市济南
							if(Common.isApp()){
								AppBridge.setValue("address", '济南');
								exports.nearby_shop.getNearbyShop("济南");
							}else{
								if(window.localStorage){
									localStorage.address = '济南';
								}else{
									$.cookie("address", '济南', {
										path: "/"
									});
								}
								exports.nearby_shop.getNearbyShop("济南");
							}
						}else{
							fx(json);
							// fx(json.pk, json.owner);
						}
					},
					error: function(xhr, textStatus) {
						if (textStatus == "timeout") {
							Common.showToast("服务器开小差了");
						}
						Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
						console.log(textStatus);
					}
				});
			}, address);
		}
	}
	exports.pointToCity = function(longitude, latitude, fx){
		var map = new BMap.Map("allmap");
		var point = new BMap.Point(longitude, latitude);
		var geoc = new BMap.Geocoder();

		geoc.getLocation(point, function(rs){
			var addComp = rs.addressComponents;
			console.log("定位城市:" + addComp.city);
			fx(addComp.city);
		});
	}

	
	//根据经纬度，请求店铺信息，再回调
	exports.getShopInfo = function(lai, lng, fx){
		//请求店铺信息并返回
		$.ajax({
			type: "get",
			url: Common.domain + "shop/first/",
			data: {
				position: lai + ',' + lng,
			},
			dataType: "json",
			success: function(json){
				fx(json);
			},
			error: function(xhr, textStatus) {
				if (textStatus == "timeout") {
					Common.showToast("服务器开小差了");
				}
				Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
				console.log(textStatus);
			}
		});
	}

	/*
	//请求定位相关
	exports.requestLocation = function(fx){
		location.href = "aichashuo://requestlocation";
		exports.locationMyCB = fx;
	}
	exports.requestLocationCallback = function(lai, lng){
		//返回店铺信息
		exports.getShopInfo(lai, lng, function(json){
			fx(json);
		});
		
		
		//直接回调经纬度
		if(exports.locationMyCB){
			exports.locationMyCB(lai);
			exports.locationMyCB = null;
		}
	};
	
	exports.locationMyCB = null;
	
	// 客户端传的定位回调方法
	location_update_cb = function(lai, lng){
		exports.requestLocationCallback(lai, lng);
	};
	*/

});
