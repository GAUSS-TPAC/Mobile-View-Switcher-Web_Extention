document.querySelectorAll('.preview-button').forEach(button => {
    button.addEventListener('click', () => {
        updateSelectedDevice(button);

        const deviceKey = button.dataset.deviceKey;

        chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                func: createMobileFrame,
                args: [deviceKey],
            });
        });
    });
});

function createMobileFrame(deviceKey) {
    console.log("device key ->", deviceKey);

    const devices = {
        iphone: {
            width: 390,
            height: 844,
            borderRadius: "50px",
            frameColor: "#1c1c1e",
            notchWidth: "40%",
            notchHeight: "35px",
        },
        samsung: {
            width: 384,
            height: 854,
            borderRadius: "30px",
            frameColor: "#1a1a1a",
            cameraHoleSize: "12px",
        },
    };

    const device = devices[deviceKey];

    if (!device) {
        console.error("Invalid device selected");
    }

    const existingOverlay = document.getElementById("mobile-view-overlay");
    if (existingOverlay) {
        return;
    }


    ///overlay creation 
    const overlay = document.createElement("div");
    overlay.id = "mobile-view-overlay";
    overlay.setAttribute("data-device", deviceKey);

    Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "100000",
    });

    //// Mobile frame Creation
    const frame = document.createElement("div");
    frame.id = "mobile-view-frame";
    Object.assign(frame.style, {
        width: `${device.width}px`,
        height: `${device.height}px`,
        border: `${device.frameColor} solid`,
        borderRadius: device.borderRadius,
        position: "relative",
        background: "#494949",
        boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        overflow: "hidden"
    })

    overlay.appendChild(frame);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

}

function updateSelectedDevice(selectedButton) {
    document.querySelectorAll('.preview-button').forEach(button => {
        button.classList.remove('selected');
    });
    selectedButton.classList.add('selected');
}
