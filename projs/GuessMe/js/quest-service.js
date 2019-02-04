var gQuestsTree;
var gCurrQuest;
var gPrevQuest = null;
const TREE_KEY = 'tree';

function createQuestsTree() {
    gQuestsTree = loadFromStorage(TREE_KEY);
    if (!gQuestsTree) {
        gQuestsTree = createQuest('Male?');
        gQuestsTree.yes = createQuest('Gandhi');
        gQuestsTree.no = createQuest('Rita');
    }

    gCurrQuest = gQuestsTree;

    gPrevQuest = null;
}

function createQuest(txt) {
    return {
        txt: txt,
        yes: null,
        no: null
    }
}

function isChildless(node) {
    return (node.yes === null && node.no === null)
}

function moveToNextQuest(res) {
    //update the prev, curr global vars
    gPrevQuest = gCurrQuest;
    gCurrQuest = gCurrQuest[res];
}

function addGuess(newQuestTxt, newGuessTxt, res) {
    //Create and Connect the 2 Quests to the quetsions tree
    var newQuest = createQuest(newQuestTxt);
    newQuest.yes = createQuest(newGuessTxt);
    newQuest.no = gCurrQuest;
    gPrevQuest[res] = newQuest;
    saveToStorage(TREE_KEY, gQuestsTree);
}

function getCurrQuest() {
    return gCurrQuest;
}


