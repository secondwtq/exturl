
const port = chrome.extension.connect({
	"name": "exturlPort" })

const postOperationMessage = operation =>
	port.postMessage({
		"kind": "EXTURL_OP",
		"operation": operation
	})

document.getElementById("trigger-copy-current-page")
	.addEventListener("click", () =>
		(postOperationMessage("copyCurrentPage"), window.close())
	)

document.getElementById("trigger-just-copy-current-page")
	.addEventListener("click", () =>
		(postOperationMessage("justCopyCurrentPage"), window.close())
	)

document.getElementById("trigger-copy-all-current-window")
	.addEventListener("click", () =>
		(postOperationMessage("copyAllCurrentWindow"), window.close())
	)
