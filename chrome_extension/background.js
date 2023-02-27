chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(request);
	console.log(sender);
	console.log(sendResponse);

	if (request.type == 'getData') {
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), request.timeout);

		console.log(`Fetching: ${request.url}`);
		try {
			fetch(request.url, {
				signal: controller.signal
			})
				.then((response) => {
					console.log(response);
					//sendResponse(response);
					response.text().then((text) => {
						sendResponse({ text, ok: response.ok });
					});
				})
				.catch((err) => {
					console.log(err);
					sendResponse(err);
				});
		} catch (err) {
			console.log(err);
		}

		return true;
	}
});
