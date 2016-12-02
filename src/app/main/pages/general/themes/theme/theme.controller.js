(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('ThemeController', ThemeController);

    /** @ngInject */
    function ThemeController($document, $state, theme, api)
    {

        var nodeId = 1;

        function dumpStructureToTreeView (dump) {
            return dump.map(function(entry){
                var node = {
                    id:     nodeId++,
                    text:   entry.name
                };

                if (entry.type == 'directory') {
                    node.spriteCssClass = "folder";
                    node.expanded = true;
                    node.items = dumpStructureToTreeView( entry.contents );
                } else if (entry.type == 'file') {
                    node.spriteCssClass = "html";
                } else {
                    console.log('dumpStructureToTreeView: incorrect type !!!');
                };

                return node;
            });
        };

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

            // tree: {},

        	options: {
                loadOnDemand: true,
				dragAndDrop: true
        	},

        	dataSource: vm.observableStructureFolder,

            refresh: function() {
                console.log('refresh folders');
                api.themes.structureFolder(
                    {
                        id:     vm.theme._id,
                        path:   '.'
                    },

                    function (result) {
                        console.log('refresh: dump:', result);
                        vm.observableStructureFolder[0].items = dumpStructureToTreeView( result );
                        // vm.treeView.tree.setDataSource( vm.observableStructureFolder );
                    },
                    function (error) {
                        console.log('refresh: ERROR', error);
                    }                    
                );
            },

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
