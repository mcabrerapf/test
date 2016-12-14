(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('assetsViewController', assetsViewController)
        .directive('assetsView', assetsViewDirective);

    /** @ngInject */
    function assetsViewController($scope, $mdDialog, api)
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


            /*
             * Pau: Manel, no veo claro que mezcles estas funciones aqui.
             *      Estos métodos se disparan por la interface y tu los estás metiendo
             *      dentro de la estructura que alimenta el TreeView ...
             *      Creo que deberian colgar directamente de la VM.
             */
            refresh: function() {

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
                        // vm.treeView.tree.setDataSource( vm.observableStructureFolder );
                    },
                    function (error) {
                        console.log('refresh: ERROR', error);
                    }                    
                );
            },

            addFolder: function(event) {

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
            },

            addFile: function(event) {
                console.log('add: create file inside');
            },

            delete: function(event) {
                var selectedNode = vm.tree.select();
                if (selectedNode.length === 0) return;

                var item = vm.tree.dataItem(selectedNode);

                // !! ES NECESARIO TRADUCIR TODOS ESTOS TEXTOS!!
                var confirm = $mdDialog.confirm()
                                       .title('Borrar carpeta?')
                                       .textContent( item.id )
                                       .targetEvent(event)
                                       .ok('Borrar')
                                       .cancel('Cancelar');

                $mdDialog.show(confirm).then(function() {

                    api.themes.folder.delete(
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
            }

        };

        /*
         * MLM: no es necesario bindar la estructura de datos
         *      es necesario introducir controles externos (botones) para añadir/eliminar elementos
         *      del treeview.
         *      Estas acciones se aplicarán al elemento seleccionado del árbol.
        */


        // Methods


        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            vm.treeView.refresh();
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
    function assetsViewDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                theme: '=theme'
            },
            controller: 'assetsViewController',
            controllerAs: 'vm',
            templateUrl: 'app/main/pages/general/themes/directives/assets-view/assets-view.html'
        };
    }
})();