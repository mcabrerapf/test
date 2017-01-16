(function () {
    'use strict';

    angular
        .module('app.pages.general.users')
        .controller('ImportUsersController', ImportUsersController);

    /** @ngInject */
    function ImportUsersController(customers, $q, $scope, api, $mdToast, $state) {
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
            excelImport: function (e) {
                e.promise.done(function () {
                    setData();
                    $scope.$apply();
                });
            }
        };

        vm.input = $('.file-input');
        vm.input.on("change", function () {
            vm.spreadsheet.fromFile(this.files[0]);
        });

        // Methods
        vm.goBack = goBack;
        vm.openFile = openFile;
        vm.setRange = setRange;
        vm.setColumn = setColumn;
        vm.importUsers = importUsers;

        function goBack() {
            $state.go('app.users');
        }

        function openFile($event) {
            vm.input.click();
        }

        function setRange() {
            if (vm.sheet) {
                var r = vm.sheet.selection();
                var left = getColumn(r._ref.topLeft.col);
                var top = r._ref.topLeft.row + 1;
                var right = getColumn(r._ref.bottomRight.col);
                var bottom = r._ref.bottomRight.row + 1;
                vm.range = left + top + ':' + right + bottom;
            }
        }

        function setColumn(field) {
            if (vm.sheet) {
                var r = vm.sheet.selection();
                vm[field] = getColumn(r._ref.topLeft.col);
            }
        }

        function importUsers($event) {
            var range = vm.range;
            var values = vm.sheet.range(range).values();
            values.shift();
            var emailIndex = getIndex(vm.emailColumn);
            var userNameIndex = getIndex(vm.userNameColumn);
            var sellerCodeIndex = getIndex(vm.sellerCodeColumn);

            var headerRange = range.replace(/[0-9]+/g, vm.headerRow)
            var headers = vm.sheet.range(headerRange).values()[0]

            var users = [];
            values.forEach(function (value) {

                var data = formatData(headers, value);
                var sellerCode = (sellerCodeIndex > -1) ? value[sellerCodeIndex] : '';
                var email = (emailIndex > -1) ? value[emailIndex] : '';
                var userName = (userNameIndex > -1) ? value[userNameIndex] : '';
                var employeeIdField = reformatString(headers[sellerCodeIndex]);

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
                        userName: userName,
                        employeeIdField: employeeIdField,
                        customer: vm.customer,
                        extraData: [data]
                    });
                }
            });

            var promises = [];

            for (var i = 0; i < users.length; i += 50) {
                var chunk = users.slice(i, i + 50)
                promises.push(api.users.import({users: chunk}).$promise);
            }

            $q.all(promises).then(function (data) {
                console.log(data);
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Operación realizada correctamente')
                        .position('top right')
                );
                goBack();
            }, function (err) {
                console.log(error);
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(error)
                        .position('top right')
                );
            });
        }

        function formatData(headers, value) {
            var data = {}
            for (var i = 0; i < headers.length; i++) {
                if (headers[i]) {
                    var key = reformatString(headers[i])
                    data[key] = value[i]
                }
            }
            return data;
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
                index += i * columns.length + columns.indexOf(column.charAt(i).toLowerCase());
            }
            return index;
        }

        function getColumn(index) {
            var columns = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var ent = Math.floor(index / columns.length);
            var mod = index % columns.length;
            return columns.charAt(ent - 1) + columns.charAt(mod)
        }

        function reformatString(s) {
            s = s || '';
            var r = s.toLowerCase();
            r = r.replace(new RegExp(/\s/g), "");
            r = r.replace(new RegExp(/[àáâãäå]/g), "a");
            r = r.replace(new RegExp(/æ/g), "ae");
            r = r.replace(new RegExp(/ç/g), "c");
            r = r.replace(new RegExp(/[èéêë]/g), "e");
            r = r.replace(new RegExp(/[ìíîï]/g), "i");
            r = r.replace(new RegExp(/ñ/g), "n");
            r = r.replace(new RegExp(/[òóôõö]/g), "o");
            r = r.replace(new RegExp(/œ/g), "oe");
            r = r.replace(new RegExp(/[ùúûü]/g), "u");
            r = r.replace(new RegExp(/[ýÿ]/g), "y");
            r = r.replace(new RegExp(/\W/g), "");
            return r;
        };

        $scope.$watch('vm.selectedSheet', function (newValue, oldValue) {
            if (newValue) {
                vm.sheet = getSheet(newValue);
                vm.spreadsheet.activeSheet(vm.sheet);
            }
        });

        $scope.$watch('vm.emailColumn', function (newValue, oldValue) {

        });

        $scope.$on("kendoRendered", function (e) {
            setData();
        });
    }
})();
