
const reURL = /^([a-zA-Z]*)\:\/\/(.*?)\/?(\#.*)?$/

const schemesNotPreserved = new Set([ "https", "http" ]);

const exturlFromTab = tab => {
	const [ url, scheme, location, hash ] = reURL.exec(tab.url)
	const prefix = schemesNotPreserved.has(scheme.toLowerCase()) ? "" : `${scheme}://`
	return `${prefix}${location} ${tab.title.trim()}`
}

const copyToClipboard = content => {
	const element = document.createElement("textarea")
	Object.assign(element.style, {
		width: "2em",
		height: "2em"
	})
	element.value = content
	document.body.appendChild(element)
	element.focus()
	element.select()
	document.execCommand("copy")
	document.body.removeChild(element)
}

const EXTURL_KINDS = {
	"EXTURL_OP": msg => EXTURL_OPERATIONS[msg["operation"]](msg)
}

const EXTURL_OPERATIONS = {
	"copyCurrentPage": msg =>
		chrome.tabs.query({ "active": true, currentWindow: true }, ([ tab ]) =>
			chrome.tabs.sendMessage(tab.id, {
				"kind": "POPUP_TO_COPY",
				"content": exturlFromTab(tab)
			})
		),
	"justCopyCurrentPage": msg =>
		chrome.tabs.query({ "active": true, currentWindow: true }, ([ tab ]) =>
			copyToClipboard(exturlFromTab(tab))
		),
	"copyAllCurrentWindow": msg =>
		chrome.tabs.query({ "windowId": chrome.windows.WINDOW_ID_CURRENT }, tabsCurrentWindow =>
			chrome.tabs.query({ "active": true, currentWindow: true }, ([ currentTab ]) =>
				chrome.tabs.sendMessage(currentTab.id, {
					"kind": "POPUP_TO_COPY",
					"content": tabsCurrentWindow.map(exturlFromTab).join("\n")
				})
			)
		)
}

const port = chrome.extension.connect({ "name": "exturlPort" })

chrome.extension.onConnect.addListener(port => {
	if (port.name == "exturlPort") {
		port.onMessage.addListener(msg => EXTURL_KINDS[msg["kind"]](msg))
	}
})

chrome.contextMenus.create({
	"title": "exturl Active Tab",
	"onclick": () => EXTURL_OPERATIONS["justCopyCurrentPage"]()
})

// chrome.contextMenus.create({
// 	"title": "exturl",
// 	"id": "exturl-context-menu-grand-parent"
// })

// chrome.contextMenus.create({
// 	"title": "Just Copy Current Page",
// 	"parentId": "exturl-context-menu-grand-parent",
// 	"onclick": () => EXTURL_OPERATIONS["justCopyCurrentPage"]()
// })

// chrome.contextMenus.create({
// 	"title": "Copy Current Page",
// 	"parentId": "exturl-context-menu-grand-parent",
// 	"onclick": () => EXTURL_OPERATIONS["copyCurrentPage"]()
// })

// chrome.contextMenus.create({
// 	"title": "Copy All Current Window",
// 	"parentId": "exturl-context-menu-grand-parent",
// 	"onclick": () => EXTURL_OPERATIONS["copyAllCurrentWindow"]()
// })
