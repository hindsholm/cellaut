/*jslint plusplus: true */
/*global angular: false */

angular.module('CellAutApp')

    .service('cellaut', function () {
        'use strict';

        this.rule = [];
        this.cells = [];
        this.size = 0;
        this.generation = 0;
    
        this.init = function () {
            this.cells = [];
            this.size = 0;
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

        this.resize = function (size) {
            var i;
            this.size = size;
            if (this.cells.length < this.size) {
                for (i = this.cells.length; i < this.size; ++i) {
                    this.cells[i] = Math.floor(4 * Math.random());
                }
            }
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
