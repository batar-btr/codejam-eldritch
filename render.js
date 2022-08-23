const tracker = document.querySelector('.tracker');

function render(stages) {
    for(let stage in stages) {
        for(let key in stages[stage]) {
            let elem = document.querySelector(`.${stage} .${key}`);
            elem.textContent = stages[stage][key];
        }
    }
}

export default render;