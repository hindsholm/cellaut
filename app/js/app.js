
function MyController($scope, $timeout) {
    'use strict';

    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        timer;

    function scroll() {
        var imageData = context.getImageData(0, 1, canvas.width, canvas.height - 1);
        context.putImageData(imageData, 0, 0);
    }

    function drawLine(generation) {
        var y = Math.min(generation, canvas.height - 1),
            imageData = context.getImageData(0, y, canvas.width, 1),
            data = imageData.data,
            n = data.length;
        for (var i = 0; i < n; i += 4) {
            data[i] = i % 256;
            data[i + 1] = (2 * i) % 256;
            data[i + 2] = (generation * i) % 256;
            data[i + 3] = 255;
        }
        context.putImageData(imageData, 0, y);
    }

    function nextGeneration() {
        if ($scope.generation >= canvas.height) {
            scroll();
        }
        drawLine($scope.generation);
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
        stop();
    });

    $scope.generation = 0;

}
