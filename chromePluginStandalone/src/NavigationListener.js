class NavigationListener {

    constructor() {
        this.window = null;
        this.tab = null;

        //this.webNavigationCommitted = this.webNavigationCommitted.bind(this);
        this.webNavigationCompleted = this.webNavigationCompleted.bind(this);

        //chrome.webNavigation.onCommitted.addListener(this.webNavigationCommitted);
        chrome.webNavigation.onCompleted.addListener(this.webNavigationCompleted);
        //this.addBrowserListeners();
    }

    startExpedition(state) {
        let promise = new Promise((res, rej) => {
            chrome.windows.get(state.windowId, {
                populate: true
            }, window => {
                if (window === null || window === undefined) rej();
                this.window = window;
                this.tab = window.tabs.find(tab => {
                    return tab.active;
                });
                chrome.tabs.reload(this.tab.id, {
                    bypassCache: true
                }, () => {
                    res();
                });
            });
        });
        return promise;
    }

    webNavigationCompleted({
        tabId,
        frameId
    }) {
        if (this.tab && (this.tab.id === tabId)) {
            if (frameId == 0) {
                chrome.tabs.executeScript(
                    this.tab.id, {
                        file: 'listener.js'
                    },
                    result => {
                        if (result === undefined) {
                            chrome.extension.getBackgroundPage().console.log('cannot load listener.js');
                        } else {
                            chrome.extension.getBackgroundPage().console.log(`listener.js:${this.tab.id}`);
                        }
                    }
                );
            }
        }
    }
}

module.exports = NavigationListener;