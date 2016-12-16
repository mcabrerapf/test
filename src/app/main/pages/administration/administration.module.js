// (function ()
// {
//     'use strict';
//
//     angular
//         .module('app.pages.administration', [
//             'app.pages.administration.players',
//             'app.pages.administration.users',
//             'app.pages.administration.costumers',
//         ])
//         .config(config);
//
//     /** @ngInject */
//     function config($translatePartialLoaderProvider, msNavigationServiceProvider)
//     {
//         // Translation
//         $translatePartialLoaderProvider.addPart('app/main/pages/administration');
//
//         // Navigation
//         msNavigationServiceProvider.saveItem('administration', {
//             title : 'GESTIÓN DE CUSTOMERS/USUARIOS',
//             group : true,
//             weight: 1,
//             translate: 'ADMINISTRATION.MENU.SECTION_TITLE'
//         });
//     }
// })();