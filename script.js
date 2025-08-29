document.addEventListener('DOMContentLoaded', () => {
    initialize();
});

function initialize(){
   try {
        updateOS();
    } catch (e) {
        console.error("Error initializing OS info:", e);
    }
    try {
        updateBrowserInfo();
    } catch (e) {
        console.error("Error initializing Browser info:", e);
    }
    try {
        updateResolution();
    } catch (e) {
        console.error("Error initializing Resolution info:", e);
    }
    try {
        updateTimezone();
    } catch (e) {
        console.error("Error initializing Timezone info:", e);
    }
    try {
        setupIpButton();
    } catch (e) {
        console.error("Error initializing IP Address button:", e);
    }
    try {
        updateBatteryInfo();
    } catch (e) {
        console.error("Error initializing Battery info:", e);
    }
    try {
        updateCookieStatus();
    } catch (e) {
        console.error("Error initializing Cookie status:", e);
    }
    try {
        updateDeviceMemory();
    } catch (e) {
        console.error("Error initializing Device Memory info:", e);
    }
    try {
        setupLocationButton();
    } catch (e) {
        console.error("Error initializing Location button:", e);
    }
}

function updateOS(){
    const deviceOS = document.getElementById("deviceOS");
    if(!deviceOS) return;

    getOSAsync().then(os => {
        deviceOS.textContent = os || "Error";
    })
    .catch(e => {
        deviceOS.textContent = "Error";
        console.error(e)
    })
}

function updateBrowserInfo(){
    const name = document.getElementById("browserName");
    const version = document.getElementById("browserVersion");
    if(!name || !version) return;

    getBrowserAsync().then(info => {
        browserName.textContent = info.browser || "Error";
        browserVersion.textContent = info.version || "Error";
    })
    .catch(e => {
        browserName.textContent = "Error";
        browserVersion.textContent = "Error";
        console.error(error);
    })
}

function updateResolution() {
    const resolution = document.getElementById("screenResolution");
    if (!resolution) return;

    getResolutionAsync()
        .then(res => {
            resolution.textContent = res || "Error";
        })
        .catch(error => {
            resolution.textContent = "Error";
            console.error(error);
        });
}

function updateTimezone() {
    const timezone = document.getElementById("preferredTimezone");
    if (!timezone) return;
    timezone.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || "N/A";
}

function setupIpButton() {
    const ipAddress = document.getElementById("ipAddress");
    if (!ipAddress) return;

    ipAddress.addEventListener("click", function(event) {
        if (event.target.id === "showIpAddress") {
            getIpAddressAsync()
                .then(ip => {
                    ipAddress.innerHTML = ip || "Could not fetch IP Address.";
                })
                .catch(e => {
                    console.error(e);
                    ipAddress.innerHTML = "Could not fetch IP Address.";
                });
        }
    });
}

async function updateBatteryInfo() {
    const batteryLevel = document.getElementById("batteryLevel");
    const batteryStatus = document.getElementById("batteryCharging");
    if (!batteryLevel || !batteryStatus) return;

    if(navigator.brave && await navigator.brave.isBrave()) {
        batteryStatus.textContent = "Protected";
        batteryLevel.textContent = "Protected";
        return;
    }

    if (!navigator.getBattery) {
        batteryStatus.textContent = "Unsupported";
        batteryLevel.textContent = "Unsupported";
        return;
    }

    try {
        const battery = await navigator.getBattery();
        batteryLevel.textContent = `${battery.level * 100}%`;
        batteryStatus.textContent = battery.charging ? "Charging" : "Not Charging";

        battery.onchargingchange = () => {
            batteryStatus.textContent = battery.charging ? "Charging" : "Not Charging";
        };
        battery.onlevelchange = () => {
            batteryLevel.textContent = `${battery.level * 100}%`;
        };
    } catch (error) {
        console.error(error);
        batteryStatus.textContent = "Error";
        batteryLevel.textContent = "Error";
    }
}

function updateCookieStatus() {
    const cookiesEnabledElement = document.getElementById("cookiesEnabled");
    if (!cookiesEnabledElement) return;

    document.cookie = "testcookie=1";
    const enabled = document.cookie.indexOf("testcookie") !== -1;
    document.cookie = "testcookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    cookiesEnabledElement.textContent = enabled ? "Enabled" : "Disabled";
}

function updateDeviceMemory() {
    const deviceMemory = document.getElementById("deviceMemory");
    if (!deviceMemory) return;

    if (navigator.deviceMemory === undefined) {
        deviceMemory.textContent = "Unsupported";
    } else {
        deviceMemory.textContent = `At least ${navigator.deviceMemory} GiB of RAM`;
    }
}

function setupLocationButton() {
    const locationDetailsBtn = document.getElementById("locationDetails");
    if (!locationDetailsBtn) return;
    locationDetailsBtn.addEventListener("click", () => {
        window.location.href = "https://ValiantWind.github.io/Location-Details";
    });
}


async function getIpAddressAsync() {
    try {
        const response = await axios.get(`https://api.valiantwind.dev/v1/get-ip-address`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getResolutionAsync() {
    return `${window.screen.width}x${window.screen.height}`;
}

async function getSystemInfoAsync() {
    try {
        const response = await axios.get(`https://api.valiantwind.dev/v1/system-info`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getBrowserAsync() {
    const info = await getSystemInfoAsync();
    if (info) {
        return {
            browser: info.family,
            version: `${info.major}.${info.minor}.${info.patch}`
        };
    }
    return {};
}

async function getOSAsync() {
    const info = await getSystemInfoAsync();
    return info ? info.os.family : null;
}