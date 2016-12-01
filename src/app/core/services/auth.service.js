(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('principal', principalService)
        .factory('authorization', authorizationService);

    /** @ngInject */
    function principalService($q, $http, $timeout) {

        // private variables
        var _authenticated = false;

        // public methods
        var service = {
            currentUser: undefined,
            isIdentityResolved: isIdentityResolved,
            isAuthenticated: isAuthenticated,
            isInRole: isInRole,
            isInAnyRole: isInAnyRole,
            login: login,
            logout: logout,
            identity: identity
        };

        return service;


        function isIdentityResolved() {
            return angular.isDefined(this.currentUser);
        };



        function isAuthenticated() {
            return _authenticated;
        };


        function isInRole(role) {
            if (!_authenticated || !this.currentUser.roles) return false;

            return this.currentUser.roles.indexOf(role) != -1;
        };


        function isInAnyRole(roles) {
            if (!_authenticated || !this.currentUser.roles) return false;

            for (var i = 0; i < roles.length; i++) {
                if (this.isInRole(roles[i])) return true;
            }

            return false;
        };


        function login(identity) {

            var self = this;
            var deferred = $q.defer()

            this.currentUser = identity;

            $http.post('/api/users/login', identity)

                    .success(function(data) {
                        self.currentUser = data;
                        _authenticated = true;
                        deferred.resolve(self.currentUser);
                    })

                    .error(function (error) {
                        self.currentUser = null;
                        _authenticated = false;
                        deferred.reject(error);
                    });

            return deferred.promise;
        };


        function logout() {

            var self = this;
            var deferred = $q.defer();

            $http.post('/api/users/logout')
                .success(function() {

                    self.currentUser = undefined;
                    _authenticated = false;
                    deferred.resolve();
                });

            return deferred.promise;
        };


        function identity(force) {

            var self = this;
            var deferred = $q.defer();

            if (force === true) this.currentUser = undefined;

            // check and see if we have retrieved the 
            // identity data from the server. if we have, 
            // reuse it by immediately resolving
            if (angular.isDefined(this.currentUser)) {
                deferred.resolve(this.currentUser);

                return deferred.promise;
            }

            // otherwise, retrieve the identity data from the
            // server, update the identity object, and then 
            // resolve.
            $http.get('/api/users/login')

                .success(function(data) {
                    self.currentUser = data;
                    _authenticated = true;
                    deferred.resolve(self.currentUser);
                })
                .error(function () {
                    self.currentUser = null;
                    _authenticated = false;
                    deferred.resolve(self.currentUser);
                });

            return deferred.promise;
        };

    }


    /** @ngInject */
    function authorizationService($rootScope, $state, principal) {

        // public methods
        var service = {
            authorize: authorize
        };

        return service;


        function authorize() {

            return principal.identity().then(function () {

                if ($rootScope.toState.name === 'login') return;

                var isAuthenticated = principal.isAuthenticated();

                if (!isAuthenticated) {
                    // user is not authenticated. Stow
                    // the state they wanted before you
                    // send them to the sign-in state, so
                    // you can return them when you're done
                    $rootScope.returnToState = $rootScope.toState;
                    $rootScope.returnToStateParams = $rootScope.toStateParams;

                    // now, send them to the signin state
                    // so they can log in
                    $state.go('login');

                    return;
                }

                // hay restricciones de roles ?
                if ($rootScope.toState.data !== undefined) return;
                if ($rootScope.toState.data.roles === undefined) return;
                if ($rootScope.toState.data.roles.length === 0) return;
                
                // analizamos si tiene permisos ...
                if (!principal.isInAnyRole($rootScope.toState.data.roles)) {
                    // user is signed in but not
                    // authorized for desired state
                    $state.go('accessdenied');
                }
            });
        };

    }
})();