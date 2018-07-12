
// const port = chrome.extension.connect({
// 	"name": "exturlPort" })

// const postOperationMessage = operation =>
// 	port.postMessage({
// 		"kind": "EXTURL_OP",
// 		"operation": operation
// 	})

console.log(browser.extension.getBackgroundPage().operations)

document.getElementById("trigger-copy-current-page")
	.addEventListener("click", () =>
		(browser.extension.getBackgroundPage().operations.copyCurrentPage(), window.close())
	)

document.getElementById("trigger-just-copy-current-page")
	.addEventListener("click", () =>
		(browser.extension.getBackgroundPage().operations.justCopyCurrentPage(), window.close())
	)

document.getElementById("trigger-copy-all-current-window")
	.addEventListener("click", () =>
		(browser.extension.getBackgroundPage().operations.copyAllCurrentWindow(), window.close())
	)
