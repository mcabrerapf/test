// --------------------------------------------------------------------------------------
//  Middleware específico de la collection 'themes'
// --------------------------------------------------------------------------------------

'use strict';

const filesystem = require('./utils/filesystem');

module.exports = {

    collectionRoutes: 	[
        { path: 'folder.get',		middleware: filesystem.listRootFolder,  detail: true },
        { path: 'folder.post',      middleware: filesystem.createSubFolder, detail: true },
		{ path: 'folder.delete',	middleware: filesystem.deleteFolder,	detail: true },

        //{ path: 'file.post',      	middleware: filesystem.createSubFolder, detail: true },
		{ path: 'file.put',			middleware: filesystem.renameEntryFS,	detail: true },
		{ path: 'file.delete',		middleware: filesystem.deleteFile,		detail: true }
    	
    	/*
    	{ path: 'uploadfile', 		middleware: uploadFile,					detail: true },
		*/
    ]

};

// --------------------------------------------------------------------------------------
