export function downloadFile(data) {
  chrome.downloads.download({
    url: URL.createObjectURL(new Blob([data], { type: "text/srt" })),
    filename: "en" + ".srt",
  });
}
