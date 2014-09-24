/*jslint plusplus: true */
/*global angular: false, document: false, console: false */

var app = angular.module('CellAutApp', ['ui.bootstrap']);

app.service('cellaut', function () {
    'use strict';
    this.rule = [];
    this.cells = [];
    this.size = 0;
    this.generation = 0;

    this.init = function (size) {
        this.size = size;
        this.generation = 0;
        this.randomize();
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

    this.randomize = function () {
        var i;
        for (i = 0; i < 10; ++i) {
            this.rule[i] = Math.floor(4 * Math.random());
        }
        for (i = 0; i < this.size; ++i) {
            this.cells[i] = Math.floor(4 * Math.random());
        }
    };

});

app.controller('CellAutCtrl', ['$scope', '$timeout', '$window', 'cellaut',
    function ($scope, $timeout, $window, cellaut) {
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

    }]);

app.directive('cellaut', ['$window', function ($window) {
    'use strict';
    
    return {
        restrict: 'A',
        scope: {
            model : '='
        },
        link: function (scope, element, atttributes) {
            var canvas = element[0],  // gets the DOM element from Angular's element
                context = canvas.getContext('2d');
            
            function resize() {
                canvas.width = element.parent().prop('clientWidth');
                canvas.height = element.parent().prop('clientHeight');
                scope.model.init(canvas.width);
            }
            
            function scroll() {
                var imageData = context.getImageData(0, 1, canvas.width, canvas.height - 1);
                context.putImageData(imageData, 0, 0);
            }

            function drawLine() {
                var model = scope.model, y, imageData, data, n, i, cell;
                if (model.generation >= canvas.height) {
                    scroll();
                }
                y = Math.min(model.generation, canvas.height - 1);
                imageData = context.getImageData(0, y, canvas.width, 1);
                data = imageData.data;
                n = data.length;
                for (i = 0; i < n; i += 4) {
                    cell = model.cells[i / 4];
                    data[i] = (cell === 1) ? 255 : 0;
                    data[i + 1] = (cell === 2) ? 255 : 0;
                    data[i + 2] = (cell === 3) ? 255 : 0;
                    data[i + 3] = 255;
                }
                context.putImageData(imageData, 0, y);
            }

            scope.$watch('model.generation', function (newValue, oldValue) {
                // console.log('Model change, generation = ' + scope.model.generation);
                drawLine();
            });
            
            angular.element($window).on('resize', function () {
                scope.$apply(function () {
                    resize();
                });
            });
            
            resize();
        }

    };

}]);

app.directive('cellvalue', function () {
    'use strict';
    var OK_PATTERN = /^[0-3]$/;
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (OK_PATTERN.test(viewValue)) {
                    ctrl.$setValidity('cellvalue', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('cellvalue', false);
                    return 0;
                }
            });
        }
    };
});
