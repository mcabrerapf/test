(function () {
    'use strict';

    angular
        .module('app.pages.general.users')
        .controller('ImportUsersController', ImportUsersController);

    /** @ngInject */
    function ImportUsersController(customers, $rootScope, $scope, translateValues, api, $mdDialog, $state, $filter, $timeout, $element) {
        var vm = this;

        vm.customers = customers;
        vm.columnPattern = /^[a-zA-Z]{1,2}$/

        $rootScope.$on('$viewContentLoaded', function (event) {
            setData()
            vm.input = $('.file-input')

            vm.input.on("change", function () {
                vm.spreadsheet.fromFile(this.files[0]).then(function (a, b, c) {
                    console.log(a, b, c)
                }, function (err) {
                    console.log(err);
                });
            });
        });


        vm.spreadsheetOptions = {
            toolbar: {
                insert: false,
                data: false,
                home: false
            },
            sheetsbar: false,
            excelImport: excelImport
        };

        // Methods
        vm.goBack = goBack;
        vm.openFile = openFile;
        vm.importUsers = importUsers;

        function goBack() {
            $state.go('app.users');
        }

        function openFile($event) {
            vm.input.click();
        }

        function importUsers($event) {
            console.log('import');
            var range = vm.startColumn + vm.startRow + ':' + vm.endColumn + vm.endRow;
            var values = vm.sheet.range(range).values();
            var emailIndex = getIndex(vm.emailColumn);
            var userNameIndex = getIndex(vm.userNameColumn);
            var sellerCodeIndex = getIndex(vm.sellerCodeColumn);
            var teamBossIndex = getIndex(vm.teamBossColumn)

            var headers = null
            if (vm.headerRow) {
                range = vm.startColumn + vm.headerRow + ':' + vm.endColumn + vm.headerRow;
                headers = vm.sheet.range(range).values()[0];
            }
            var users = [];
            values.forEach(function (value) {
                var data = {}
                if (headers) {
                    data = formatData(headers, value)
                } else {
                    data = value
                }

                var sellerCode = (sellerCodeIndex > -1) ?  value[sellerCodeIndex] : '';
                var teamBoss = (teamBossIndex > -1) ?  value[teamBossIndex] : '';
                var email = (emailIndex > -1) ?  value[emailIndex] : '';
                var userName = (userNameIndex > -1) ?  value[userNameIndex] : '';
                var password = generatePasword()

                var user = users.find(function(user){
                    return user.email === value[emailIndex];
                });

                if(user) {
                    user.code.push({
                        sellerCode: sellerCode,
                        teamBoss: teamBoss
                    });
                    console.log(user);
                } else {
                    users.push({
                        email: email,
                        password: password,
                        userName: userName,
                        code: [{
                            sellerCode: sellerCode,
                            teamBoss: teamBoss
                        }],
                        customer: vm.customer,
                        data: data
                    });
                }
            });
            api.users.import({users: users})
            console.log(users);
        }

        function formatData(headers, value) {
            var data = {}
            for (var i = 0; i < headers.length; i++) {
                if (headers[i]) {
                    var key = headers[i].replace(' ', '_')
                    data[headers[i]] = value[i]
                }
            }
            return data;
        }

        function excelImport(e) {
            e.promise.done(setData);
        }

        function setData() {
            vm.spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");
            vm.selectedSheet = vm.spreadsheet.activeSheet().name();
            vm.sheets = vm.spreadsheet.toJSON().sheets;
            vm.sheet = getSheet(vm.selectedSheet);
            vm.columns = vm.sheet.toJSON().columns;
            vm.rows = vm.sheet.toJSON().rows;
            vm.startRow = 1;
            vm.endRow = 1;
            vm.startColumn = '';
            vm.endColumn = '';
            vm.headerRow = null;
            vm.emailColumn = '';
            vm.userNameColumn = '';
            vm.sellerCodeColumn = '';
            vm.customer = '';
            vm.data = {};
        }

        function getSheet(name) {
            var sheets = vm.spreadsheet.sheets();
            return sheets.find(function (sheet) {
                return sheet.name() === name;
            })
        }

        function markRange() {
            var r = vm.emailColumn + vm.startRow + ':' + vm.emailColumn + vm.endRow;
            var range = vm.sheet.range(r);
            range.background('#ddd')
        }

        function getIndex(column) {
            var columns = 'abcdefghijklmnopqrstuvwxyz';
            var index = 0;
            for (var i = 0; i < column.length; i++) {
                index += i * columns.length + columns.indexOf(column.charAt(i));
            }
            return index;
        }

        function generatePasword() {
            var chars = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
            var pass = ''
            for(var i = 0; i < 8; i++){
                pass += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            console.log(pass);
            return pass;
        }

        $scope.$watch('vm.selectedSheet', function (newValue, oldValue) {
            if (newValue) {
                vm.sheet = getSheet(newValue);
                vm.spreadsheet.activeSheet(vm.sheet);
            }
        });

        $scope.$watch('vm.emailColumn', function (newValue, oldValue) {

        });
    }
})();
