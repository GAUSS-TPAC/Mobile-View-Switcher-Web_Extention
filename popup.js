document.querySelectorAll('.preview-button').forEach(button => {
    button.addEventListener('click', () => {
        updateSelectedDevice(button);

        const deviceKey = button.getAttribute('data-device-key');

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                func: createMobileFrame,
                args: [deviceKey],
            });
        });

    });
});

function createMobileFrame(deviceKey) {
    console.log("device key ->", deviceKey)
}

function updateSelectedDevice(button) {
    document.querySelectorAll('preview-button').forEach(button => {
        button.classList.remove('selected');
    });
    button.classList.add('selcted');
}

