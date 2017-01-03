(function ()
{
    'use strict';

    angular
        .module('app.dialogs')
        .controller('KpiDialogController', KpiDialogController);

    /** @ngInject */
    function KpiDialogController($scope, $mdDialog, $translate, mode, Kpi, gameService) {

        var vm = this;
        vm.kpiTypes = [
            { value: 'calculated', text: 'Calculada' },
            { value: 'loaded', text: 'Cargada' }
        ];
        vm.agregatedTypes = [
            { value: 'sum', text: 'Suma' },
            { value: 'avg', text: 'Media' }
        ];
        vm.scoreTypes = [
            { value: 'levels', text: 'Niveles de ranking' },
            { value: 'distribution', text: 'Distribución de puntos' },
            { value: 'formula', text: 'Formula' }
        ];

        // Data
        vm.TITLEKEY = 'KPIS.EDIT_TITLE';
        vm.kpi = angular.copy(Kpi);
        vm.newItem = false;
        vm.mode = mode || 'edit';

        if ( !vm.kpi )
        {
            vm.kpi = {
                name: '',
                id: '',
                type: 'loaded',
                displayformat: '#.##0,0',
                score: {
                    type: 'no'
                }
            };

            vm.TITLEKEY = 'KPIS.NEW_TITLE';
            vm.newItem = true;
        }

        vm.score = (vm.kpi.score.type !== 'no');


        // Methods
        vm.addNew = addNew;
        vm.saveItem = saveItem;
        vm.closeDialog = closeDialog;
        vm.deleteKpi = deleteKpi;


        //////////
        $scope.$watch('vm.score', function(newValue, oldValue) {
            if (newValue === false) {
                vm.kpi.score.type = 'no';
            }
        });
        $scope.$watch('vm.kpi.name', function(newValue, oldValue) {
            if (normalizeText(oldValue) === vm.kpi.id) {
                vm.kpi.id = normalizeText(newValue);
            }
        });

        $scope.$watch('vm.kpi.calculated.numerator', filterKpiDependences);

        function filterKpiDependences() {
            var currentId = Kpi ? Kpi._id : undefined;
            vm.numerators = gameService.game.kpis.filter(function(kpi) {
                if (kpi._id === currentId) return false;
                return true;
            });
            vm.denominators = gameService.game.kpis.filter(function(kpi) {
                if (kpi._id === currentId) return false;
                if (vm.kpi.calculated) {
                    if (kpi._id === vm.kpi.calculated.numerator) return false;
                }
                return true;
            });
        }

        function normalizeText(text) {
            if (text === undefined) return undefined;
            return text.replace(/ /g, '_').toLowerCase();
        }


        /**
         * Add new
         */
        function addNew() {

            gameService.addKpi(vm.kpi).then(function(newKpi) {
                closeDialog(newKpi);
            });
        }

        /**
         * Save
         */
        function saveItem() {

            gameService.updateKpi(vm.kpi).then(function(updatedKpi) {
                closeDialog(updatedKpi);
            });
        }


        /**
         * Delete kpi
         */
        function deleteKpi(event) {
            closeDialog('removeKpi');
        }


        /**
         * Close dialog
         */
        function closeDialog(result)
        {
            $mdDialog.hide(result);
        }

    }
})();
