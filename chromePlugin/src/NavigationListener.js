
class NavigationListener {

    constructor(){
        this.window = null;
        this.tab = null;

        this.webNavigationCommitted = this.webNavigationCommitted.bind(this);
        this.webNavigationCompleted = this.webNavigationCompleted.bind(this);

        chrome.webNavigation.onCommitted.addListener(this.webNavigationCommitted);
        chrome.webNavigation.onCompleted.addListener(this.webNavigationCompleted);
        this.addBrowserListeners();
    }

    calibrate(){
        chrome.windows.getCurrent({populate:true}, window => {
            this.window = window;
            this.tab = window.tabs.find( tab => {return tab.active;});
            chrome.tabs.reload(this.tab.id);
        });
    }

    webNavigationCommitted({transitionType, url}) {
        chrome.runtime.sendMessage({
            kind:'addEventToExpedition',
            event: {
                type: 'GotoAction',
                url:url,
                transitionType: transitionType
            }
        });
    }
    
    webNavigationCompleted({tabId, frameId}) {
        if (this.tab && (this.tab.id === tabId  ))  {
            if (frameId === 0) {
                chrome.tabs.executeScript(this.tab.id, {file:'onPageListener.js'},
                    result => chrome.extension.getBackgroundPage().console.log(result == undefined?'Failed loading attachListener':'Success loading onPageListener'));
            }
        }
    }
    
    addBrowserListeners(){
        //Monitor tab creation
        chrome.tabs.onCreated.addListener(tab => {
            chrome.runtime.sendMessage({kind:'addEventToExpedition', action: {type:'TabCreatedAction', url: tab.url, title: tab.title} });
        });
    
        //Monitor tab removal
        chrome.tabs.onCreated.addListener(tab => {
            chrome.runtime.sendMessage({kind:'addEventToExpedition', action: {type:'TabRemovedAction', url: tab.url, title: tab.title} });
        });
    }
}

module.exports = NavigationListener;