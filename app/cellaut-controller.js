angular.module('CellAutApp')

    .controller('CellAutController', function ($scope, $timeout, cellaut) {
        'use strict';

        var timer,
            vm = this;

        vm.isRunning = false;

        function onTimeout() {
            cellaut.nextGeneration();
            timer = $timeout(onTimeout, 50);
        }

        vm.start = function start() {
            if (!timer) {
                timer = $timeout(onTimeout, 50);
            }
            vm.isRunning = true;
        };

        vm.stop = function stop() {
            if (timer) {
                $timeout.cancel(timer);
                timer = null;
            }
            vm.isRunning = false;
        };

        $scope.$on("destroy", function () {
            vm.stop();
        });

        vm.cellaut = cellaut;

    });
