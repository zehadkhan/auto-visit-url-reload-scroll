let currentIndex = 0;
let intervalId = null;
let activeTabId = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            activeTabId = tabs[0].id;
            startAutoScroll(activeTabId); // Pass the active tab ID to the function
        });
    } else if (message.action === 'stop') {
        stopAutoScroll();
    }
});

function startAutoScroll(tabId) {
    if (intervalId) clearInterval(intervalId);

    chrome.storage.local.get(['urlList', 'totalTime'], ({ urlList, totalTime }) => {
        if (urlList && totalTime) {
            intervalId = setInterval(() => {
                navigateToNextUrl(urlList, tabId); // Pass the active tab ID to the function
            }, totalTime * 1000);
        }
    });
}

function navigateToNextUrl(urlList, tabId) {
    if (tabId !== activeTabId) return; // Check if the tab ID matches the active tab ID

    const url = urlList[currentIndex];
    chrome.tabs.update(tabId, { url: url }, () => {
        // Wait for the page to load completely
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === activeTabId && changeInfo.status === 'complete') {
                // Once the page is loaded, scroll to the bottom
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: scrollToBottom,
                });

                // Remove the listener to avoid multiple executions
                chrome.tabs.onUpdated.removeListener(listener);
            }
        });
    });

    currentIndex = (currentIndex + 1) % urlList.length;
}


function stopAutoScroll() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    currentIndex = 0;
    activeTabId = null;
}

function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
}
