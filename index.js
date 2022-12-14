import ancientsData from "./data/ancients.js";

import blueCards from './data/mythicCards/blue/index.js';
import brownCards from './data/mythicCards/brown/index.js';
import greenCards from './data/mythicCards/green/index.js';

import { renderTracker, renderGameBoard } from "./render.js";

const globalDeck = {
    blueCards,
    brownCards,
    greenCards
}
const ancientCards = document.querySelectorAll('.ancient-card');
const ancientsContainer = document.querySelector('.ancients');
const difficultyForm = document.querySelector('#difficulty-form');
const diffBlocks = document.querySelectorAll('.diff-block');
const shuffleBtn = document.querySelector('.shuffle-btn');
const boxes = document.querySelectorAll('.box');

const options = {
    ancient: 'azathoth',
    difficulty: 'normal'
}

let stagesCards;
let stagesNumbers;
let shuffleDeck;

const unselectAll = collection => collection.forEach(item => item.classList.remove('active'));

const sortCards = cards => cards.sort((a, b) => Math.random() - 0.5);

const getCards = (deckName, difficulty, cnt) => {
    const easyCards = globalDeck[deckName].filter(({ difficulty }) => difficulty === 'easy');
    const normalCards = globalDeck[deckName].filter(({ difficulty }) => difficulty === 'normal');
    const hardCards = globalDeck[deckName].filter(({ difficulty }) => difficulty === 'hard');
    let cards;
    switch (difficulty) {
        case 'veryeasy':
            cards = [...sortCards(easyCards), ...sortCards(normalCards)].slice(0, cnt);
            break;
        case 'easy':
            cards = sortCards([...easyCards, ...normalCards]).slice(0, cnt);
            break;
        case 'normal':
            cards = sortCards(globalDeck[deckName]).slice(0, cnt);
            break;
        case 'hard':
            cards = sortCards([...normalCards, ...hardCards]).slice(0, cnt);
            break;
        case 'veryhard':
            cards = [...sortCards(hardCards), ...sortCards(normalCards)].slice(0, cnt);
            break;
    }
    return cards;
}

const shuffleCard = ({ ancient, difficulty }) => {
    const data = ancientsData.find(item => item.id === ancient);
    const { firstStage, secondStage, thirdStage } = data;

    let numbers = {
        firstStage, secondStage, thirdStage
    }

    const stages = {
        firstStage,
        secondStage,
        thirdStage
    }

    const deck = [firstStage, secondStage, thirdStage].reduce((a, b) => {
        let result = {};
        for (let key in b) {
            result[key] = (a[key] || 0) + b[key];
        }
        return result;
    }, {});

    let newCardsSet = {};

    for (let [key, value] of Object.entries(deck)) {
        newCardsSet[key] = sortCards(getCards(key, difficulty, value));
    }
    for (let stageName in stages) {
        let stage = stages[stageName];
        let cards = {}
        for (let [key, value] of Object.entries(stage)) {
            cards[key] = newCardsSet[key].splice(0, value);
            cards[key].forEach(item => item.stage = stageName);
        }
        stages[stageName] = cards;
    }
    stagesCards = stages;
    stagesNumbers = numbers;

    renderTracker(numbers);

    boxes.forEach(box => box.classList.remove('light'));
    
    shuffleDeck = [
        ...sortCards([
            ...stages.firstStage.greenCards,
            ...stages.firstStage.blueCards,
            ...stages.firstStage.brownCards]),
        ...sortCards([
            ...stages.secondStage.greenCards,
            ...stages.secondStage.blueCards,
            ...stages.secondStage.brownCards]),
        ...sortCards([
            ...stages.thirdStage.greenCards,
            ...stages.thirdStage.blueCards,
            ...stages.thirdStage.brownCards]),
    ].reverse();

    renderGameBoard(shuffleDeck, numbers);
}

const ancientCardsHandler = ({ target }) => {
    if (target.classList.contains('ancient-card-img')) {
        unselectAll(ancientCards);
        target.parentElement.classList.add('active');
        const ancient = target.getAttribute('alt');
        options.ancient = ancient;
    } else {
        return;
    }
};

const difficultyFormHandler = event => {
    unselectAll(diffBlocks);
    const activeBlock = document.querySelector(`#${event.target.value}`).parentElement;
    activeBlock.classList.add('active');
    options.difficulty = event.target.value;
}

ancientsContainer.addEventListener('click', ancientCardsHandler);
difficultyForm.addEventListener('change', difficultyFormHandler);
shuffleBtn.addEventListener('click', () => shuffleCard(options));

boxes.forEach(box => box.addEventListener('animationend',() => box.classList.remove('light')));

console.log('gh-pages deploy test');