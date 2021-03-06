
const popupToCopy = content => {
	const modal = new tingle.modal({
		closeMethods: ["button"],
		onOpen: () =>
			// let close = modal.close / let close modal = modal.close
			// 	ambiguity? and why Haskell has referential transparency?
			document.querySelector(".exturl-copy-trigger")
				.addEventListener("exturlCopyCompleted", () => modal.close())
	})
	modal.setContent(
		`
			<div><textarea id="exturl-copy-source">${content}</textarea></div>
			<div>
				<button class="tingle-btn tingle-btn--primary exturl-copy-trigger"
						data-clipboard-target="#exturl-copy-source">
					COPY!
				</button>
			</div>
		`
	)
	modal.open()
}

browser.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		if (request["kind"] == "POPUP_TO_COPY") {
			popupToCopy(request["content"])
		}
		if (request["kind"] == "COPY_TO_CLIPBOARD") {
			copyToClipboard(request["content"])
		}
	}
)

const copyIt = () => {
	const target = document.getElementById("exturl-copy-source")
	target.focus()
	target.select()
	document.execCommand('copy')
}

document.body.addEventListener("click",
	e => {
		if (e.target.classList.contains("exturl-copy-trigger")) {
			copyIt()
			e.target.dispatchEvent(new CustomEvent("exturlCopyCompleted", { }))
		}
	});

const copyToClipboard = content => {
	const element = document.createElement("textarea")
	Object.assign(element.style, {
		width: "2em",
		height: "2em"
	})
	document.body.appendChild(element)
	element.value = content
	// element.focus()
	element.select()
	document.execCommand("copy")
	document.body.removeChild(element)
}
