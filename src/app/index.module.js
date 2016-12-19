(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Quick Panel
            'app.quick-panel',

            // Common
            'app.common',

            // Dialogs
            'app.dialogs',
            
            // Filters
            'app.filters',
            
            // Pages
            'app.pages',

            
            // Sample
            'app.sample'
        ]);
})();