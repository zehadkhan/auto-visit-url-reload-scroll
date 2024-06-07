chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start' && sender.tab.active) { // Check if the sender tab is active
        scrollToBottom();
    }
});

function scrollToBottom() {
    const scrollStep = 100; // pixels to scroll per step
    const delay = 100; // milliseconds between each scroll step

    function scrollStepDown() {
        if (window.scrollY + window.innerHeight < document.body.scrollHeight) {
            window.scrollBy(0, scrollStep);
            setTimeout(scrollStepDown, delay);
        }
    }

    scrollStepDown();
}
