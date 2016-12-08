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

                api.themes.structureFolder(
                    {
                        id:     vm.theme._id,
                        path:   '.'
                    },

                    function (result) {
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
                    }

                        // Manel, este método no funciona si el nombre de la carpeta tiene espacios.
                        // Solo tiene en cuenta la primera parte del texto.
                        // Como se deben cambiar los métodos en las llamdas (este debería ser un POST)
                        // igual este problema se soluciona.
                        api.themes.createFolder(
                            {
                                id:     vm.theme._id,
                                // MANEL!!!!
                                // Como el parentFolder es absoluto dentro del servidor, esta acción
                                // crea una nueva estructura dentro de la carpeta del thema.
                                // En lugar de crar:
                                // /carpeta/del/proyecto/data/theme/xxxxx/folderName
                                // Crea la siguiente estructura:
                                // /carpeta/del/proyecto/data/theme/xxxxx/carpeta/del/proyecto/data/theme/xxxxx/folderName
                                // Ya lo he indicado antes, el path que llega del servidor debe ser relativo al root del thema
                                path:   parentFolder + '/' + folderName
                            },

                            function (result) {
                                // LA API NO RETORNA NADA!!!!
                                // DEBERIA RETORNAR LOS DATOS DE LA NUEVA CARPETA QUE SE 
                                // HA CREADO!!
                                console.log('add: OK', result);

                                vm.tree.append({
                                    id: parentFolder + '/' + folderName, 
                                    text: folderName, 
                                    items: [], 
                                    expanded: false, 
                                    spriteCssClass:'folder'
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

                // are you sure??
                console.log('Remove file: ' + item.id);

                vm.tree.remove(selectedNode);
            }

        };

        /*
         * MLM: no es necesario bindar la estructura de datos
         *      es necesario introducir controles externos (botones) para añadir/eliminar elementos
         *      del treeview.
         *      Estas acciones se aplicarán al elemento seleccionado del árbol.

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
                    // id:     nodeId++,
                    // Pau: El ID puede ser el path. De este modo podremos
                    //      lanzar las peticiones al servidor
                    //      El path no debe ser absoluto!!!!! debería ser relativo
                    //      a la carpeta del thema.
                    id:     entry.fullPath,
                    text:   entry.name
                };

                if (entry.type == 'directory') {
                    node.spriteCssClass = "folder";
                    node.expanded = false;
                    node.items = dumpStructureToTreeView( entry.contents );
                } else if (entry.type == 'file') {
                    node.spriteCssClass = "html";
                } else {
                    console.log('dumpStructureToTreeView: incorrect type !!!');
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