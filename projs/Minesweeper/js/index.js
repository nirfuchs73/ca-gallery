console.log('Minesweeper');
// TODO
// renderCell
// expandShown

var gBoard;
var gGameInterval;
var gMinesCells;
var MINE = '💣'
var EMPTY = ' ';
var FLAG = '🚩';
var gHintMode = false;
var gUniqueLocations;

var gLevel = {
    SIZE: 4,
    MINES: 2
};

// var gGame = {
//     isOn: false,
//     shownCount: 0,
//     markedCount: 0,
//     secsPassed: 0
// };
var gGame = resetGame();

function initGame() {
    // gBoard = buildBoard([]);
    // console.log(gLevel.MINES);
    gBoard = [];
    buildBoard([]);
    gGameInterval = 0;
    gUniqueLocations = [];
    gHintMode = false;
    gGame = resetGame();
    document.querySelector('.time').innerText = '000';
    document.querySelector('.mines-count').innerText = MINE + gLevel.MINES;
    document.querySelector('.game-status').innerText = SMILE;
    var elShowHints = document.querySelectorAll('.show-hint');
    for (var i = 0; i < elShowHints.length; i++) {
        elShowHints[i].innerText = LIGHT_BULB;
    }
    // Bonus: keep the best score in local storage (per level) and show it on the page
    var bestTime = localStorage.getItem('bestTime' + gLevel.SIZE);
    var text = (bestTime !== null) ? 'Best Time: ' + bestTime : 'Best Time:';
    document.querySelector('.best-time').innerText = text;

    renderBoard(gBoard);
}

function resetGame() {
    var game = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    return game;
}

function createCell(minesAroundCount, isShown, isMine, isMarked) {
    var cell = {
        minesAroundCount: minesAroundCount,
        isShown: isShown,
        isMine: isMine,
        isMarked: isMarked,
        color: BLACK,
        bgcolor: DARKGRAY
    }
    return cell;
}

function getColor(minesAroundCount) {
    // console.log(minesAroundCount);
    // var color;
    switch (minesAroundCount) {
        case 1:
            return BLUE;
        case 2:
            return GREEN;
        case 3:
            return RED;
        case 4:
            return DARKBLUE;
        case 5:
            return DARKRED;
        default:
            return BLACK;
    }
    // return color;
}

function renderCell(location, value, color) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
    elCell.style.color = color;
}

function buildBoard() {
    if (!gGame.isOn) { // initGame
        for (var i = 0; i < gLevel.SIZE; i++) {
            gBoard.push([]);
            for (var j = 0; j < gLevel.SIZE; j++) {
                gBoard[i][j] = createCell(0, false, false, false);
            }
        }
    } else { // game is on
        // set mines cells
        for (var i = 0; i < gLevel.SIZE; i++) {
            for (var j = 0; j < gLevel.SIZE; j++) {
                var cell = gBoard[i][j];
                for (var k = 0; k < gMinesCells.length; k++) {
                    if (gMinesCells[k].i === i && gMinesCells[k].j === j) {
                        console.log('mine', i, j);
                        cell.isMine = true;
                    }
                }
            }
        }
        //set mines neighbours count
        for (var i = 0; i < gLevel.SIZE; i++) {
            for (var j = 0; j < gLevel.SIZE; j++) {
                var cell = gBoard[i][j];
                if (!cell.isMine) {
                    cell.minesAroundCount = setMinesNegsCount(gBoard, i, j);
                    cell.color = getColor(cell.minesAroundCount);
                }
            }
        }
    }
    // console.log(gBoard);
}

function setMinesNegsCount(board, cellI, cellJ) {
    var count = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === cellI && j === cellJ) continue;
            var cell = board[i][j];
            if (cell.isMine) count++;
        }
    }
    return count;
}

function getNegsLocations(board, cellI, cellJ) {
    var locations = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === cellI && j === cellJ) continue;
            var location = { i: i, j: j };
            locations.push(location);
        }
    }
    return locations;
}

