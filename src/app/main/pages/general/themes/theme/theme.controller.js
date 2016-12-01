(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('ThemeController', ThemeController);

    /** @ngInject */
    function ThemeController($scope, $document, $state, theme)
    {

/***
        var theArray_0 = [
			{ id: 1, text: "Item 1", expanded: true, spriteCssClass: "rootfolder", items: [
				{ id: 2, text: "Item 2", expanded: true, spriteCssClass: "folder", items: [
				  	{ id: 21, text: "SubItem 2.1", expanded: true, spriteCssClass: "pdf" },
				  	{ id: 22, text: "SubItem 2.2", expanded: true, spriteCssClass: "html" }
				] },
				{ id: 3, text: "Item 3", expanded: true, spriteCssClass: "image" }
			] }
  		];
***/

        var vm = this;

//		var theArray = [{ id: 0, text: "Root", expanded: true, spriteCssClass: "rootfolder", items: [] }];
		vm.theArray = new kendo.data.ObservableArray(
			[{ id: 0, text: "Root", expanded: true, spriteCssClass: "rootfolder", items: [] }]
		);

        // Data
        vm.theme = theme;

        // TreeView model
        vm.treeView = {

        	options: {
				dragAndDrop: true
        	},

        	//dataSource: new kendo.data.ObservableArray( theArray )
        	dataSource: vm.theArray

        };

        vm.theArray.bind("change", function(e) {
        //vm.treeView.dataSource.bind("change", function(e) {
    		console.log("changed", e.action, e.index, e.items, e.field);
    		switch (e.action) {
    			case 'itemchange':
    				e.items.forEach(function(item){
    					console.log(e.action, ":", item.text, "->", e.field, '=', item[e.field]);
    				});
    				break;
    			case 'add':
    			case 'remove':
    				e.items.forEach(function(item){
    					console.log(e.action, ":", item.text, "->", e.index);
    				});
    				break;
    			default:
    				console.log('action:', e.action);
    		}
    	});


        // Methods
        vm.gotoThemes = gotoThemes;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
        }

        /**
         * Go to products page
         */
        function gotoThemes()
        {
            $state.go('app.themes');
        }


    }
})();
