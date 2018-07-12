
// TODO: handle URLs like about:debugging
const reURL = /^([a-zA-Z]*)\:\/\/(.*?)\/?(\#.*)?$/

const schemesNotPreserved = new Set([ "https", "http" ]);

const exturlFromTab = tab => {
	if (/^about\:.*/i.test(tab.url)) { return null; }
	const [ url, scheme, location, hash ] = reURL.exec(tab.url)
	const prefix = schemesNotPreserved.has(scheme.toLowerCase()) ? "" : `${scheme}://`
	return `${prefix}${location} ${tab.title.trim()}`
}
const EXTURL_KINDS = {
	"EXTURL_OP": msg => EXTURL_OPERATIONS[msg["operation"]](msg)
}

const EXTURL_OPERATIONS = {
	"copyCurrentPage": msg =>
		browser.tabs.query({ "active": true, currentWindow: true }).then(([ tab ]) =>
			browser.tabs.sendMessage(tab.id, {
				"kind": "POPUP_TO_COPY",
				"content": exturlFromTab(tab)
			})
		),
	"justCopyCurrentPage": msg =>
		browser.tabs.query({ "active": true, currentWindow: true }).then(([ tab ]) =>
			browser.tabs.sendMessage(tab.id, {
				"kind": "COPY_TO_CLIPBOARD",
				"content": exturlFromTab(tab)
			})
		),
	"copyAllCurrentWindow": msg =>
		browser.tabs.query({ "windowId": browser.windows.WINDOW_ID_CURRENT }).then(tabsCurrentWindow =>
			browser.tabs.query({ "active": true, currentWindow: true }).then(([ currentTab ]) =>
				browser.tabs.sendMessage(currentTab.id, {
					"kind": "POPUP_TO_COPY",
					"content": tabsCurrentWindow.map(exturlFromTab).filter(i => !!i).join("\n")
				})
			)
		)
}

operations = EXTURL_OPERATIONS

// const port = chrome.extension.connect({ "name": "exturlPort" })

// chrome.extension.onConnect.addListener(port => {
// 	if (port.name == "exturlPort") {
// 		port.onMessage.addListener(msg => EXTURL_KINDS[msg["kind"]](msg))
// 	}
// })

browser.contextMenus.create({
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
