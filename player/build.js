
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
        'anim-in-out': '../bower_components/angular-ui-router-anim-in-out/anim-in-out',
        'angular-sanitize': '../bower_components/angular-sanitize/angular-sanitize',
        'lodash': '../bower_components/lodash/dist/lodash.core',
        'materialize': '../bower_components/materialize/dist/js/materialize',
        'velocity': '../bower_components/materialize/js/velocity.min',
        'hammerjs': '../bower_components/materialize/js/hammer.min',
        'scrollfire': '../bower_components/materialize/js/scrollFire',
        'main-module': 'app/module/main'
    },
    shim: {
        'angular': {
          'deps': [ 'jquery' ],
          'exports': 'angular'
        },
        'angular-router': [ 'angular' ],
        'angular-translate' : ['angular'],
        'angular-sanitize': [ 'angular' ],
        'angular-dynamic-locale' : ['angular'],
        'angular-animate' : ['angular'],
        'anim-in-out': ['angular-animate'],
        'materialize': ['jquery', 'hammerjs', 'velocity', 'scrollFire'],
        'jquery': {
          exports: '$'
        }
    },
    modules: [
        {
            name: 'app/main',
            include: [
                'requirejs',
                'translate/loader'
            ],
            exclude: [
                'scrollfire',
                'velocity',
                'hammerjs'
            ]

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