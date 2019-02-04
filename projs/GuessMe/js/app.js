'use strict';

var gLastRes = null;

$(document).ready(init);

function init() {
    createQuestsTree();
}

function onStartGuessing() {
    //hide the game-start section
    $('.game-start').hide();
    renderQuest();
    // show the quest section
    $('.quest').show();
}

function renderQuest() {
    //select the <h2> inside quest and update its text by the currQuest text
    var currQuest = getCurrQuest();
    $('.quest h2').text(currQuest.txt);
}

function onUserResponse(res) {

    // If this node has no children
    var currQuest = getCurrQuest();
    if (isChildless(currQuest)) {
        if (res === 'yes') {
            alert('Yes, I knew it!');
            // TODO: improve UX
        } else {
            alert('I dont know...teach me!')
            //hide and show new-quest section
            $('.quest').hide();
            $('.new-quest').show();
        }
    } else {
        //update the lastRes global var
        gLastRes = res;
        moveToNextQuest(res);
        renderQuest();
    }
}

function onAddGuess() {
    //Get the inputs' values
    var newQuest = $('#newQuest').val();
    var newGuess = $('#newGuess').val();

    //Call the service addGuess
    addGuess(newQuest, newGuess, gLastRes);

    onRestartGame();
}


function onRestartGame() {
    $('.new-quest').hide();
    $('.game-start').show();
    gLastRes = null;
    init();
}

