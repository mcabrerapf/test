// --------------------------------------------------------------------------------------
//  Middleware específico de la collection 'themes'
// --------------------------------------------------------------------------------------

'use strict';

const filesystem = require('./utils/filesystem');

module.exports = {

    collectionRoutes: 	[
       	{ path: 'structurefolder', 	middleware: filesystem.getStructureFolder,	detail: true },

    	{ path: 'createfolder', 	middleware: filesystem.createSubFolder,		detail: true },
		{ path: 'removefolder', 	middleware: filesystem.removeSubFolder,		detail: true }
    	
    	/*
    	{ path: 'uploadfile', 		middleware: uploadFile,					detail: true },
		{ path: 'deletefile', 		middleware: deleteFile,					detail: true }
		*/
    ]

};

// --------------------------------------------------------------------------------------
