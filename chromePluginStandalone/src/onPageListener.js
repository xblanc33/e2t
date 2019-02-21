import CssSelectGenerator from 'css-selector-generator';

attach();

function attach() {
    console.log('attach');

    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(
        input => {
            input.addEventListener('input', handleInput, true);
        }
    );

    const observer = new MutationObserver(handleMutation);
    const config = {
        childList: true,
        subtree: true
    };

    const all = document.querySelectorAll('*');
    all.forEach(
        element => {
            observer.observe(element, config);
        }
    );

    const selects = document.querySelectorAll('select');
    selects.forEach(
        select => {
            select.addEventListener('change', handleChange, true);
        }
    );

    window.addEventListener('click', handleClick, true);
    //window.addEventListener('mousedown', handleMouseDown, true);
    document.body.addEventListener('submit', handleSubmit, true);

    applyClickProbabilityMask();
}

function applyClickProbabilityMask() {
    const elements = document.querySelectorAll('*');

    const events = [];
    elements.forEach(element => events.push({
        type: 'click',
        selector: computeSelector(element),
        value: 'click'
    }));

    chrome.runtime.sendMessage({
        kind: 'getProbabilities',
        events
    }, {},
    response => {
        if (response && response.probabilities) {
            response.probabilities.filter(element => element.probability > 0).forEach(probability_per_selector => {
                console.log(probability_per_selector.probability);
                const element = document.querySelector(probability_per_selector.selector);
                console.log(probability_per_selector.probability);
                const value = (probability_per_selector.probability) * 255;
                element.style["outline"] = '5px solid rgb(' + value + ', ' + (255 - value) + ', 0, 0.90)';
            });
        }
    });
}

function handleInput(e) {
    if (e.type === 'input') {
        const type = e.type;
        const selector = computeSelector(e.target);
        const value = e.target.value;
        handleEvent(type, selector, value);
    }
}

function handleMutation(mutations) {
    mutations.forEach(mutationRecord => {
        if (mutationRecord.type === 'childList') {
            const addedNodes = mutationRecord.addedNodes;
            addedNodes.forEach(
                addedNode => {
                    if (addedNode.tagName) {
                        const inputs = addedNode.querySelectorAll('input, textarea');
                        inputs.forEach(
                            input => {
                                input.addEventListener('input', handleInput);
                            }
                        );
                    }
                }
            );
        }
    });
}

function handleChange(e) {
    if (e.type === 'change') {
        const type = e.type;
        const selector = computeSelector(e.target);
        const value = e.target.value;
        handleEvent(type, selector, value);
    }
}

function handleClick(e) {
    if (e.alreadyHandled) {
        return;
    }
    e.alreadyHandled = true;
    if (e.type === 'click') {
        const type = e.type;
        const selector = computeSelector(e.target);
        const value = 'click';
        handleEvent(type, selector, value);
    }
}

function handleMouseDown(e) {
    if (e.alreadyHandled) {
        return;
    }
    e.alreadyHandled = true;
    if (e.type === 'mousedown') {
        const type = e.type;
        const selector = computeSelector(e.target);
        const value = 'mousedown';
        handleEvent(type, selector, value);
    }
}

function handleSubmit(e) {
    if (e.type === 'submit') {
        const type = e.type;
        const selector = computeSelector(e.target);
        const value = 'submit';
        handleEvent(type, selector, value);
    }
}

function handleEvent(type, selector, value) {
    console.log(type);
    if (isEmpty(type)) return undefined;
    if (isEmpty(selector)) return undefined;
    if (isEmpty(value)) return undefined;
    chrome.runtime.sendMessage({
        kind: 'addEventToExpedition',
        event: {
            type: type,
            selector: selector,
            value: value
        }
    }, {},
    response => {
        applyClickProbabilityMask();
    });
    return true;
}

function isEmpty(field) {
    return field === undefined || field === null || field === "";
}

function computeSelector(el) {
    let selector;
    selector = computeSelectorCssSelectGenerator(el);
    return selector;
}

function computeSelectorCssSelectGenerator(el) {
    let generator = new CssSelectGenerator;
    return generator.getSelector(el);
}