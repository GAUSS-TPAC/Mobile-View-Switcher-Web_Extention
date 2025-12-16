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
        },
        samsung: {
            width: 384,
            height: 854,
            borderRadius: "30px",
            frameColor: "#1a1a1a",
        },
    };

    const device = devices[deviceKey];
    if (!device) {
        console.error("Invalid device selected:", deviceKey);
        return;
    }

    const existingOverlay = document.getElementById("mobile-view-overlay");

    // ================= UPDATE EXISTING =================
    if (existingOverlay) {
        const currentDevice = existingOverlay.dataset.device;
        if (currentDevice === deviceKey) {
            console.log("Same device selected → no update");
            return;
        }

        const frame = document.getElementById("mobile-view-frame");
        if (!frame) {
            console.error("Frame not found");
            return;
        }

        Object.assign(frame.style, {
            width: `${device.width}px`,
            height: `${device.height}px`,
            border: `14px solid ${device.frameColor}`,
            borderRadius: device.borderRadius,
        });

        const iframe = frame.querySelector("iframe");
        if (iframe) {
            iframe.src = window.location.href;
        }

        existingOverlay.dataset.device = deviceKey;
        console.log("Device updated →", deviceKey);
        return;
    }

    // ================= CREATE OVERLAY =================
    const overlay = document.createElement("div");
    overlay.id = "mobile-view-overlay";
    overlay.dataset.device = deviceKey;

    Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "100000",
    });

    // ================= CREATE FRAME =================
    const frame = document.createElement("div");
    frame.id = "mobile-view-frame";

    Object.assign(frame.style, {
        width: `${device.width}px`,
        height: `${device.height}px`,
        border: `14px solid ${device.frameColor}`,
        borderRadius: device.borderRadius,
        background: "#494949",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 20px rgba(0,0,0,0.4)",
    });

    const iFrame = document.createElement("iframe");
    iFrame.src = window.location.href;
    Object.assign(iFrame.style, {
        width: "100%",
        height: "100%",
        border: "none",
        overflow: "hidden",
        position: "absolute",
        left: "0"
    });


    frame.appendChild(iFrame);
    overlay.appendChild(frame);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", e => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    console.log("Overlay created →", deviceKey);
}

function updateSelectedDevice(selectedButton) {
    document.querySelectorAll('.preview-button').forEach(button => {
        button.classList.remove('selected');
    });
    selectedButton.classList.add('selected');
}
