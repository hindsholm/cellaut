angular.module('CellAutApp')

    .directive('cellaut', function ($window) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                model: '='
            },
            link: function (scope, element) {
                var canvas = element[0],  // gets the DOM element from Angular's element
                    context = canvas.getContext('2d');

                function resize() {
                    canvas.width = element.parent().prop('clientWidth');
                    canvas.height = element.parent().prop('clientHeight');
                    scope.model.resize(canvas.width);
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

                scope.$watch('model.generation', function () {
                    drawLine();
                });

                angular.element($window).on('resize', function () {
                    scope.$apply(function () {
                        resize();
                    });
                });

                scope.model.init();
                resize();
            }

        };

    });
