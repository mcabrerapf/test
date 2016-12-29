(function () {
    'use strict';

    angular
        .module('app.pages.general.users')
        .controller('ImportUsersController', ImportUsersController);

    /** @ngInject */
    function ImportUsersController(customers, $rootScope, $scope, api, $mdDialog, $state, $filter, $timeout, $element) {
        var vm = this;

        vm.customers = customers;
        vm.columnPattern = /^[a-zA-Z]{1,2}$/
        vm.rangePattern = /^[a-zA-Z]{1,2}[0-9]+:[a-zA-Z]{1,2}[0-9]+$/

        vm.spreadsheetOptions = {
            toolbar: {
                insert: false,
                data: false,
                home: false
            },
            sheetsbar: false,
            excelImport: function(e) {
                e.promise
                    .progress(function(e) {
                        console.log(kendo.format("{0:P} complete", e.progress));
                    })
                    .done(function() {
                        setData()
                    });
            }
        };

        // Methods
        vm.goBack = goBack;
        vm.openFile = openFile;
        vm.setRange = setRange;
        vm.importUsers = importUsers;

        function goBack() {
            $state.go('app.users');
        }

        function openFile($event) {
            kendo.destroy($("#spreadsheet"));
            // $("#spreadsheet").data("kendoSpreadsheet").destroy();
            $('#spreadsheet').empty();
            $('#spreadsheet').remove();
            $('#spreadsheetContainer').append($('<div id="spreadsheet"></div>'));
            $("#spreadsheet").kendoSpreadsheet(vm.spreadsheetOptions);
            vm.spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");
            vm.input = $('.file-input');
            vm.input.click();

            vm.input.on("change", function () {
                vm.spreadsheet.fromFile(this.files[0]);
            });
        }

        function setRange() {
            if(vm.sheet){
                var r = vm.sheet.selection();
                console.log(r);
                var left = getColumn(r._ref.topLeft.col);
                var top = r._ref.topLeft.row + 1;
                var right = getColumn(r._ref.bottomRight.col);
                var bottom = r._ref.bottomRight.row + 1;
                vm.range = left + top + ':' + right + bottom;
            }
        }

        function importUsers($event) {
            var range = vm.range;
            var values = vm.sheet.range(range).values();
            var emailIndex = getIndex(vm.emailColumn);
            var userNameIndex = getIndex(vm.userNameColumn);
            var sellerCodeIndex = getIndex(vm.sellerCodeColumn);
            var teamLeaderIndex = getIndex(vm.teamLeaderColumn)

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

                var sellerCode = (sellerCodeIndex > -1) ? value[sellerCodeIndex] : '';
                var teamLeader = (teamLeaderIndex > -1) ? value[teamLeaderIndex] : '';
                var email = (emailIndex > -1) ? value[emailIndex] : '';
                var userName = (userNameIndex > -1) ? value[userNameIndex] : '';
                var password = generatePasword()

                var user = users.find(function (user) {
                    return user.email === value[emailIndex];
                });

                if (user) {
                    user.code.push({
                        sellerCode: sellerCode,
                        teamLeader: teamLeader
                    });
                } else {
                    users.push({
                        email: email,
                        password: password,
                        userName: userName,
                        code: [{
                            sellerCode: sellerCode,
                            teamLeader: teamLeader
                        }],
                        customer: vm.customer,
                        extraData: data
                    });
                }
            });

            console.log(users.length)
            for (var i = 0; i < users.length; i += 50) {
                var chunk = users.slice(i, i + 50)
                api.users.import({users: chunk})
            }
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
            // e.promise.done(setData);
        }

        function setData() {
            vm.spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");
            vm.selectedSheet = vm.spreadsheet.activeSheet().name();
            vm.sheets = vm.spreadsheet.toJSON().sheets;
            vm.sheet = getSheet(vm.selectedSheet);
            vm.columns = vm.sheet.toJSON().columns;
            vm.rows = vm.sheet.toJSON().rows;
            vm.range = '';
            vm.headerRow = 1;
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

        function getColumn(index) {
            var columns = 'abcdefghijklmnopqrstuvwxyz';
            var ent = Math.floor(index / columns.length);
            var mod = index % columns.length;
            return columns.charAt(ent - 1) + columns.charAt(mod)
        }

        function generatePasword() {
            var chars = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
            var pass = ''
            for (var i = 0; i < 8; i++) {
                pass += chars.charAt(Math.floor(Math.random() * chars.length));
            }
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
