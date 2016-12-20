(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('themeAssetsViewController', themeAssetsViewController)
        .directive('themeAssetsView', themeAssetsViewDirective);

    /** @ngInject */
    function themeAssetsViewController($scope, $mdDialog, api, $q)
    {
        var vm = this;
        vm.theme = $scope.theme;
        vm.observableStructureFolder = new kendo.data.ObservableArray([{}]);

        // TreeView model
        vm.treeView = {

        	options: {
                loadOnDemand: true,
				dragAndDrop: true,
                select: function(e) {
                    $scope.$apply(function() {
                        vm.selectedNode = e.node;
                        vm.selectedItem = vm.tree.dataItem(vm.selectedNode);
                    });
                }
        	},

        	dataSource: vm.observableStructureFolder,

        };

        vm.refresh = function() {

            api.themes.folder.list(
                {
                    id:     vm.theme._id
                },

                function (result) {
                    console.log('refresh: OK', result);

                    var structure = dumpStructureToTreeView( result );
                    angular.forEach(structure, function(node) {
                        vm.observableStructureFolder.push(node);
                    });
                    vm.observableStructureFolder.splice(0, 1);
                },
                function (error) {
                    console.log('refresh: ERROR', error);
                }                    
            );
        };

        vm.addFolder = function(event) {

            // !! ES NECESARIO TRADUCIR TODOS ESTOS TEXTOS!!
            var confirm = $mdDialog.prompt()
                                   .title('Crear carpeta?')
                                   .textContent('Introduce el nombre de la nueva carpeta')
                                   .placeholder('nombre')
                                   .ariaLabel('Nombre carpeta')
                                   .targetEvent(event)
                                   .ok('Crear')
                                   .cancel('Cancelar');

            $mdDialog.show(confirm).then(function(folderName) {

                if (folderName === undefined) return;

                var parentFolder = '';
                var parentNode = vm.tree.select();

                if (parentNode.length > 0) {
                    var parentItem = vm.tree.dataItem(parentNode);
                    parentFolder = parentItem.id;
                } else {
                    parentNode = null;
                };

                api.themes.folder.save(
                    {
                        id:     vm.theme._id,
                        path:   parentFolder + '/' + folderName
                    },
                    function (result) {
                        console.log('add: OK', result);

                        vm.tree.append({
                            id:                 result.path,
                            text:               result.name,
                            items:              [], 
                            expanded:           false, 
                            spriteCssClass:     'folder'
                        }, parentNode);
                    },
                    function (error) {
                        console.log('add: ERROR', error);
                    }
                );
            });
        };

        vm.addFile = function(event) {
            console.log('add: create file inside');
        };

        vm.delete = function(event) {

            function deleteEntryFS (selectedNode) {

            	var item 		= vm.tree.dataItem( selectedNode )
                ,	type 		= item.spriteCssClass
                ,   titleMsg 	= 'Borrar ' + (type == 'folder' ? 'carpeta' : 'archivo') + '?'
                ,   entryType   = type == 'folder' ? 'folder' : 'file'


                // !! ES NECESARIO TRADUCIR TODOS ESTOS TEXTOS!!
                var confirm = $mdDialog.confirm()
                                       .title( titleMsg )
                                       .textContent( item.id )
                                       .targetEvent(event)
                                       .ok('Borrar')
                                       .cancel('Cancelar');

                $mdDialog.show(confirm).then(function() {

                    api.themes[ entryType ].delete(
                        {
                            id:     vm.theme._id,
                            path:   item.id
                        },
                        function (result) {
                            console.log('delete: OK', result);

                            vm.tree.remove( selectedNode );
                        },
                        function (error) {
                            console.log('delete: ERROR', error);
                        }
                    );

                });
            };

            var selectedNode = vm.tree.select();

            if (selectedNode.length !== 0) deleteEntryFS( selectedNode );
        };

        vm.rename = function(newName) {
        	console.log('rename:', newName);

			// No puede ser vacío, ni contener '/' ni '..'
			if (!newName || /\/|\.\./.test(newName)) return $q.reject();

           	var def 		= $q.defer()
           	,	oldType 	= vm.selectedItem.spriteCssClass
            ,	oldPath 	= vm.selectedItem.id
			,	newPath 	= oldPath.replace(/[^\/]+$/, newName)

            api.themes.file.rename(
            	{
            		id: 		vm.theme._id,
					oldpath: 	oldPath,
					newpath: 	newPath
            	},
                function(result) {
                	vm.selectedItem.set("id", result.path);
	                vm.selectedItem.set("text", result.name);
                	if (oldType != 'folder') vm.selectedItem.set("spriteCssClass", result.type);

              	    console.log('rename.result:', result);

                    def.resolve( result );
                },
                function(error) {
                    alert(error.data.errmsg);
                    console.log(error);
                    def.reject( error );
                }
            );

			return def.promise;
        };

        // Methods


        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            vm.refresh();
        }


        ///////////////////////////////////////////////////////////////////////////////////
        function dumpStructureToTreeView(dump) {
            return dump.map(function(entry){
                var node = {
                    id:             entry.path,
                    text:           entry.name,
                    spriteCssClass: entry.type
                };

                if (entry.type == 'folder') {
                    node.expanded   = false;
                    node.items      = dumpStructureToTreeView( entry.contents );
                };

                return node;
            });
        };


        //////////


    }
    
    /** @ngInject */
    function themeAssetsViewDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                theme: '=theme'
            },
            controller: 'themeAssetsViewController',
            controllerAs: 'vm',
            templateUrl: 'app/main/pages/general/themes/directives/assets-view/assets-view.html'
        };
    }
})();