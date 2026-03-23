const gatewayUrl =
  window.APP_CONFIG?.gatewayUrl ||
  "https://gateway.wittysand-cc59d3e0.centralindia.azurecontainerapps.io";

const gatewayLink = document.getElementById("gateway-link");
const healthUrl = `${gatewayUrl}/health`;
const urlValue = document.getElementById("health-url");
const statusBadge = document.getElementById("status-badge");
const statusTitle = document.getElementById("status-title");
const statusText = document.getElementById("status-text");
const responseBox = document.getElementById("response-box");
const refreshButton = document.getElementById("refresh-button");

gatewayLink.href = gatewayUrl;
gatewayLink.textContent = gatewayUrl;
urlValue.textContent = healthUrl;

async function loadHealth() {
  statusBadge.textContent = "Checking";
  statusTitle.textContent = "Gateway status is being verified";
  statusText.textContent = "Fetching the live /health endpoint from Azure.";
  responseBox.textContent = "Waiting for response...";
  refreshButton.disabled = true;

  try {
    const response = await fetch(healthUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Gateway returned HTTP ${response.status}`);
    }

    const data = await response.json();
    statusBadge.textContent = "Online";
    statusTitle.textContent = "Frontend and gateway are connected";
    statusText.textContent =
      "Azure Static Web Apps can reach the microservice successfully.";
    responseBox.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    statusBadge.textContent = "Needs attention";
    statusTitle.textContent = "Gateway request failed";
    statusText.textContent =
      "The frontend loaded, but the browser could not complete the API request.";
    responseBox.textContent = error.message;
  } finally {
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener("click", loadHealth);
loadHealth();
