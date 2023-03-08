function addYoutubeButton(): void {
  const addToStudioButton = document.createElement("button");
  const imgUrl = chrome.runtime.getURL("icon-white.png");
  const studioImg = document.createElement("img");

  // Studio YT button
  addToStudioButton.className = "ytp-button";
  addToStudioButton.type = "button";
  addToStudioButton.title = "click to add this video to your Studio library";
  addToStudioButton.style.height = "100%";
  addToStudioButton.style.margin = "6.3px 18px";
  addToStudioButton.style.width = "100%";
  addToStudioButton.style.textAlign = "end";

  // img styling
  studioImg.src = imgUrl;
  studioImg.style.width = "22px";
  addToStudioButton.append(studioImg);

  const youtubeLeftControls =
    document.getElementsByClassName("ytp-left-controls")[0];
  if (youtubeLeftControls) {
    youtubeLeftControls.append(addToStudioButton);
    addToStudioButton.addEventListener("click", () => {
      const getIframe = (): HTMLCollectionOf<Element> => {
        return document.getElementsByClassName("ytp-impression-link");
      };

      const extractYTLink = () => {
        const link = (getIframe()[0] as HTMLAnchorElement).href;
        return link.split("&embed")[0];
      };

      if (getIframe().length >= 1) {
        successAlert();
        chrome.runtime.sendMessage({ external_url: extractYTLink() });
      } else {
        successAlert();
        chrome.runtime.sendMessage({ external_url: window.location.href });
      }
    });
  }
}

addYoutubeButton();

function successAlert() {
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.margin = "0 auto";
  container.style.position = "fixed";
  container.style.top = "80px";

  const alert = document.createElement("div");
  alert.style.backgroundColor = "#0B874B";
  alert.style.height = "40px";
  alert.style.width = "500px";
  alert.style.margin = "0 auto";
  alert.innerText = "Video has been successfully saved to Studio";
  alert.style.fontSize = "15px";
  alert.style.color = "white";
  alert.style.textAlign = "center";
  alert.style.paddingTop = "20px";

  const main = document.getElementsByTagName("body")[0];

  container.appendChild(alert);
  main.appendChild(container);

  setTimeout(() => {
    container.style.display = "none";
  }, 2000);
}

function loadCaptionDownloadButton() {
  const youtubeLeftControls =
    document.getElementsByClassName("ytp-left-controls")[0];

  const captionDownloadButton = document.createElement("button");
  const imgUrl = chrome.runtime.getURL("download-icon.png");
  const captionIcon = document.createElement("img");

  // Caption download YT button
  captionDownloadButton.className = "ytp-button";
  captionDownloadButton.type = "button";
  captionDownloadButton.title =
    "click to add this video to your Studio library";
  captionDownloadButton.style.height = "100%";
  captionDownloadButton.style.margin = "6.3px 18px";

  // img styling
  captionIcon.src = imgUrl;
  captionIcon.style.width = "22px";
  captionDownloadButton.append(captionIcon);

  if (youtubeLeftControls) {
    youtubeLeftControls.append(captionDownloadButton);
    const YTVideoTitle = document
      .getElementsByTagName("title")[0]
      .textContent.split(" - ")[0];
    captionDownloadButton.addEventListener("click", () => {
      chrome.runtime.sendMessage({ captionDownloadTitle: YTVideoTitle });
      successAlert();
    });
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.captionStatus === "ready") {
    loadCaptionDownloadButton();
  }
});
