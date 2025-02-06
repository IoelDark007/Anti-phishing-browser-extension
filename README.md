# Anti-Phishing Browser Extension: Shield Your Browsing

## Real-time Phishing Detection and Protection

This browser extension provides real-time protection against phishing websites, helping you browse the web safely and securely.  It uses a JSON databse of confirmed phishing sites, Google Safe Browsing API and IPSQ API to identify and block potential threats before they can harm you.

## Introduction

In today's digital landscape, phishing attacks are becoming increasingly sophisticated.  This browser extension is designed to be a robust first line of defense against these threats.  It proactively scans URLs and website content, comparing them against known phishing patterns and blacklists.  This project was developed to demonstrate my skills in browser extension development, web security, and proficiency in JavaScript and API usage.  While functional, I welcome contributions and feedback to further enhance its capabilities.

## User Instructions

1. **Installation:**
    * **Chrome:** Clone the repository. Open `chrome://extensions/`, enable "Developer mode," and click "Load unpacked." Select the extension's directory.
    * **Firefox:** Clone the repository. Open `about:debugging#/runtime/this-firefox`. Click "Load Temporary Add-on..." and select the extension's directory.
2. **Usage:** Once installed, the extension works automatically in the background.  When you attempt to access a website that matches a known phishing or malware URL, the extension will:
    * **Block Access:** The website will be blocked immediately if it is a confirmed malicious site.
    * **Display Warning (for suspicious sites):** If the site is potentially suspicious, a warning page will be displayed for 10 seconds. This page will provide information about the potential risk and allow you to choose whether to proceed to the website or return to safety.
3. **Settings:**  Clicking the extension icon will open a popup where you can activate/deactivate real-time scanning.

## Contributor Expectations

Contributions are welcome!  I encourage you to contribute by:

* Reporting bugs: Please open an issue on GitHub describing the bug and steps to reproduce it.
* Suggesting features:  Open an issue with your feature request and a brief explanation of its benefits.
* Submitting code:  Fork the repository, make your changes, and submit a pull request.
## Known Issues

Currently, no known issues.  Please report any bugs you encounter.
