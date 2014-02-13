var app = angular.module('CellAutApp', []);

app.service('cellaut', function () {
    'use strict';
    this.rule = [3, 3, 2, 2, 1, 1, 0, 0, 1, 1];
    this.cells = [];
    this.size = 0;
    this.generation = 0;

    this.init = function (size) {
        var i;
        this.size = size;
        for (i = 0; i < size; ++i) {
            this.cells[i] = Math.floor(4 * Math.random());
        }
        this.generation = 0;
    };

    this.nextGeneration = function () {
        var prev = 0, cur, i;
        for (i = 0; i < this.size - 1; i++) {
            cur = this.rule[prev + this.cells[i] + this.cells[i + 1]];
            prev = this.cells[i];
            this.cells[i] = cur;
        }
        this.cells[this.size - 1] = this.rule[prev + this.cells[this.size - 1]];
        this.generation += 1;
    };

});

app.service('canvas', function () {
    'use strict';
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

    this.scroll = function () {
        var imageData = context.getImageData(0, 1, canvas.width, canvas.height - 1);
        context.putImageData(imageData, 0, 0);
    };

    this.drawLine = function (cellaut) {
        var y, imageData, data, n, i, cell;
        if (cellaut.generation >= canvas.height) {
            this.scroll();
        }
        y = Math.min(cellaut.generation, canvas.height - 1);
        imageData = context.getImageData(0, y, canvas.width, 1);
        data = imageData.data;
        n = data.length;
        for (i = 0; i < n; i += 4) {
            cell = cellaut.cells[i / 4];
            data[i] = (cell === 1) ? 255 : 0;
            data[i + 1] = (cell === 2) ? 255 : 0;
            data[i + 2] = (cell === 3) ? 255 : 0;
            data[i + 3] = 255;
        }
        context.putImageData(imageData, 0, y);
    };
});

app.controller('CellAutCtrl', ['$scope', '$timeout', 'canvas', 'cellaut', function ($scope, $timeout, canvas, cellaut) {
    'use strict';

    var timer;

    function nextGeneration () {
        cellaut.nextGeneration();
        canvas.drawLine(cellaut);
        $scope.generation++;
    }

    function onTimeout() {
        nextGeneration();
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

    $scope.generation = 0;
    cellaut.init(600);
    canvas.drawLine(cellaut);

}]);
