define(["main-module","text!./game.html"],function(e,t){"use strict";e.CompileProvider.directive("bgGame",function(){var e=["$scope",function(e){console.log("GAME")}];return{restrict:"E",replace:!0,template:t,controller:e}})});