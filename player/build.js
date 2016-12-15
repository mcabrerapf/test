
({
    baseUrl: './',
    dir: './build',
    optimize: 'uglify',
    // removeCombined: true,
    paths: {
        'requirejs': '../bower_components/requirejs/require',
        'text': '../bower_components/text/text',
        'domReady': '../bower_components/domReady/domReady',
        'jquery': '../bower_components/jquery/dist/jquery',
        'angular': '../bower_components/angular/angular',
        'angular-router': '../bower_components/angular-ui-router/release/angular-ui-router',
        'angular-translate': '../bower_components/angular-translate/angular-translate',
        'angular-dynamic-locale': '../bower_components/angular-dynamic-locale/dist/tmhDynamicLocale',
        'angular-animate': '../bower_components/angular-animate/angular-animate',
        'angular-aria': '../bower_components/angular-aria/angular-aria',
        'angular-messages': '../bower_components/angular-messages/angular-messages',
        'angular-material': '../bower_components/angular-material/angular-material',
        'lodash': '../bower_components/lodash/dist/lodash.core',
        'main-module': 'app/module/main'
    },
    shim: {
        'angular': {
          'deps': [ 'jquery' ],
          'exports': 'angular'
        },
        'angular-router': [ 'angular' ],
        'angular-translate' : ['angular'],
        'angular-dynamic-locale' : ['angular'],
        'angular-animate' : ['angular'],
        'angular-aria' : ['angular'],
        'angular-messages' : ['angular'],
        'angular-material': ['angular', 'angular-aria', 'angular-messages']
    },
    modules: [
        {
            name: 'app/main',
            include: [
                'requirejs',
                'translate/loader'
            ],

            /*
            // Use the *shallow* exclude; otherwise, dependencies of
            // the FAQ module will also be excluded from this build
            // (including jQuery and text and util modules). In other
            // words, a deep-exclude would override our above include.
            excludeShallow: [
                'views/faq'
            ]
            */
        },
        {
            name: 'translate/es',
            exclude: [
                'text',
                'translate/loader'
            ]
        },
        {
            name: 'translate/ca',
            exclude: [
                'text',
                'translate/loader'
            ]
        }
    ]
})