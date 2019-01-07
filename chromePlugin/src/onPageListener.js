import { select } from './optimal-select.js';

(() => {

    let listeners = [
        'click',
        'mousedown',
        'mouseup',
        'focus',
        'blur',
        'keydown',
        'change',
        'dblclick',
        //'mousemove',
        //'mouseover',
        //'mouseout',
        //'mousewheel',
        'keydown',
        'keyup',
        'keypress',
        'textInput',
        'touchstart',
        'touchmove',
        'touchend',
        'touchcancel',
        'resize',
        'scroll',
        'zoom',
        'focus',
        'blur',
        'select',
        'change',
        'submit',
        'reset',
        'input',
        'submit'
    ];
    listeners.forEach(listener => document.body.addEventListener(listener, handleAllEvents, true));
})();

function handleAllEvents(e){
    chrome.runtime.sendMessage({
        kind:'addEventToExpedition',
        event: {
            type: e.type,
            selector: computeSelector(e.target)
        }
    });
}

function computeSelector(el) {
    return computeSelectorOptimal(el);
}

function computeSelectorOptimal(el) {
    return select(el, {
        root: document,
        priority: ['id','class','href','src'],
        ignore: {
            class(className) {
                return (className==='class') || (className.indexOf('ng-') !== -1);
            }
        }
    });
}
