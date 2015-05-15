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
        var that = this;
        this.matrix = this._createMatrix(this.width, this.height);
        if (dom) {
            this.display = new TetrisDisplay(dom);
            this.display.update({
                'matrix': this.matrix
            });
        }
        setInterval(function () {
            if (that.currentMino) {
                that.currentMino.moveDown();
            } else {
                that.currentMino = new Tetromino();
                that.currentMino.enterMatrx(5);
            }
            that.render();
            console.log('done.');
        }, 1000);
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
        // m[0][8] = 1;
        // m[0][9] = 1;
        // m[1][8] = 1;
        // m[1][9] = 1;
        return m;
    },

    start: function () {},

    render: function () {
        var currentMatrix = [], row, currentMinoPos, currentMinoType;

        for (var r = 0; r < this.matrix.length; r++) {
            row = [];
            for (var c = 0; c < this.matrix[r].length; c++) {
                row.push(this.matrix[r][c]);
            }
            currentMatrix.push(row);
        }

        if (this.currentMino) {
            currentMinoType = 1; // temporary 1 used
            currentMinoPos = this.currentMino.getCurrentPosition();
            for (var i = 0; i < currentMinoPos.length; i++) {
                currentMatrix[currentMinoPos[i][1]][currentMinoPos[i][0]] = currentMinoType;
            }
        }
        this.display.update({
            'matrix': currentMatrix
        });
    }
};

window.Tetris = Tetris;

//Tetromino Object
var Tetromino = function (difficulty, index, status) {
    this.init(difficulty);
};

Tetromino.prototype = {
    constructor: Tetromino,
    x: null,
    y: null,
    difficulty: null,
    index: null,
    status: null,
    init: function (difficulty, index, status) {
        if (!difficulty) difficulty = "demo";
        if (!index && index != 0) index = 0;
        if (!status && status != 0) status = 0;
        this.difficulty = difficulty;
        this.index = index;
        this.status = status;
    },

    enterMatrx: function (x, y) {
        if (!x) {
            this.x = 0;
            console.info('enterMatrx: x is not defined.');
        } else {
            this.x = x;
        }        
        if (y) {
            this.y = y;
            console.info('enterMatrx: specified y set.');
        } else {
            this.y = 0;
        }
        console.log(this.getCurrentPosition());
    },

    //fixPosition: function () {},

    moveDown: function () {
        this.y = this.y + 1;
    },

    moveLeft: function () {
        this.x = this.x - 1;
    },

    moveRight: function () {
        this.x = this.x + 1;
    },

    rotate: function () {},

    getCurrentPosition: function () {
        if (this.x === null || this.y === null) {
            return null;
        }
        var arr = [],
            baseArr = this.shapes[this.difficulty][this.index][this.status];
        for (var i = 0; i < baseArr.length; i++) {
            arr.push([]);
            arr[i][0] = baseArr[i][0] + this.x;
            arr[i][1] = baseArr[i][1] + this.y;
        }
        return arr;
    },

    getMoveDownPosition: function () {
        if (this.x === null || this.y === null) {
            return null;
        }
        var arr = [],
            x = this.x,
            y = this.y + 1,
            baseArr = this.shapes[this.difficulty][this.index][this.status];
        for (var i = 0; i < baseArr.length; i++) {
            arr.push([]);
            arr[i][0] = baseArr[i][0] + x;
            arr[i][1] = baseArr[i][i] + y;
        }
        return arr;
    },
    
    getMoveLeftPosition: function () {
        if (this.x === null || this.y === null) {
            return null;
        }
        var arr = [],
            x = this.x - 1,
            y = this.y,
            baseArr = this.shapes[this.difficulty][this.index][this.status];
        for (var i = 0; i < baseArr.length; i++) {
            arr.push([]);
            arr[i][0] = baseArr[i][0] + x;
            arr[i][1] = baseArr[i][i] + y;
        }
        return arr;
    },
    
    getMoveRightPosition: function () {
        if (this.x === null || this.y === null) {
            return null;
        }
        var arr = [],
            x = this.x + 1,
            y = this.y,
            baseArr = this.shapes[this.difficulty][this.index][this.status];
        for (var i = 0; i < baseArr.length; i++) {
            arr.push([]);
            arr[i][0] = baseArr[i][0] + x;
            arr[i][1] = baseArr[i][i] + y;
        }
        return arr;
    },

    getRotatePosition: function () {}
};

//definite different types of shapes
Tetromino.prototype.shapes = {
    "demo": 
    [//diff
        [
            [[0, 0], [1, 0], [1, 1], [1, 2]]
        ],
        [
            [[0, 0], [0, 1], [1, 0], [1, 1]]
        ],
        [//index
            [[0, 0]] //status //points [x, y]
        ]
    ]
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
                    m = m + row;
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