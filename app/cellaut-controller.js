/*global angular: false */

angular.module('CellAutApp')

    .controller('CellAutCtrl', function ($scope, $timeout, cellaut) {
        'use strict';

        var timer,
            vm = this;

        function onTimeout() {
            cellaut.nextGeneration();
            timer = $timeout(onTimeout, 50);
        }

        vm.start = function start() {
            if (!timer) {
                timer = $timeout(onTimeout, 50);
            }
        };

        vm.stop = function stop() {
            if (timer) {
                $timeout.cancel(timer);
                timer = null;
            }
        };

        $scope.$on("destroy", function () {
            vm.stop();
        });

        vm.cellaut = cellaut;

    });
