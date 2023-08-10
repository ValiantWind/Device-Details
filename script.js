const buttons = document.getElementsByTagName("button");
const deviceStorage = document.getElementById("deviceStorage");
const deviceMemory = document.getElementById("deviceMemory");
const batteryLevel = document.getElementById("batteryLevel");
const isFullscreen = document.getElementById("isFullscreen");
const networkConnectionType = document.getElementById("networkType");
const deviceOS = document.getElementById("deviceOS");
let userDetails = navigator.userAgent;

console.log(userDetails)

const os = [
  { name: "Android", value: "Android" },
  { name: "iPhone", value: "iPhone" },
  { name: "iPad", value: "Mac" },
  { name: "Macintosh", value: "Mac" },
  { name: "Linux", value: "Linux" },
  { name: "Windows", value: "Win" },
];

deviceMemory.innerHTML = `Device Memory: At least ${navigator.deviceMemory} GiB of RAM`;


navigator.storage.estimate().then((estimate) => {
	
	deviceStorage.innerHTML =
		`Total Device Storage Estimate: ${(estimate.quota * 0.000001).toFixed(2)} MB`
});

getBatteryLevel()

if (navigator.connection === undefined || !networkConnectionType) {
	networkConnectionType.innerHTML = "Network Type: Unsupported on your browser."
} else {
	const networkType = navigator.connection.type
	if(networkType === "wifi"){
		networkConnectionType.innerHTML = `Network Type: WiFi`
	} else {
		networkConnectionType.innerHTML = `Network Type: ${networkType}`
	}
}

async function getBatteryLevel() {
	if (!navigator.getBattery || navigator.getBattery === undefined) {
		batteryLevel.textContent = "Battery Level: Unsupported on your browser";
	} else {
		const battery = await navigator.getBattery();
		const level = battery.level;
		if (batteryLevel) {
			batteryLevel.innerHTML = `Battery Level: ${level * 100}%`
		}
	}
}

function locationDetails() {
	if (document.getElementById("locationDetails")) {
		window.location.href = "https://ValiantWind.github.io/Location-Details"
	}
}

async function revealIpAddress() {
	if (document.getElementById("showIpAddress")) {
		const revealIpAddress = document.getElementById("showIpAddress");
		revealIpAddress.parentNode.removeChild(revealIpAddress);
		try {
		await axios.get(`https://api.valiantwind.dev/v1/get-ip-address`).then((response) => {
			document.getElementById("ipAddress").innerHTML = "IP Address: " + response.data
		}).catch((error) => {
			console.log(error)
			document.getElementById("ipAddress").innerHTML = `IP Address: Could not fetch IP Address.`
		})
		} catch (e){
			console.log(e)
		}
	}
}

async function getOS(){
	
	 for (let i in os) {
    //check if string contains any value from the object
    if (userDetails.includes(os[i].value)) {
      //displau name of OS from the object
      deviceOS.innerHTML = `Device OS: ${os[i].name}`;
      break;
    }
  }
}

getOS();
function createRipple(event) {
	const button = event.currentTarget;

	const circle = document.createElement("span");
	const diameter = Math.max(button.clientWidth, button.clientHeight);
	const radius = diameter / 2;

	circle.style.width = circle.style.height = `${diameter}px`;
	circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
	circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
	circle.classList.add("ripple");

	const ripple = button.getElementsByClassName("ripple")[0];

	if (ripple) {
		ripple.remove();
	}

	button.appendChild(circle);
}

for (const button of buttons) {
	button.addEventListener("click", createRipple);
}