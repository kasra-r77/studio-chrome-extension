/******/ (function() { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.external_url) {
        createExternalMedia(msg.external_url);
    }
    if (msg.captionDownloadTitle) {
        chrome.storage.local
            .get(["authToken", "userID", "caption", "studioDomain"])
            .then((result) => {
            if (result.authToken && result.userID && result.caption) {
                const captionFile = new Blob([result.caption], { type: "text/srt" });
                const formData = new FormData();
                formData.append("caption_file", captionFile);
                fetch(`${result.studioDomain}/api/public/v1/media/search?title=${msg.captionDownloadTitle}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer user_id="${result.userID}",token="${result.authToken}"`,
                    },
                }).then((res) => res.json().then((data) => {
                    fetch(`${result.studioDomain}/api/public/v1/media/${data.media[0].id}/caption_files?srclang=en`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer user_id="${result.userID}",token="${result.authToken}"`,
                        },
                        body: formData,
                    });
                }));
            }
            else {
                console.error("Not authorized");
            }
        });
    }
});
// I have to use fetch manually here, because axios is based on XMLHttpRequest
function createExternalMedia(url) {
    chrome.storage.local
        .get(["authToken", "userID", "studioDomain"])
        .then((result) => {
        if (result.authToken && result.userID) {
            fetch(`${result.studioDomain}/api/media_management/collections/5/media`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer user_id="${result.userID}",token="${result.authToken}"`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    external_url: url,
                }),
            });
        }
        else {
            console.error("Not authorized");
        }
    });
}
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Prevent double firing of event - extension should run once on complete.
    if (changeInfo.status === "complete") {
        chrome.webRequest.onCompleted.addListener(initOnce, {
            urls: ["https://www.youtube.com/*"],
        });
    }
});
function initOnce(details) {
    if (details.url.includes("timedtext?v")) {
        fetch(details.url, {
            method: "GET",
        }).then((res) => {
            res.json().then((body) => downloadCaption(body));
        });
        chrome.webRequest.onCompleted.removeListener(initOnce);
    }
}
function downloadCaption(json) {
    const getSegments = (events) => {
        const segments = [];
        let segmentText = "";
        let segment = {
            startTimeMs: 0,
        };
        events.forEach((evt) => {
            // check whether it is manually uploaded CC or not
            if (!evt.wWinId && evt.segs) {
                segment.startTimeMs = evt.tStartMs;
                segment.endTimeMs = evt.tStartMs + evt.dDurationMs;
                (evt.segs || []).forEach((seg) => {
                    const text = seg.utf8;
                    if (text && text !== "\n") {
                        segmentText += text || "";
                    }
                });
                segment.text = segmentText;
                segments.push(segment);
                segment = {};
                segmentText = "";
                return;
            }
            // Below code is a fall back for Auto Generated CC
            if (!evt.aAppend) {
                segment.startTimeMs = evt.tStartMs;
                (evt.segs || []).forEach((seg) => {
                    const text = seg.utf8;
                    if (text && text !== "\n") {
                        segmentText += text || "";
                    }
                });
            }
            else {
                segment.endTimeMs = evt.tStartMs;
                segment.text = segmentText;
                segments.push(segment);
                segment = {};
                segmentText = "";
            }
        });
        return segments;
    };
    const YTCaptionLines = getSegments(json.events);
    const convertToStrTime = (ms) => {
        let seconds = Math.floor(ms / 1000);
        ms = ms % 1000;
        const milliseconds = ms;
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        const hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        // return format: 00:00:06,319
        return `${padZero([hours, minutes, seconds]).join(":")},${padZero([milliseconds], true)[0]}`;
    };
    const padZero = (numList, ms) => {
        if (!Array.isArray(numList))
            return [];
        if (ms) {
            const milliseconds = numList[0];
            if (milliseconds >= 100) {
                return [milliseconds];
            }
            else if (milliseconds <= 99 && milliseconds >= 10) {
                return [`0${milliseconds}`];
            }
            else {
                return [`00${milliseconds}`];
            }
        }
        return numList.map((num) => {
            if (+num >= 10)
                return `${num}`;
            return `0${num}`;
        });
    };
    const convertSegmentsToSrt = (segments) => {
        let srtString = "";
        segments.forEach((segment, index) => {
            const startTime = convertToStrTime(segment.startTimeMs);
            const endTime = convertToStrTime(segment.endTimeMs);
            const text = "" +
                (index + 1) +
                "\r\n" +
                startTime +
                " --> " +
                endTime +
                "\r\n" +
                segment.text +
                "\r\n\r\n";
            srtString += text;
        });
        return srtString;
    };
    const file = convertSegmentsToSrt(YTCaptionLines);
    if (file) {
        // adding a plus button to page to add a plus button to YT player for adding the caption to Studio media
        // to do this a message will deliver the new to content script
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { captionStatus: "ready" });
        });
        chrome.storage.local.set({ caption: file });
    }
}

/******/ })()
;
//# sourceMappingURL=background.js.map