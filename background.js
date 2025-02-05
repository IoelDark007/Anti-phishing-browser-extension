let phishingUrls = [];
let totalWebsitesVisited = 0;
let flaggedWebsitesCount = 0; 
let isActive = true;

// Load phishing URLs from JSON
fetch(chrome.runtime.getURL("phishing_urls.json"))
    .then((response) => response.json())
    .then((data) => {
        phishingUrls = data.phishing_urls;
        console.log("Phishing URLs loaded:", phishingUrls);
    })
    .catch((error) => {
        console.error("Error loading phishing URLs:", error);
    });

// Retrieve stored counts on startup
chrome.storage.sync.get(["totalWebsitesVisited", "flaggedWebsitesCount"], (data) => {
    totalWebsitesVisited = data.totalWebsitesVisited || 0;
    flaggedWebsitesCount = data.flaggedWebsitesCount || 0;
});

// Check if a URL is in the phishing list
function isPhishingUrl(url) {
    return phishingUrls.some(phishingUrl => url.includes(phishingUrl));
}

// Check if a URL is phishing using Google Safe Browsing
async function isDangerousUrl(url) {
    const apiKey = "YOUR_API_KEY_HERE";
    const requestPayload = {
        client: {
            clientId: "jamieSass",
            clientVersion: "1.0",
        },
        threatInfo: {
            threatTypes: ["MALWARE", "PHISHING", "UNWANTED_SOFTWARE"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }],
        },
    };

    try {
        const response = await fetch(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestPayload),
            }
        );
        const data = await response.json();
        return data.matches && data.matches.length > 0;
    } catch (error) {
        console.error("Error checking URL with Google Safe Browsing:", error);
        return false;
    }
}

// Analyze a URL with IPQualityScore
async function analyzeURLwithIPQS(url) {
    const apiKey = "gFwqvJwKCZWjZB7LqUW5dcIZqNjG0pat";
    const apiurl = `https://www.ipqualityscore.com/api/json/url/${apiKey}/${encodeURIComponent(url)}`;

    try {
        const response = await fetch(apiurl);
        const data = await response.json();

        console.log("Full IPQS response:", data);

        if (data.success) {
            return data;
        } else {
            console.error("IPQS API Error:", data.message || "Unknown error");
            return null;
        }
    } catch (error) {
        console.error("Error fetching IPQS API:", error);
        return null;
    }
}

// Monitor navigation for phishing URLs
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    const url = details.url;

    try {
        const ambientPageUrl = chrome.runtime.getURL("ambient.html");

        if (url.startsWith(ambientPageUrl) || new URLSearchParams(url).get("processed") === "true") {
            return;
        }

        // Check phishing databases
        const isInPhishingList = isPhishingUrl(url);
        const analysisResult = await analyzeURLwithIPQS(url);
        const isDangerous = await isDangerousUrl(url);

        if (isInPhishingList || (analysisResult && analysisResult.risk_score > 75) || isDangerous) {
        
            flaggedWebsitesCount++;
            chrome.storage.sync.set({ flaggedWebsitesCount });

            chrome.tabs.update(details.tabId, { url: "safety.html" });
        }
    } catch (error) {
        console.error("Error during URL analysis:", error);
    }
}, { url: [{ urlMatches: "http.*" }] });

// Track total websites visited
chrome.webNavigation.onCompleted.addListener(() => {
    if (isActive) {
        totalWebsitesVisited++;
        chrome.storage.sync.set({ totalWebsitesVisited });
    }
});

// Handle messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "activate") {
        isActive = true;
        totalWebsitesVisited = 0;
        flaggedWebsitesCount = 0;
        console.log("Extension activated");
        chrome.storage.sync.set({ totalWebsitesVisited, flaggedWebsitesCount });
        sendResponse({ status: "Extension activated" });
    } else if (request.action === "deactivate") {
        isActive = false;
        console.log("Extension deactivated");
        sendResponse({ status: "Extension deactivated" });
    } else if (request.action === "getCounts") {
        sendResponse({ total: totalWebsitesVisited, flagged: flaggedWebsitesCount });
    } else if (request.action === "getState") {
        sendResponse({ isActive });
    }
});
