document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('toggle-extension');
    const totalWebCount = document.getElementById('total-web-count');
    const flaggedWebCount = document.getElementById('flagged-web-count'); 

    // Function to update the button based on state
    function updateButton(isActive) {
        if (isActive) {
            button.id = 'deactivate';
            button.textContent = 'Deactivate Extension';
            button.removeEventListener('click', activateExtension);
            button.addEventListener('click', deactivateExtension);
        } else {
            button.id = 'activate';
            button.textContent = 'Activate Extension';
            button.removeEventListener('click', deactivateExtension);
            button.addEventListener('click', activateExtension);
        }
    }

    // Fetch current state from background.js
    chrome.runtime.sendMessage({ action: 'getState' }, function (response) {
        if (chrome.runtime.lastError) {
            console.error('Error fetching state:', chrome.runtime.lastError.message);
            button.textContent = 'Error';
        } else if (response && response.isActive !== undefined) {
            updateButton(response.isActive);
        } else {
            console.error('Unexpected response:', response);
            button.textContent = 'Error';
        }
    });

    // Activate Extension
    function activateExtension() {
        chrome.runtime.sendMessage({ action: 'activate' }, function (response) {
            if (response && response.status === 'Extension activated') {
                alert('Extension activated!');
                updateButton(true);
            } else {
                alert('Failed to activate the extension.');
            }
        });
    }

    // Deactivate Extension
    function deactivateExtension() {
        chrome.runtime.sendMessage({ action: 'deactivate' }, function (response) {
            if (response && response.status === 'Extension deactivated') {
                alert('Extension deactivated!');
                updateButton(false);
            } else {
                alert('Failed to deactivate the extension.');
            }
        });
    }

    // Periodically update total and flagged website counts
    function updateCounts() {
        chrome.runtime.sendMessage({ action: 'getCounts' }, function (response) {
            if (response && response.total !== undefined && response.flagged !== undefined) {
                totalWebCount.textContent = `Total Websites Visited: ${response.total}`;
                flaggedWebCount.textContent = `Flagged Websites: ${response.flagged}`; 
            } else {
                console.error('Failed to fetch website count:', response);
            }
        });
    }

    setInterval(updateCounts, 1000); 
});
