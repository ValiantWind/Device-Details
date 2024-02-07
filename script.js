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
	deviceOS.innerHTML = `<strong>Operation System: </strong> ${os || "Error when attempting to fetch device operating system. Please reload or try again later."}`;
}).catch(error => {
	deviceOS.innerHTML = `<strong>Operation System: </strong> Error when attempting to fetch device operating system. Please reload or try again later.`;
	console.error(error)
})

getPlatformAsync().then(platform => {
	devicePlatform.innerHTML = `<strong>Platform: </strong> ${platform || "Error when attempting to fetch device platform. Please reload or try again later."}`;
}).catch(error => {
	devicePlatform.innerHTML = `<strong>Platform: </strong> Error when attempting to fetch device platform. Please reload or try again later.`;
	console.error(error)
})

getBrowserAsync().then((info) => {
	browserName.innerHTML = `<strong>Browser Name: </strong>${info.browser || "Error when attempting to fetch browser info. Please reload or try again later."}`;
	browserVersion.innerHTML = `<strong>Browser Version: </strong>${info.version || "Error when attempting to fetch browser info. Please reload or try again later."}`;
}).catch((error) => {
	browserName.innerHTML = `<strong>Browser Name: </strong>Error when attempting to fetch browser info. Please reload or try again later.`;
	browserVersion.innerHTML = `<strong>Browser Version: </strong>Error when attempting to fetch browser info. Please reload or try again later.`;
	console.error(error);
});

getResolutionAsync().then((res) => {
	resolution.innerHTML = `<strong>Resolution: </strong>${res || "Error when attempting to fetch browser. Please reload or try again later."}`;
}).catch((error) => {
	console.error(error);
});

getIpAddressAsync().then(ip => {
	if (document.getElementById("showIpAddress")) {

		const revealIpAddress = document.getElementById("showIpAddress");

		revealIpAddress.addEventListener("click", function() {
			revealIpAddress.parentNode.removeChild(revealIpAddress);
			document.getElementById("ipAddress").innerHTML = `<strong>IP Address: </strong>${ip || "Could not fetch IP Address. Please reload or try again later."}`;
		})
	}
}).catch(e => {
	console.error(e)
	document.getElementById("ipAddress").innerHTML = `<strong>IP Address: </strong>Could not fetch IP Address. Please reload or try again later.`
})

displayBatteryLevelAsync()


browserCookiedEnabled.innerHTML = `<strong>Browser Cookies Enabled: </strong>${cookiesEnabled()}`;


if (navigator.deviceMemory === undefined) {
	deviceMemory.innerHTML = `<strong>Device Memory: </strong>Unsupported on your browser.`;
} else {
	deviceMemory.innerHTML = `<strong>Device Memory: </strong>At least ${navigator.deviceMemory} GiB of RAM`;
}


if (navigator.connection === undefined || !networkConnectionType) {
	networkConnectionType.innerHTML = "<strong>Network Type: </strong>Unsupported on your browser."
} else {
	let networkType = navigator.connection.type

	networkType = networkType.substring(0, 1).toUpperCase() + networkType.substring(1);

	if (networkType === "Wifi") {
		networkType = "WiFi";
	}
	console.log(networkType)
	networkConnectionType.innerHTML = `<strong>Network Type: </strong>${networkType}`
}

async function displayBatteryLevelAsync() {
	if (!navigator.getBattery() || (navigator.getBattery() === undefined) || navigator.getBattery === undefined) {
		batteryStatus.innerHTML = "<strong>Battery Status: </strong>Unsupported on your browser";
		batteryLevel.innerHTML = "<strong>Battery Level: </strong>Unsupported on your browser";
		return;
	} else {
		await navigator.getBattery().then((battery) => {

			batteryLevel.innerHTML = `<strong>Battery Level: </strong>${battery.level * 100}%`;

			if (battery.charging) {
				batteryStatus.innerHTML = `<strong>Battery Status: </strong>Charging`;
			} else {
				batteryStatus.innerHTML =
					`<strong>Battery Status: </strong>Not Charging`;
			}
			battery.onlevelchange = () => {
				batteryLevel.innerHTML = `<strong>Battery Level: </strong>${battery.level * 100}%`;

				if (battery.charging) {
					batteryStatus.innerHTML = `<strong>Battery Status: </strong> Charging`;
				} else {
					batteryStatus.innerHTML =
						`<strong>Battery Status: </strong>Not Charging`;
				}
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
	return new Promise((resolve, reject) => {
		axios.get(`https://api.valiantwind.dev/v1/system-info`)
			.then(response => resolve(response.data))
			.catch(error => {
				reject(error)
			})
	})
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