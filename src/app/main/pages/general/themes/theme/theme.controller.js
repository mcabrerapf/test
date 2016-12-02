(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('ThemeController', ThemeController);

    /** @ngInject */
    function ThemeController($document, $state, theme, api)
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

        // Data
        vm.theme = theme;

        vm.observableStructureFolder = new kendo.data.ObservableArray( [
            { id: 0, text: vm.theme._id, expanded: true, spriteCssClass: "rootfolder", items: [] }
        ] );

        // TreeView model
        vm.treeView = {

        	options: {
				dragAndDrop: true
        	},

        	dataSource: vm.observableStructureFolder,

            add: function(type) {
                if (type == 'folder') {
                    console.log('add: create folder inside');

                    api.themes.createFolder(
                        {
                            id:     vm.theme._id,
                            path:   'x'
                        },

                        function (result) {
                            console.log('add: OK', result);
                        },
                        function (error) {
                            console.log('add: ERROR', error);
                        }
                    );

                } else if (type == 'file') {
                    console.log('add: create file inside');

                } else {
                    console.log('add: incorrect type', type);
                };
            },

            delete: function() {
                console.log('delete:');
            }

        };

        vm.observableStructureFolder.bind("change", function(e) {
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
