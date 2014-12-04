/*global angular: false */

angular.module('CellAutApp')

    .controller('CellAutCtrl', function ($scope, $timeout, $window, cellaut) {
        'use strict';

        var timer;

        function onTimeout() {
            cellaut.nextGeneration();
            timer = $timeout(onTimeout, 50);
        }

        $scope.start = function () {
            if (!timer) {
                timer = $timeout(onTimeout, 50);
            }
        };

        $scope.stop = function () {
            if (timer) {
                $timeout.cancel(timer);
                timer = null;
            }
        };

        $scope.$on("destroy", function () {
            $scope.stop();
        });

        $scope.cellaut = cellaut;

    });
