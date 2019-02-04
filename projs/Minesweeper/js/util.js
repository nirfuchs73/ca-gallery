var BLUE = '#0000FF';
var GREEN = '#008000';
var RED = '#FF0000';
var BLACK = '#000000';
var DARKGRAY = '#A9A9A9';
var LIGHTGRAY = '#D3D3D3';
var DARKBLUE = '#00008B';
var DARKRED = '#8B0000';
var SMILE = '🙂';
var SMILE_SUNGLASSES = '😎';
var SAD_FACE = '☹️';
var LIGHT_BULB = '💡';

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isExistInArray(locations, location) {
    for (var i = 0; i < locations.length; i++) {
        var item = locations[i];
        if (item.i === location.i && item.j === location.j) {
            return true;
        }
    }
    return false;
}

function emptyArry(array) {
    array.splice(0, array.length);
}
