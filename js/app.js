(function (window) {

var DEFAULT_WIDTH = 10,
    DEFAULT_HEIGHT = 20;

//Tetris main programme
var Tetris = function (dom, w, h) {
    if ( (w && w >= 4) && (h && h >= 4)) {
        this.width = parseInt(w);
        this.height = parseInt(h);
    }
    this.init(dom);
};

Tetris.prototype = {
    constructor: Tetris,
    matrix: null,
    display: null,
    currentMino: null,
    nextMino: null,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,

    init: function (dom) {
        this.matrix = this._createMatrix(this.width, this.height);
        if (dom) {
            this.display = new TetrisDisplay(dom);
            this.display.update({
                'matrix': this.matrix
            });
        }
    },

    //create an empty matrix
    //matrix[y][x]
    _createMatrix: function (w, h) {
        var m = [], row;
        for (var i = 0; i < h; i++) {
            row = [];
            for (var j = 0; j < w; j++) {
                row.push(0);
            }
            m.push(row);
        }
        //debug
        m[18][8] = 1;
        m[18][9] = 1;
        m[19][8] = 1;
        m[19][9] = 1;
        return m;
    },

    start: function () {},

    render: function () {}
};

window.Tetris = Tetris;

//Tetromino Object
var Tetromino = function (argument) {};

Tetromino.prototype = {
    constructor: Tetromino,
    init: function () {},
    enterMatrx: function () {}
};

//Tetris Display Object
var TetrisDisplay = function (dom) {
    this.init(dom);
};

TetrisDisplay.prototype = {
    constructor: TetrisDisplay,
    dom: null,

    init: function (dom) {
        this.dom = dom;
    },

    update: function (data) {
        if (!data) return false;
        if (data.matrix) {
            var m = '', row, cell;
            try {
                for (var i = 0; i < data.matrix.length; i++) {
                    row = '';
                    for (var j = 0; j < data.matrix[i].length; j++) {
                        if (data.matrix[i][j]) {
                            cell = '<div style="display:inline-block;width:30px;height:30px;background-color:#ffee00;color:#ffffff;">' + data.matrix[i][j] + '</div>';
                        } else {
                            cell = '<div style="display:inline-block;width:30px;height:30px;background-color:#ffffff;color:#ffffff;">' + '0' + '</div>';
                        }
                        row += cell;
                    }
                    row += '<br />';
                    m = row + m;
                }
            } catch (e) {
                m = "";
                console.warn('Matrix data error!');
                console.warn(e);
                console.info('m:');
                console.info(data.matrix);
            }
            this.dom.innerHTML = m;
        }
    }
};

}) (window);

console.info("app loaded");