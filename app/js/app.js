var app = angular.module('CellAut', []);

app.service('canvas', function() {
    'use strict';
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

    this.scroll = function() {
        var imageData = context.getImageData(0, 1, canvas.width, canvas.height - 1);
        context.putImageData(imageData, 0, 0);
    };

    this.drawLine = function(generation) {
        var y, imageData, data, n;
        if (generation >= canvas.height) {
            scroll();
        }
        y = Math.min(generation, canvas.height - 1);
        imageData = context.getImageData(0, y, canvas.width, 1);
        data = imageData.data;
        n = data.length;
        for (var i = 0; i < n; i += 4) {
            data[i] = i % 256;
            data[i + 1] = (2 * i) % 256;
            data[i + 2] = (generation * i) % 256;
            data[i + 3] = 255;
        }
        context.putImageData(imageData, 0, y);
    };
});

app.controller('CellAutCtrl', ['$scope', '$timeout', 'canvas', function($scope, $timeout, canvas) {
    'use strict';

    var timer;

    function nextGeneration() {
        canvas.drawLine($scope.generation);
        $scope.generation++;
    }

    function onTimeout() {
        nextGeneration();
        timer = $timeout(onTimeout, 50);
    }

    $scope.start = function() {
        if (!timer) {
            timer = $timeout(onTimeout, 50);
        }
    };

    $scope.stop = function() {
        if (timer) {
            $timeout.cancel(timer);
            timer = null;
        }
    };

    $scope.$on("destroy", function() {
        $scope.stop();
    });

    $scope.generation = 0;

}]);
