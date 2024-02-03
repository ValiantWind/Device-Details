const deviceStorage = document.getElementById("deviceStorage");
const deviceMemory = document.getElementById("deviceMemory");
const resolution = document.getElementById("screenResolution");
const networkConnectionType = document.getElementById("networkType");
const deviceOS = document.getElementById("deviceOS");
const browserName = document.getElementById("browserName");
const browserVersion = document.getElementById("browserVersion");
const devicePlatform = document.getElementById("devicePlatform");
const browserCookiedEnabled = document.getElementById("cookiedEnabled");
let batteryLevel = document.querySelector("#batteryLevel");
let batteryStatus = document.querySelector("#batteryCharging");

let userAgent = navigator.userAgent;

getOSAsync().then(os => {
	deviceOS.textContent = `OS: ${os}`;
});

getPlatformAsync().then(platform => {
	devicePlatform.textContent = `Platform: ${platform}`;
})

getBrowserAsync().then((info) => {
	browserName.textContent = `Browser: ${info.browser}`;
	browserVersion.textContent = `Browser Version: ${info.version}`;
}).catch((error) => {
	console.error(error)
});

getResolutionAsync().then((res) => {
	resolution.textContent = `Resolution: ${res}`;
}).catch((error) => {
	console.error(error);
});

getIpAddressAsync().then(ip => {
	if (document.getElementById("showIpAddress")) {

		const revealIpAddress = document.getElementById("showIpAddress");

		revealIpAddress.addEventListener("click", function() {
			revealIpAddress.parentNode.removeChild(revealIpAddress);
			document.getElementById("ipAddress").textContent = `IP Address: ${ip}`;
		})
	}
}).catch(e => {
	console.error(e)
	document.getElementById("ipAddress").textContent = `IP Address: Could not fetch IP Address.`
})

displayBatteryLevelAsync()


browserCookiedEnabled.textContent = `Browser Cookies Enabled: ${cookiesEnabled()}`;


if (navigator.deviceMemory === undefined) {
	deviceMemory.textContent = `Device Memory: Unsupported on your browser`;
} else {
	deviceMemory.textContent = `Device Memory: At least ${navigator.deviceMemory} GiB of RAM`;
}


if (navigator.connection === undefined || !networkConnectionType) {
	networkConnectionType.textContent = "Network Type: Unsupported on your browser"
} else {
	let networkType = navigator.connection.type
	console.log(networkType);

	networkType = networkType.substring(0, 1).toUpperCase() + networkType.substring(1);
	networkConnectionType.textContent = `Network Type: ${networkType}`
}

async function displayBatteryLevelAsync() {
	if (!navigator.getBattery() || (navigator.getBattery() === undefined) || navigator.getBattery === undefined) {
		batteryStatus.textContent = "Battery Status: Unsupported on your browser";
		batteryLevel.textContent = "Battery Level: Unsupported on your browser";
		return;
	} else {
		await navigator.getBattery().then((battery) => {

			batteryLevel.textContent = `Battery Level: ${battery.level * 100}%`;

			if (battery.charging) {
				batteryStatus.textContent = `Battery Status: Charging`;
			} else {
				batteryStatus.textContent =
					`Battery Status: Not Charging`;
			}
		},

			battery.onlevelchange = () => {
				batteryLevel.textContent = `Battery Level: ${battery.level * 100}%`;

				if (battery.charging) {
					batteryStatus.textContent = `Battery Status: Charging`;
				} else {
					batteryStatus.textContent =
						`Battery Status: Not Charging`;
				}
			}).catch((error) => {
				console.log(error)
			});
	}

}


async function getIpAddressAsync() {
	return new Promise((resolve, reject) => {
		try {
			axios.get(`https://api.valiantwind.dev/v1/get-ip-address`).then((response) => {
				resolve(response.data)
			}).catch((error) => {
				console.log(error)
				console.log(response.data)
				reject(error)
			})
		} catch (e) {
			reject(e)
		}
	})
}

// navigator.cookiesEnabled is not accurate for all browsers, so we'll attempt to create a temporary cookie to see if cookies are enabled
function cookiesEnabled() {
	document.cookie = "testcookie=12345678";

	if (document.cookie.indexOf("testcookie=12345678") >= 0) {
		return true;
	}

	document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";

	return false;
}

async function getResolutionAsync() {
	return new Promise((resolve, reject) => {
		try {
			const screen = window.screen;
			const resolution = `${screen.width}x${screen.height}`;
			resolve(resolution);
		} catch (error) {
			reject(error);
		}
	});
}


// Server-sided solution using my API. You can only detect so much when on the client. 
// Its definitely possible to detect the browser on the client, but utilizing the server-sided solution is more reliable and accurate.
// The code used to be much longer when I used a client-sided solution for detecting device info.

async function getSystemInfoAsync() {
	try {
		const response = await fetch(`https://api.valiantwind.dev/v1/system-info`)
		return await response.json()
	} catch (e) {
		console.error(e)
	}
}


async function getBrowserAsync() {
	return new Promise((resolve, reject) => {
		try {
			getSystemInfoAsync().then(info => {
				const browser = info.browser;
				const version = info.version;
				resolve({ browser, version })
			})
		} catch (e) {
			reject(e)
		}
	})

}

async function getOSAsync() {
	return new Promise((resolve, reject) => {
		try {
			getSystemInfoAsync().then(info => {
				if (info.isiPhone) {
					resolve("iOS")
				} else if (info.isiPad) {
					resolve("iPadOS")
				} else {
					resolve(info.os)
				}
			})
		} catch (e) {
			reject(e)
		}
	})
}

async function getPlatformAsync() {
	return new Promise((resolve, reject) => {
		try {
			getSystemInfoAsync().then(info => {
				resolve(info.platform)
			})
		} catch (e) {
			reject(e)
		}
	})
}

function megabytesToGigabytes(megabytes) {
	return megabytes / 1024;
}

function locationDetails() {
	if (document.getElementById("locationDetails")) {
		window.location.href = "https://ValiantWind.github.io/Location-Details"
	}
}