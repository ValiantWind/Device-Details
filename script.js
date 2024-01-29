const deviceStorage = document.getElementById("deviceStorage");
const deviceMemory = document.getElementById("deviceMemory");
const batteryLevel = document.getElementById("batteryLevel");
const resolution = document.getElementById("screenResolution");
const networkConnectionType = document.getElementById("networkType");
const deviceOS = document.getElementById("deviceOS");
const browserName = document.getElementById("browserName");
const browserCookiedEnabled = document.getElementById("cookiedEnabled")

let userAgent = navigator.userAgent;

batteryLevel.innerHTML = `Battery Level: ${getBatteryLevel()}%`
deviceMemory.innerHTML = `Device Memory: At least ${navigator.deviceMemory} GiB of RAM`;
deviceOS.innerHTML = `OS: ${getOS()};`
browserName.innerHTML = `Browser: ${getBrowser()};`
browserCookiedEnabled.innerHTML = `Browser Cookies Enabled: ${cookiesEnabled()}`;

getResolutionAsync().then((result) => {
		cresolution.innerHTML = `Resolution: ${result}`;

}).catch((error) => {
		console.error(error);
});


navigator.storage.estimate().then((estimate) => {
	console.log(estimate.quota);
	deviceStorage.innerHTML =
		// `Total Device Storage Estimate: ${(estimate.quota * 0.000001).toFixed(2)} MB`
		`Total Device Storage Estimate: ${megabytesToGigabytes(estimate.quota * 0.000001).toFixed(2)} GB`
});


if (navigator.connection === undefined || !networkConnectionType) {
	networkConnectionType.innerHTML = "Network Type: Unsupported on your browser."
} else {
	const networkType = navigator.connection.type
	console.log(networkType);
	if(networkType === "wifi"){
		networkConnectionType.innerHTML = `Network Type: WiFi`
	} else {
		networkConnectionType.innerHTML = `Network Type: ${networkType}`
	}
}

function getBatteryLevel() {
	if (!navigator.getBattery || navigator.getBattery === undefined) {
		return "Unsupported on your browser";
	} else {
		const battery = await navigator.getBattery();
		const level = battery.level;
		if (batteryLevel) {
			return level * 100
		}
	}
}

function locationDetails() {
	if (document.getElementById("locationDetails")) {
		window.location.href = "https://ValiantWind.github.io/Location-Details"
	}
}

function revealIpAddress() {
	if (document.getElementById("showIpAddress")) {
		const revealIpAddress = document.getElementById("showIpAddress");
		revealIpAddress.parentNode.removeChild(revealIpAddress);
		try {
			axios.get(`https://api.valiantwind.dev/v1/get-ip-address`).then((response) => {
			document.getElementById("ipAddress").innerHTML = "IP Address: " + response.data
		}).catch((error) => {
			console.log(error)
			console.log(response.data)
			document.getElementById("ipAddress").innerHTML = `IP Address: Could not fetch IP Address.`
		})
		} catch (e){
			console.log(e)
		}
	}
}

// navigator.cookiesEnabled is not accurate for all browsers, so we'll attempt to create a temporary cookie to see if cookies are enabled
function cookiesEnabled(){
	document.cookie = "testcookie=12345678";

	if(document.cookie.indexOf("testcookie=12345678") >= 0){
		return true;
	}

	return false;
}

function getResolutionAsync() {
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

async function getBrowser(){
	if(userAgent.indexOf("Chrome") >= 0){
		if (userAgent.match(/\bChrome\/[.0-9]* Mobile\b/)) {
				if (userAgent.match(/\bVersion\/\d+\.\d+\b/) || userAgent.match(/\bwv\b/)) {
						return "WebView on Android"
				} else {
						return "Google Chrome for Android"
				}
		} else {
				return "Google Chrome"
		}
	}

	if(userAgent.indexOf("Edge") >= 0){
		return "Microsoft Edge";
	}

	if (userAgent.indexOf("Firefox") >= 0 && userAgent.indexOf("Seamonkey") === -1) {
			if (userAgent.indexOf("Android") >= 0) {
					return "Firefox for Android";
			} else {
					return "Firefox"
			}
	}

	if (userAgent.indexOf("OPR") >= 0 || userAgent.indexOf("Opera") >= 0) {
			if (userAgent.indexOf("Opera Mobi") >= 0 || userAgent.indexOf("Opera Tablet") >= 0 || userAgent.indexOf("Mobile") >= 0) {
					return "Opera Mobile";
			} else if (userAgent.indexOf("Opera Mini") >= 0) {
					return "Opera Mini";
			} else {
					return "Opera";
			}
	}

	if (userAgent.indexOf("Safari") >= 0 && userAgent.indexOf("Chrome") === -1 && userAgent.indexOf("Chromium") === -1 && userAgent.indexOf("Android") === -1) {
			if (userAgent.indexOf("CriOS") >= 0) {
					return "Chrome for iOS";
			} else if (userAgent.indexOf("FxiOS") >= 0) {
					return "Firefox for iOS";
			} else {
					return "Safari";
			}
	}

	if (userAgent.indexOf("Trident") >= 0 || userAgent.indexOf("MSIE") >= 0) {
			if (userAgent.indexOf("Mobile") >= 0) {
					return "IE Mobile";
			} else {
					return "Internet Explorer";
			}
	}

	if (userAgent.indexOf("Android") >= 0 && userAgent.indexOf("Chrome") === -1 && userAgent.indexOf("Chromium") === -1 && userAgent.indexOf("Trident") === -1 && userAgent.indexOf("Firefox") === -1) {
			return "Android Browser";
	}

	if (userAgent.indexOf("BB10") >= 0 || userAgent.indexOf("PlayBook") >= 0 || userAgent.indexOf("BlackBerry") >= 0) {
			return "BlackBerry";
	}

	if (userAgent.indexOf("UCBrowser") >= 0) {
			return "UC Browser for Android";
	}

	if (userAgent.indexOf("SamsungBrowser") >= 0) {
			return "Samsung Internet";
	}

	if (userAgent.indexOf("MQQBrowser") >= 0) {
			return "QQ Browser";
	}

	return "Could not detect browser";
}

function getOS(){
	if (userAgent.indexOf("Windows") >= 0) {
			if (userAgent.indexOf("Windows Phone") >= 0) {
					return "Windows Phone";
			} else {
					return "Windows";
			}
	}

	if (userAgent.indexOf("OS X") >= 0 && userAgent.indexOf("Android") === -1) {
			return "macOS";
	}

	if (userAgent.indexOf("Linux") >= 0) {
			return "Linux";
	}

	if ((userAgent.indexOf("Android") >= 0 || userAgent.indexOf("Adr") >= 0) && userAgent.indexOf("Windows Phone") === -1) {
			return "Android";
	}

	if (userAgent.indexOf("like Mac OS X") >= 0) {
			return "iOS";
	}

	if (userAgent.indexOf("CrOS") >= 0) {
			return "Chrome OS";
	}

	if (userAgent.indexOf("BB10") >= 0) {
			return "BlackBerry";
	}

	if (userAgent.indexOf("RIM Tablet OS") >= 0) {
			return "BlackBerry Tablet OS";
	}

	if (userAgent.indexOf("BlackBerry") >= 0) {
			return "BlackBerryOS";
	}

	if (userAgent.indexOf("KAIOS") >= 0) {
			return "KaiOS";
	}
}

function megabytesToGigabytes(megabytes) {
	return megabytes / 1024;
}