function renderBoard(board) {
    var strHTML = '';

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var display = EMPTY;
            if (cell.isShown) {
                if (cell.isMine) display = MINE
                else if (cell.minesAroundCount !== 0) display = cell.minesAroundCount;
            } else {
                display = cell.isMarked ? FLAG : EMPTY;
            }
            var color = cell.color;
            if (cell.isMarked || cell.isMine) {
                color = BLACK;
            }
            // var className = 'cell cell' + i + '-' + j;
            // strHTML += '<td class="' + className + '"> ' + cell + ' </td>';
            // strHTML += `<td onclick="cellClicked(this,${i},${j})" class="${className}">${cell}</td>`;
            strHTML += `<td onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j})" bgcolor="${cell.bgcolor}" style="color:${color}">${display}</td>`;
        }
        strHTML += '</tr>';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function startGame(i, j) {
    // Show a timer that starts on first click
    startTime();
    // game is on
    gGame.isOn = true;
    // get random mines cells
    gMinesCells = getMinesCells(i, j);
    // build initial board
    buildBoard();
    // show expand cells
    // expandShown(gBoard, i, j);
    emptyArry(gUniqueLocations);
    recursiveExpandShown(gBoard, i, j);
    // render board
    renderBoard(gBoard);
}

function cellClicked(elCell, i, j) {
    console.log('gHintMode', gHintMode);

    if (gGame.shownCount === 0) { //first click and Game is off
        startGame(i, j);
    } else if (gGame.isOn) { //after first click and Game is on
        if (gHintMode) { //Hint mode
            var cell = gBoard[i][j];
            if (cell.isShown) return;

            var unShownNegs = getUnShownNegs(gBoard, i, j);
            // console.log(unShownNegs);
            showHint(unShownNegs, true);
            setTimeout(showHint, 1000, unShownNegs, false);
            gHintMode = false;

        } else { // regular mode
            var cell = gBoard[i][j];
            // console.log('minesAroundCount', cell.minesAroundCount);
            // console.log('isShown', cell.isShown);
            // console.log('isMine', cell.isMine);
            // console.log('color', cell.color);
            // console.log('bgcolor', cell.bgcolor);

            var isGameOver = false;

            // Left click reveals a cell
            if (cell.isMarked) {
                return;
            }
            // if cell has no mines around recursive Expand Shown
            else if (cell.minesAroundCount === 0) {
                emptyArry(gUniqueLocations);
                recursiveExpandShown(gBoard, i, j);
                if (!cell.isShown) {
                    cell.isShown = true;
                    cell.bgcolor = LIGHTGRAY;
                    gGame.shownCount++;
                }
            } else { // cell has no mines around
                cell.isShown = true;
                cell.bgcolor = LIGHTGRAY;
                gGame.shownCount++;
                console.log(gGame.shownCount);
            }

            // When clicking a mine, all mines should be revealed
            if (cell.isMine) {
                for (var i = 0; i < gMinesCells.length; i++) {
                    var idxI = gMinesCells[i].i;
                    var idxJ = gMinesCells[i].j;
                    var mine = gBoard[idxI][idxJ];
                    mine.isShown = true;
                }
                isGameOver = true;
            }

            renderBoard(gBoard);
            checkGameOver(isGameOver);
        }
    }
}

function showHint(hintsCells, isShown) {
    for (var i = 0; i < hintsCells.length; i++) {
        var cell = hintsCells[i];
        if (isShown) {
            cell.isShown = true;
            cell.bgcolor = LIGHTGRAY;
        }
        else {
            cell.isShown = false;
            cell.bgcolor = DARKGRAY;
        }
    }
    renderBoard(gBoard);
}

function getUnShownNegs(board, cellI, cellJ) {
    // console.log('showHint', showHint);
    var hints = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            // if (i === cellI && j === cellJ) continue;
            var cell = board[i][j];
            if (!cell.isShown) {
                hints.push(cell);
            }
        }
    }
    return hints;
}

function cellMarked(elCell, i, j) {
    // console.log('gHintMode', gHintMode);
    if (gHintMode) return;

    if (gGame.shownCount === 0) { //first click and Game is off
        startGame(i, j);
    } else if (gGame.isOn) { //after first click and Game is on
        // Right click to flag/unflag a suspected cell (you cannot reveal a flagged cell)
        var cell = gBoard[i][j];
        if (!cell.isShown) {
            cell.isMarked = !cell.isMarked;
            if (cell.isMarked) {
                gGame.markedCount++;
                // cell.color = BLACK;
            } else {
                gGame.markedCount--;
                // cell.color = getColor(cell.minesAroundCount);
            }
        }
        document.querySelector('.mines-count').innerText = MINE + (gLevel.MINES - gGame.markedCount);
        renderBoard(gBoard);
        checkGameOver();
    }
}

