document.addEventListener('DOMContentLoaded', () => {
    const cardConfigs = [
        {
            section: 'general-details-grid',
            title: 'Operating System',
            id: 'deviceOS',
            getValue: async () => (await getSystemInfoAsync())?.os.family || 'N/A',
        },
        {
            section: 'general-details-grid',
            title: 'Browser Name',
            id: 'browserName',
            getValue: async () => (await getSystemInfoAsync())?.family || 'N/A',
        },
        {
            section: 'general-details-grid',
            title: 'Browser Version',
            id: 'browserVersion',
            getValue: async () => {
                const info = await getSystemInfoAsync();
                return info ? `${info.major}.${info.minor}.${info.patch}` : 'N/A';
            },
        },
        {
            section: 'general-details-grid',
            title: 'Screen Resolution',
            id: 'screenResolution',
            getValue: async () => `${window.screen.width}x${window.screen.height}`,
        },
        {
            section: 'general-details-grid',
            title: 'Screen Color Depth',
            id: 'colorDepth',
            getValue: async () => window.screen.colorDepth,
        },
        {
            section: 'general-details-grid',
            title: 'Device Pixel Ratio',
            id: 'dpr',
            getValue: async () => window.devicePixelRatio,
        },
        {
            section: 'general-details-grid',
            title: 'Max Touch Points',
            id: 'maxTouchPoints',
            getValue: () => navigator.maxTouchPoints,
        },
        {
            section: 'general-details-grid',
            title: 'Cookies Enabled',
            id: 'cookiesEnabled',
            getValue: () => {
                document.cookie = 'testcookie=1';
                const enabled = document.cookie.indexOf('testcookie') !== -1;
                document.cookie = 'testcookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                return enabled ? 'Enabled' : 'Disabled';
            },
        },
        {
            section: 'general-details-grid',
            title: 'IP Address',
            id: 'ipAddress',
            getValue: () => '<button type="button" id="showIpAddress">Click to reveal</button>',
        },
        {
            section: 'browser-specific-details-grid',
            title: 'Device Memory',
            id: 'deviceMemory',
            footer: 'Supported on Chrome & Edge',
            getValue: () => navigator.deviceMemory ? `At least ${navigator.deviceMemory} GiB of RAM` : 'Unsupported',
        },
        {
            section: 'browser-specific-details-grid',
            title: 'Battery Level',
            id: 'batteryLevel',
            footer: 'Supported on Chrome, Edge & Opera',
            getValue: getBatteryLevel,
            listener: batteryLevelListener,
        },
        {
            section: 'browser-specific-details-grid',
            title: 'Battery Status',
            id: 'batteryCharging',
            footer: 'Supported on Chrome, Edge & Opera',
            getValue: getBatteryStatus,
            listener: batteryStatusListener,
        },
         {
            section: 'browser-specific-details-grid',
            title: 'Data-Saver Mode',
            id: 'dataSaverMode',
            footer: 'Supported on Chrome, Edge & Opera',
            getValue: () => {
                if(!navigator.connection) return 'Unsupported';
                const dataSaverMode = navigator.connection.saveData;
                return dataSaverMode ? 'Enabled' : 'Disabled'
            },
        },
    ];

    const sections = {
        'general-details-grid': document.getElementById('general-details-grid'),
        'browser-specific-details-grid': document.getElementById('browser-specific-details-grid'),
    };

    cardConfigs.forEach(config => {
        const card = new Card(config);
        sections[config.section].appendChild(card.element);
    });

    setupIpButton();
    setupLocationButton();
});

async function getSystemInfoAsync() {
    try {
        const response = await axios.get('https://api.valiantwind.dev/v1/system-info');
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getIpAddressAsync() {
    try {
        const response = await axios.get('https://api.valiantwind.dev/v1/get-ip-address');
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getBatteryLevel() {
    if (navigator.brave && await navigator.brave.isBrave()) return 'Protected';
    if (!navigator.getBattery) return 'Unsupported';

    const battery = await navigator.getBattery();
    return `${battery.level * 100}%`;
}

async function getBatteryStatus() {
    if (navigator.brave && await navigator.brave.isBrave()) return 'Protected';
    if (!navigator.getBattery) return 'Unsupported';

    const battery = await navigator.getBattery();
    return battery.charging ? 'Charging' : 'Not Charging';
}

async function batteryLevelListener(updateCallback) {
    if (!navigator.getBattery) return;

    try {
        const battery = await navigator.getBattery();
        battery.addEventListener('levelchange', () => {
            updateCallback(`${Math.floor(battery.level * 100)}%`);
        });
    } catch (error) {
        console.error('Error setting up battery level listener:', error);
    }
}

async function batteryStatusListener(updateCallback) {
    if (!navigator.getBattery) return;
    
    try {
        const battery = await navigator.getBattery();
        battery.addEventListener('chargingchange', () => {
            updateCallback(battery.charging ? 'Charging' : 'Not Charging');
        });
    } catch (error) {
        console.error('Error setting up battery status listener:', error);
    }
}

function setupIpButton() {
    const ipAddressContainer = document.getElementById('ipAddress');
    if (ipAddressContainer) {
        ipAddressContainer.addEventListener('click', async (event) => {
            if (event.target.id === 'showIpAddress') {
                const ip = await getIpAddressAsync();
                ipAddressContainer.innerHTML = ip || 'Could not fetch IP Address.';
            }
        });
    }
}

function setupLocationButton() {
    const locationDetailsBtn = document.getElementById('locationDetails');
    if (locationDetailsBtn) {
        locationDetailsBtn.addEventListener('click', () => {
            window.location.href = 'https://ValiantWind.github.io/Location-Details';
        });
    }
}