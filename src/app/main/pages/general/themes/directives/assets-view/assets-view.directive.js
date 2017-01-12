(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .config(themeAssetsViewConfig)
        .controller('themeAssetsViewController', themeAssetsViewController)
        .directive('themeAssetsView', themeAssetsViewDirective);

    /** @ngInject */
    function themeAssetsViewConfig($translatePartialLoaderProvider)
    {
        $translatePartialLoaderProvider.addPart('app/main/pages/general/themes/directives/assets-view');
    }

    function themeAssetsViewController($scope, $mdDialog, api, $q, Upload, $translate)
    {
        var vm = this;
        vm.theme = $scope.theme;
        vm.observableStructureFolder = new kendo.data.ObservableArray([
        	{id: '/', text: '', type: 'folder'}
        ]);

        // TreeView model
        vm.treeView = {

        	options: {
                dataImageUrlField: "iconUrl",
				dragAndDrop: true,
                select: function(event) {
                    $scope.$apply(function() {
                        vm.selectedItem = vm.tree.dataItem( event.node );
                    });
                },
                navigate: function(event) {
                	console.log('navigate:', event.node);
                }
        	},

        	dataSource: vm.observableStructureFolder,

        };

        vm.onDrag = function(event) {
        };

        vm.onDrop = function(event) {
        	if (!event.valid) return;

        	console.log('drop:', event);
       		const 	src = vm.tree.dataItem( event.sourceNode )
       		,		dst = vm.tree.dataItem( event.destinationNode )
       		,		pos = event.dropPosition

       		if (!dst || dst.id === undefined || !src || src.id === undefined) {
       			event.setValid( false );
       			return;
       		}

       		console.log('drop.nodes: %s %s %s', src.id, pos, dst.id);


			const 	oldSrcPath = src.id;
			var 	newSrcPath = oldSrcPath;

			if (pos == 'over' && dst.type == 'folder') {
       			// un nivel por debajo, dentro del directorio destino
       			newSrcPath = dst.id + '/' + src.text
       		} else if (pos == 'after' || pos == 'before') {
       			// mismo nivel
				newSrcPath = dst.id.replace(/[^\/]+$/, src.text)
       		} else {
       			event.setValid( false );
       		};
			
			console.log('mv %s %s', oldSrcPath, newSrcPath, (oldSrcPath != newSrcPath) && 'do it!');
			if (oldSrcPath != newSrcPath) return rename2( src, oldSrcPath, newSrcPath );
        };

        vm.refresh = function() {

            api.themes.folder.list(
                {
                    id:     vm.theme._id
                },

                function (result) {
                    console.log('refresh: OK', result);

                    dumpStructureToTreeView( result ).forEach(function(node){
						vm.observableStructureFolder.push( node );
                    });

                	// vm.observableStructureFolder.splice(0, 1);

                    initSelectedItem();
                },
                function (error) {
                    console.log('refresh: ERROR', error);
                }                    
            );
        };

        vm.addFolder = function(event) {

			var parentNode = vm.tree.select();
			if (parentNode.length == 0) parentNode = null;

			var parentFolder = vm.selectedItem.id;

            $translate([
            	'ASSETS.DIALOG.NEW_FOLDER.TITLE',
            	'ASSETS.DIALOG.NEW_FOLDER.ASKFORNAME',
            	'ASSETS.DIALOG.NEW_FOLDER.PLACEHOLDER',
            	'ASSETS.DIALOG.NEW_FOLDER.OK',
            	'ASSETS.DIALOG.NEW_FOLDER.CANCEL'],
            	{ parentFolder: parentFolder })
            .then(function( translations ) {

	            var confirm = $mdDialog.prompt()
	                                   .title( translations['ASSETS.DIALOG.NEW_FOLDER.TITLE'] )
	                                   .textContent( translations['ASSETS.DIALOG.NEW_FOLDER.ASKFORNAME'] )
	                                   .placeholder( translations['ASSETS.DIALOG.NEW_FOLDER.PLACEHOLDER'] )
	                                   .ariaLabel( translations['ASSETS.DIALOG.NEW_FOLDER.PLACEHOLDER'] )
	                                   .targetEvent(event)
                                       .ok( translations['ASSETS.DIALOG.NEW_FOLDER.OK'] )
                                       .cancel( translations['ASSETS.DIALOG.NEW_FOLDER.CANCEL'] );

	            $mdDialog.show(confirm).then(function(folderName) {

	                if (!folderName || /^\.{1,2}$|\//.test(folderName)) return;

	                api.themes.folder.save(
	                    {
	                        id:     vm.theme._id,
	                        path:   parentFolder + (parentFolder != '/' ? '/' : '') + folderName
	                    },
	                    function (result) {
	                        console.log('add: OK', result);

	                        vm.tree.append({
	                            id:         result.path,
	                            text:       result.name,
	                            items: 		[], 
	                            expanded: 	false, 
	                            type: 		'folder',
	                    		iconUrl: 	iconUrlByType( 'folder' ),
	                            mtime: 		result.mtime
	                        }, parentNode);
	                    },
	                    function (error) {
	                        console.log('add: ERROR', error);
	                    }
	                );
	        	});
            });
        };

        vm.addFiles = function(files) {

        	const 	url 	= '/api/themes/' + vm.theme._id + '/file'
        	,		dirName	= vm.selectedItem.id

			var 	parentNode = vm.tree.select();
			if (parentNode.length == 0) parentNode = null;

        	files && files.length && files.forEach(function(file){

				Upload.upload({ url: url, data: { file: file, dirName: dirName } }).then(
                    function (result) {
                        console.log('addFiles: OK', result);

                        vm.tree.append({
                            id:  		result.data.path,
                            text:		result.data.name,
                            type: 		result.data.type,
                    		iconUrl: 	iconUrlByType( result.data.type ),
                            size: 		result.data.size,
                            mtime: 		result.data.mtime
                        }, parentNode);

                    },
                    function (error) {
                        console.log('addFiles: ERROR', error);
                    }					
				);

        	});
        };

        vm.downloadFile = function(event) {
        	window.open( vm.fileUrl( vm.selectedItem.id ), '_blank' );
        };

        vm.delete = function(event) {

            function deleteEntryFS (selectedNode) {

            	var item 		= vm.tree.dataItem( selectedNode )
                ,	type 		= item.type
                ,   entryType   = type == 'folder' ? 'folder' : 'file'

                $translate([
                	'ASSETS.DIALOG.DELETE.TITLE_FOLDER',
                	'ASSETS.DIALOG.DELETE.TITLE_FILE',
                	'ASSETS.DIALOG.DELETE.OK',
                	'ASSETS.DIALOG.DELETE.CANCEL'],
                	{ currentFolder: item.id, currentFile: item.id })
            	.then(function( translations ) {

	                var confirm = $mdDialog.confirm()
	                                       .title( type == 'folder' ?
	                                       		translations['ASSETS.DIALOG.DELETE.TITLE_FOLDER'] :
	                                       		translations['ASSETS.DIALOG.DELETE.TITLE_FILE'] )
	                                       .targetEvent(event)
	                                       .ok( translations['ASSETS.DIALOG.DELETE.OK'] )
	                                       .cancel( translations['ASSETS.DIALOG.DELETE.CANCEL'] );

	                $mdDialog.show(confirm).then(function() {

	                    api.themes[ entryType ].delete(
	                        {
	                            id:     vm.theme._id,
	                            path:   item.id
	                        },
	                        function (result) {
	                            console.log('delete: OK', result);

	                            var parentNode = vm.tree.parent( selectedNode );

	                            if (parentNode.length == 0) {
	                                initSelectedItem();
	                            } else {
	                                vm.tree.select( parentNode );
	                                vm.selectedItem = vm.tree.dataItem( parentNode );                                
	                            };

	                            vm.tree.remove( selectedNode );

	                        },
	                        function (error) {
	                            console.log('delete: ERROR', error);
	                        }
	                    );

	                });

				});

            };

            var selectedNode = vm.tree.select();

            if (selectedNode.length != 0) deleteEntryFS( selectedNode );
        };

        vm.rename = function(newName) {
        	console.log('rename:', newName);

			// No puede ser vacío, ni ser {'.', '..'}, ni contener '/'
			if (!newName || /^\.{1,2}$|\//.test(newName)) return $q.reject();

           	var oldType = vm.selectedItem.type
            ,	oldPath = vm.selectedItem.id
			,	newPath = oldPath.replace(/[^\/]+$/, newName)

			return rename2( vm.selectedItem, oldPath, newPath, function(result){
				if (oldType != 'folder') vm.selectedItem.set("type", result.type);
			});
		};

		vm.boundariesTreeView = function(event) {
			if(!($.contains(vm.tree.wrapper[0], event.target))) {
                initSelectedItem();
            }
		};

		vm.outsideTreeView = function(event) {
            initSelectedItem();
		};

		vm.fileUrl = function(path) {
			return '/assets/themes/' + vm.theme._id + path;
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
        function initSelectedItem() {
			vm.selectedItem = vm.tree.dataItem( vm.tree.findByText('') );
			vm.tree.select($());
        };

        //////////
        function iconUrlByType(type) {
        	const type2icon = {
        		'unknown': 	'file',
        		'folder': 	'folder-outline',
        		'image': 	'file-image',
        		'audio':	'file-music',
        		'video':	'file-video',
        		'web': 		'file-xml',
        		'plain': 	'file-document',
        		'pdf': 		'file-pdf',
        		'doc': 		'file-word',
        		'ppt': 		'file-powerpoint',
        		'xls': 		'file-excel'
        	};
			return '/assets/icons/treeview/' + type2icon[ type ] + '.svg';
        };

        function dumpStructureToTreeView(dump) {
            return dump.map(function(entry){
                var node = {
                    id: 		entry.path,
                    text: 		entry.name,
                    type: 		entry.type,
                    iconUrl: 	iconUrlByType( entry.type ),
                    mtime: 		entry.mtime
                };

                if (entry.type == 'folder') {
                    node.expanded   = false;
                    node.items      = dumpStructureToTreeView( entry.contents );
                } else {
                	node.size		= entry.size;
                };

                return node;
            });
        };


        //////////
        function rename2(srcItem, oldPath, newPath, onOk) {

        	function changePath(oldPath, newPath, items) {
        		items && items.forEach(function(node){
        			node.id = node.id.replace( RegExp("^" + oldPath), newPath );
        			node.items && changePath( oldPath, newPath, node.items );
        		});
        	};

           	var def = $q.defer()

            api.themes.file.rename(
            	{
            		id: 		vm.theme._id,
					oldpath: 	oldPath,
					newpath: 	newPath
            	},
                function(result) {
                	srcItem.set("id", 	result.path);
	                srcItem.set("text", result.name);

	                // si es directorio, cambia path del contenido
	                changePath( oldPath, newPath, srcItem.items );

	                onOk && onOk(result);

              	    console.log('rename2.result:', result);

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