document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['urlList', 'totalTime'], ({ urlList, totalTime }) => {
        if (urlList) {
            document.getElementById('url1').value = urlList[0] || '';
            document.getElementById('url2').value = urlList[1] || '';
            document.getElementById('url3').value = urlList[2] || '';
        }

        if (totalTime) {
            const minutes = Math.floor(totalTime / 60);
            const seconds = totalTime % 60;
            document.getElementById('reloadMinutes').value = minutes;
            document.getElementById('reloadSeconds').value = seconds;
        }
    });
});

document.getElementById('startBtn').addEventListener('click', () => {
    const url1 = document.getElementById('url1').value.trim();
    const url2 = document.getElementById('url2').value.trim();
    const url3 = document.getElementById('url3').value.trim();
    const urlList = [url1, url2, url3].filter(url => url.length > 0);

    const minutes = parseInt(document.getElementById('reloadMinutes').value) || 0;
    const seconds = parseInt(document.getElementById('reloadSeconds').value) || 0;
    const totalTime = (minutes * 60) + seconds;

    if (urlList.length === 0 || totalTime === 0) {
        alert('Please enter valid URLs and time.');
        return;
    }

    chrome.storage.local.set({ urlList, totalTime }, () => {
        chrome.runtime.sendMessage({ action: 'start' }, () => {
            toggleButtons(true);
        });
    });
});

document.getElementById('stopBtn').addEventListener('click', () => {
    chrome.storage.local.remove(['urlList', 'totalTime'], () => {
        document.getElementById('url1').value = '';
        document.getElementById('url2').value = '';
        document.getElementById('url3').value = '';
        document.getElementById('reloadMinutes').value = '';
        document.getElementById('reloadSeconds').value = '';
        chrome.runtime.sendMessage({ action: 'stop' }, () => {
            toggleButtons(false);
        });
    });
});

function toggleButtons(isStarted) {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    if (isStarted) {
        startBtn.style.backgroundColor = '#ccc';
        startBtn.disabled = true;
        stopBtn.style.backgroundColor = '#f44336';
        stopBtn.disabled = false;
    } else {
        startBtn.style.backgroundColor = '#4CAF50';
        startBtn.disabled = false;
        stopBtn.style.backgroundColor = '#ccc';
        stopBtn.disabled = true;
    }
}

// Initialize button states
toggleButtons(false);
