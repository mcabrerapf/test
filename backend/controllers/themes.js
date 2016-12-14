// --------------------------------------------------------------------------------------
//  Middleware específico de la collection 'themes'
// --------------------------------------------------------------------------------------

'use strict';

const filesystem = require('./utils/filesystem');

module.exports = {

    collectionRoutes: 	[
        { path: 'folder.get',		middleware: filesystem.listRootFolder,  detail: true },
        { path: 'folder.post',      middleware: filesystem.createSubFolder, detail: true },
		{ path: 'folder.delete',	middleware: filesystem.removeSubFolder,	detail: true }
    	
    	/*
    	{ path: 'uploadfile', 		middleware: uploadFile,					detail: true },
		{ path: 'deletefile', 		middleware: deleteFile,					detail: true }
		*/
    ]

};

// --------------------------------------------------------------------------------------
