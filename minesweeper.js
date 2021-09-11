var gameOver = false;
var gameRunning = false;
var map = [];

var rows = 0;
var columns = 0;
var width = 0;

var mines = 0;
var time = 0;

var locked = false;

setInterval(setTime, 1000);

function init(rows, columns, mines) {
    this.rows = rows;
    this.columns = columns;
    this.mines = mines;

    setGrid();
}

function setGrid() {
    $('.difficulty').removeClass('animate-move-center-left');
    $('.difficulty').addClass('animate-move-right-center');
    $('.difficulty').one('animationend', function() {
        if (locked) return;
        locked = true;
        
        $('.difficulty').hide();
        $('#topbar').show();

        var grid = '';
        for (var i = 0 ; i < rows ; i++) {
            grid += '<div class="row full-width"><div class="col-12 center-flex">';
            for (var j = 0 ; j < columns ; j++) {
                grid += '<span class="cell unclicked" id="span_' + (i * columns + j) + '" position="' + (i * columns + j) + '"></span>';
            }
            grid += '</div></div>';
        }

        $('.container').append(grid);
        $('#mine_count').html(mines);
        setCells();
    });
}

function setCells() {
    width = parseInt($('.container').css('width')) / columns;
    $('.cell').css('width', width);
    $('.cell').css('height', width);

    $('.cell').mousedown(function(event) {
        if (gameOver) return;

        switch (event.which) {
            case 1:
                position = parseInt($(this).attr('position'));
                if (!gameRunning) start(position);
                leftClick(position, true);
                break;
            case 3:
                if (!gameRunning) return;
                if ($(this).hasClass('rightclicked')) {
                    $(this).removeClass('rightclicked');
                    $(this).html('');
                } else {
                    $(this).addClass('rightclicked');
                    $(this).html('<img src="flag.png" class="mine-flag" width="' + (width - 4) + 'px" height="' + (width - 4) + 'px">');
                }

                break;
            default:
        }

        var mines_left = Math.max(0, mines - $('.mine-flag').length);
        $('#mine_count').html(mines_left);
        if (mines_left == 0) win();
    });
}

function leftClick(position, revealNeighbors = false) {
    if ($('#span_' + position).hasClass('leftclicked') && revealNeighbors) {
        var neighbors = getNeighbors(position);
        for(var i = 0 ; i < neighbors.length ; i++) {
            if (!$('#span_' + neighbors[i]).hasClass('rightclicked')) {
                leftClick(neighbors[i]);
            }
        }
    } else {
        $('#span_' + position).removeClass('rightclicked');
        $('#span_' + position).html('');
        $('#span_' + position).removeClass('unclicked');
        $('#span_' + position).addClass('leftclicked');

        var data = map[position];
        if (data == 0) {
            var visited = Array(rows * columns).fill(0);
            dfs(position, visited);
        } else if (data > 8) {
            explode();
        } else {
            $('#span_' + position).addClass('color_' + data);
            $('#span_' + position).html('<label class="cell-label">' + data + '</label>');
        }
    }
}

function newGame() {
    map = [];
    gameOver = false;
    gameRunning = false;
    time = 0;
    $('#time_count').html(time);
    $('#mine_count').html(mines);
    $('.cell').html('');
    $('.cell').removeClass().addClass('cell').addClass('unclicked');
    $('#play').html('New Game');
}

function start(position) {
    gameRunning = true;
    map = Array(rows * columns).fill(0);
    map[position] = -1;
    floodFill(position, 0);
    generateMap();
}

function explode() {
    gameOver = true;
    gameRunning = false;
    for(var i = 0 ; i < map.length ; i++) {
        if (map[i] > 8 && !$('#span_' + i).hasClass('rightclicked')) {
            $('#span_' + i).html('<img src="mine.png" width="' + (width - 4) + 'px" height="' + (width - 4) + 'px">');
        }
    }

    $('#play').html('Retry?');
}

function win() {
    var mines_found = 0;
    for(var i = 0 ; i < map.length ; i++) {
        if (map[i] > 8 && $('#span_' + i).hasClass('rightclicked')) mines_found++;
    }

    if (mines == mines_found) {
        gameOver = true;
        gameRunning = false;
        $('#play').html('Congrats!');
    }
}