function getMinesCells(idxI, idxJ) {
    // console.log(idxI, idxJ);
    var negsLocations = getNegsLocations(gBoard, idxI, idxJ);
    var emptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (i === idxI && j === idxJ) continue;
            var location = { i: i, j: j };
            if (!isExistInArray(negsLocations, location)) {
                emptyCells.push(location);
            }
        }
    }
    if (emptyCells.length < gLevel.MINES) {
        console.log('emptyCells too small');

    }
    // console.log(emptyCells);
    var res = [];
    for (i = 0; i < gLevel.MINES; i++) {
        var idx = getRandomIntInclusive(0, emptyCells.length - 1);
        var item = emptyCells[idx];
        res.push(item);
        emptyCells.splice(idx, 1);
    }
    // console.log(emptyCells);
    // console.log(res);
    return res;
}


function checkGameOver(isGameOver) {
    if (isGameOver) {
        gGame.isOn = false;
        stopTime();
        document.querySelector('.game-status').innerText = SAD_FACE;
        console.log('Game Over!!!');
        return;
    }

    // console.log('MINES', gLevel.MINES);
    // console.log('markedCount', gGame.markedCount);
    // console.log('shownCount', gGame.shownCount);
    // console.log('SIZE', gLevel.SIZE);

    // all the mines are flagged and all the other cells are shown
    if (gLevel.MINES === gGame.markedCount &&
        (gGame.shownCount + gLevel.MINES) === (gLevel.SIZE * gLevel.SIZE)) {
        gGame.isOn = false;
        stopTime();
        document.querySelector('.game-status').innerText = SMILE_SUNGLASSES;

        // Bonus: keep the best score in local storage (per level) and show it on the page
        var bestTime = localStorage.getItem('bestTime' + gLevel.SIZE);
        if (bestTime === null || gGame.secsPassed < bestTime) {
            localStorage.setItem('bestTime' + gLevel.SIZE, gGame.secsPassed);
            document.querySelector('.best-time').innerText = 'Best Time: ' + gGame.secsPassed;
        }
        console.log('You Win!!!');
    }
}

// function expandShown(board, cellI, cellJ) {
//     for (var i = cellI - 2; i <= cellI + 2; i++) {
//         if (i < 0 || i >= board.length) continue;
//         for (var j = cellJ - 2; j <= cellJ + 2; j++) {
//             if (j < 0 || j >= board[0].length) continue;
//             if (i === cellI && j === cellJ) continue;
//             var cell = board[i][j];
//             if (!cell.isMine) {
//                 cell.isShown = true;
//                 cell.bgcolor = LIGHTGRAY;
//                 gGame.shownCount++;
//             }
//         }
//     }
// }

function recursiveExpandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === cellI && j === cellJ) continue;
            var cell = board[i][j];
            if (!cell.isMine && !cell.isShown) {
                cell.isShown = true;
                cell.bgcolor = LIGHTGRAY;
                gGame.shownCount++;
                console.log(gGame.shownCount);
                if (cell.minesAroundCount === 0) {
                    var location = { i: i, j: j };
                    if (!isExistInArray(gUniqueLocations, location)) {
                        gUniqueLocations.push(location);
                        // console.log(gUniqueLocations);
                        // console.log(i, j);
                        recursiveExpandShown(board, i, j);
                    }
                }
            }
        }
    }
}

function startTime() {
    gGameInterval = setInterval(incrementTime, 1000);
}

function stopTime() {
    clearInterval(gGameInterval);
    gGameInterval = 0;
}

function incrementTime() {
    gGame.secsPassed++;
    var seconds = gGame.secsPassed;
    if (seconds < 100) {
        seconds = '0' + seconds;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    document.querySelector('.time').innerText = seconds;
}

function radioClicked(elRadio) {
    if (gGame.isOn) {
        checkGameOver(true);
    }
    elRadio.checked = true;

    var elLevels = document.querySelectorAll('.level');
    for (var i = 0; i < elLevels.length; i++) {
        var elLevel = elLevels[i];
        if (elLevel.checked) {
            // gNums = [...Array(parseInt(elLevel.value)).keys()];
            gLevel.SIZE = parseInt(elLevel.value);
            switch (gLevel.SIZE) {
                case 4:
                    gLevel.MINES = 2;
                    break;
                case 6:
                    gLevel.MINES = 5;
                    break;
                case 8:
                    gLevel.MINES = 15;
                    break;
            }
        }
    }
    initGame();
}

function hintClicked(elHint) {
    if (elHint.innerText !== '' && gGame.isOn) {
        // console.log('hintClicked');
        var maessage = 'Yon can safely click one (unrevealed) cell and reveal it and its neighbors for a second';
        alert(maessage);
        elHint.innerText = '';
        gHintMode = true;
    }
}
