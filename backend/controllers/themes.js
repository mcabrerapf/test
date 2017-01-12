// --------------------------------------------------------------------------------------
//  Middleware específico de la collection 'themes'
// --------------------------------------------------------------------------------------

'use strict';

const filesystem = require('./utils/filesystem');
var accessLevel  = require('../configuration/gamification').accessLevels;
var common       = require('../controllers/common');

module.exports = {

    collectionRoutes: 	[
        { path: 'folder.get',		middleware: filesystem.listRootFolder,  detail: true },
        { path: 'folder.post',      middleware: filesystem.createSubFolder, detail: true },
		{ path: 'folder.delete',	middleware: filesystem.deleteFolder,	detail: true },

        //{ path: 'file.post',      	middleware: filesystem.createSubFolder, detail: true },
		{ path: 'file.put',			middleware: filesystem.renameEntryFS,	detail: true },
		{ path: 'file.delete',		middleware: filesystem.deleteFile,		detail: true },
    	
    	/*
    	{ path: 'uploadfile', 		middleware: uploadFile,					detail: true },
		*/


        {
            path: 'timeline',
            submodel: true,
            detail: true,
            methods: [
                { method: 'get',        before: [common.ensureAuth], accessLevel: accessLevel.editor },
                { method: 'post', 		before: [common.ensureAuth, common.prepareData], accessLevel: accessLevel.editor },
                { method: 'put', 		before: [common.ensureAuth, common.prepareData], accessLevel: accessLevel.editor },
                { method: 'delete',		before: [common.ensureAuth], accessLevel: accessLevel.editor }
            ]
        }
    ]

};

// --------------------------------------------------------------------------------------