function setTime() {
    if (!gameRunning) return;
    time++;
    $('#time_count').html(time);
}

function dfs(position, visited) {
    if (visited[position] == 1) return;
    visited[position] = 1;
    $('#span_' + position).removeClass('rightclicked');
    $('#span_' + position).html('');
    $('#span_' + position).removeClass('unclicked');
    $('#span_' + position).addClass('leftclicked');
    $('#span_' + position).addClass('color_0');

    var neighbors = getNeighbors(position);
    for(var i = 0 ; i < neighbors.length ; i++) {
        if (map[neighbors[i]] == 0) {
            dfs(neighbors[i], visited);
        } else {
            leftClick(neighbors[i]);
        }
    }
}

function floodFill(position, noflood) {
    var neighbors = getNeighbors(position);
    if (neighbors.length == 0) return;

    if (noflood < 100) {
        neighbor = (Math.random() * neighbors.length) | 0;
        if (map[neighbors[neighbor]] != -1) {
            map[neighbors[neighbor]] = -1;
            floodFill(neighbors[neighbor], noflood + 10);
        }
    }
}

function generateMap() {
    for(var i = 0 ; i < mines ; i++) {
        position = (Math.random() * map.length) | 0;
        if (map[position] == 0 && neighborsNonZero(position)) {
            map[position] = 9;
        } else {
            i--;
        }
    }

    for(var position = 0 ; position < map.length ; position++) {
        if (map[position] > 8) {
            row = (position / columns) | 0;
            column = position % columns;

            if (row > 0) {
                neighbor2_position = ((row - 1) * columns + column);
                map[neighbor2_position]++;
                if (column > 0) {
                    neighbor1_position = neighbor2_position - 1;
                    map[neighbor1_position]++;
                }
                if (column < columns - 1) {
                    neighbor3_position = neighbor2_position + 1;
                    map[neighbor3_position]++;
                }
            }

            if (column > 0) {
                neighbor4_position = position - 1;
                map[neighbor4_position]++;
            }

            if (column < columns - 1) {
                neighbor6_position = position + 1;
                map[neighbor6_position]++;
            }

            if (row < rows - 1) {
                neighbor8_position = ((row + 1) * columns + column);
                map[neighbor8_position]++;
                if (column > 0) {
                    neighbor7_position = neighbor8_position - 1;
                    map[neighbor7_position]++;
                }
                if (column < columns - 1) {
                    neighbor9_position = neighbor8_position + 1;
                    map[neighbor9_position]++;
                }
            }
        }
    }

    for(var position = 0 ; position < map.length ; position++) {
        if (map[position] == -1) map[position] = 0;
    }
}

function getNeighbors(position) {
    neighbors = new Array();

    // Neighbor 1
    if (position > columns && position % columns != 0) {
        neighbors.push(position - columns - 1);
    }

    // Neighbor 2
    if (position >= columns) {
        neighbors.push(position - columns);
    }

    // Neightbor 3
    if (position >= columns && (position + 1) % columns != 0) {
        neighbors.push(position - columns + 1);
    }

    // Neighbor 4
    if (position % columns != 0) {
        neighbors.push(position - 1);
    }

    // Neighbor 6
    if ((position + 1) % columns != 0) {
        neighbors.push(position + 1);
    }

    // Neighbor 7
    if (position < rows * columns - columns && position % columns != 0) {
        neighbors.push(position + columns - 1);
    }

    // Neighbor 8
    if (position < rows * columns - columns) {
        neighbors.push(position + columns);
    }

    // Neighbor 9
    if (position < rows * columns - columns && (position + 1) % columns != 0) {
        neighbors.push(position + columns + 1);
    }

    return neighbors;
}

function neighborsNonZero(position) {
    neighbors = getNeighbors(position);

    for(var i = 0 ; i < neighbors.length ; i++) {
        if (map[neighbors[i]] == -1) {
            return false;
        }
    }

    return true;
}