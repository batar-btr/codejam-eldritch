const tracker = document.querySelector('.tracker');
const deck = document.querySelector('.deck img');
const deckAmount = document.querySelector('.deck-amount');
const currentCardWrap = document.querySelector('.current-card');

const renderCardsAmount = deck => deckAmount.textContent = deck.length;

function renderTracker(stages) {
    for (let stage in stages) {
        for (let key in stages[stage]) {
            let elem = document.querySelector(`.${stage} .${key}`);
            elem.textContent = stages[stage][key];
        }
    }
}

function renderGameBoard(shuffleDeck, stages) {

    let scopeStages = {
        firstStage: {...stages.firstStage},
        secondStage: {...stages.secondStage},
        thirdStage: {...stages.thirdStage}
    }
    
    renderCardsAmount(shuffleDeck);
    currentCardWrap.innerHTML = '';

    deck.onclick = () => {
        if (shuffleDeck.length > 0) {
            const currentCard = shuffleDeck.pop();
            const { color, stage, cardFace } = currentCard;
            scopeStages[stage][`${color}Cards`] -= 1;
            renderTracker(scopeStages);

            let box = document.querySelector(`.${stage} .${color}Cards`);
            box.classList.remove('light');
            box.classList.add('light');
            
            const img = new Image();
            img.src = cardFace;

            img.addEventListener('load', () => {
                currentCardWrap.innerHTML = '';
                currentCardWrap.append(img);
            })

        }
        renderCardsAmount(shuffleDeck);
    };
}

export { renderTracker, renderGameBoard };