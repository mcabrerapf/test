// --------------------------------------------------------------------------------------
//  Middleware específico de la collection 'themes'
// --------------------------------------------------------------------------------------

'use strict';

const filesystem = require('./utils/filesystem');

module.exports = {

    collectionRoutes: 	[
       	{ path: 'structurefolder', 	middleware: filesystem.getStructureFolder,	detail: true },

		// Pau: Manel, debemos implementar una interface lo más parecida posible a una REST API.
		//		Los métodos para crear/borrar datos del servidor deberían ejecutarse bajo los 
		// 		metodos POST/PUT/DELETE y no pasar los datos por queryString, si no mediante
		//		un objeto en el body.
    	{ path: 'createfolder', 	middleware: filesystem.createSubFolder,		detail: true },
		{ path: 'removefolder', 	middleware: filesystem.removeSubFolder,		detail: true }
    	
    	/*
    	{ path: 'uploadfile', 		middleware: uploadFile,					detail: true },
		{ path: 'deletefile', 		middleware: deleteFile,					detail: true }
		*/
    ]

};

// --------------------------------------------------------------------------------------
