/*global angular: false */

angular.module('CellAutApp')

    .controller('CellAutCtrl', function ($scope, $timeout, cellaut) {
        'use strict';

        var timer;

        function onTimeout() {
            cellaut.nextGeneration();
            timer = $timeout(onTimeout, 50);
        }

        this.start = function start() {
            if (!timer) {
                timer = $timeout(onTimeout, 50);
            }
        };

        this.stop = function stop() {
            if (timer) {
                $timeout.cancel(timer);
                timer = null;
            }
        };

        $scope.$on("destroy", function () {
            $scope.stop();
        });

        this.cellaut = cellaut;

    });
