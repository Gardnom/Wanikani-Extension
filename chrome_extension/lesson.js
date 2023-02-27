let svgText = '';

async function OnLessonItemChanged() {
	let mainInfoDiv;
	while (!mainInfoDiv) {
		mainInfoDiv = document.querySelector('#main-info');
		await TimeoutMs(10);
	}
	if (!mainInfoDiv.classList.contains('kanji')) return;

	//const kanji = mainInfoDiv.querySelector('#character').innerHTML;
	const kanji = '親';
	// Todo: Kanji not found, case should be handled
	if (!kanji) return;
	console.log(kanji);
	const url = `https://localhost:7148/KanjiSvg/getsvg/${kanji}`;
	const { text, ok } = await GetRequest(url);
	//console.log('Reponse:', respJson);
	//console.log('Reponse body:', text);

	if (!text) {
		console.log('Error when fetching kanji svg');
		return;
	}
	if (!ok) {
		console.log('Failed to fetch kanji svg');
		return;
	}
	console.log('Set');
	svgText = text;
	//OnHandwritingMenuItemClicked('');
}

async function GetCurrentKanjiSvg() {
	let mainInfoDiv;
	while (!mainInfoDiv) {
		mainInfoDiv = document.querySelector('#main-info');
		await TimeoutMs(10);
	}
	// Todo: this should be added again
	if (!mainInfoDiv.classList.contains('kanji')) return null;

	const kanji = mainInfoDiv.querySelector('#character').innerHTML;
	//const kanji = '親';

	// Todo: Kanji not found, case should be handled
	if (!kanji) {
		console.log('Kanji not found in dom');
		return;
	}
	console.log(kanji);
	const url = `https://localhost:7148/KanjiSvg/getsvg/${kanji}`;
	const { text, ok } = await GetRequest(url);
	//console.log('Reponse:', respJson);
	//console.log('Reponse body:', text);

	if (!text) {
		console.log('Error when fetching kanji svg');
		return null;
	}
	if (!ok) {
		console.log('Failed to fetch kanji svg');
		return null;
	}

	return text;
}

let handWritingMenuItem;
let menuItemList;

async function CreateHandwritingButton() {
	const statsDiv = await GetNode('#stats');
	const list = statsDiv.children[0];
	console.log('List children', list.children[0]);

	const newBtn = document.createElement('button');
	newBtn.innerHTML = 'Display Handwriting';
	newBtn.addEventListener('click', OnHandwritingButtonClicked);

	const wrapperElement = document.createElement('li');
	wrapperElement.appendChild(newBtn);

	list.prepend(wrapperElement);
}

const handWritingElementId = 'addon-HW-Elem';

async function CreateHandwritingElement() {
	const lastHandWritingElement = document.getElementById(handWritingElementId);
	if (lastHandWritingElement != null) {
		lastHandWritingElement.remove();
	}
	const newElem = document.createElement('div');
	newElem.id = handWritingElementId;
	newElem.className = 'HWWrapper';

	const svg = await GetCurrentKanjiSvg();
	if (svg == null) {
		console.log('Could not retreive kanji');
		return;
	}
	newElem.innerHTML = svg;
	document.body.appendChild(newElem);
}

function OnHandwritingButtonClicked() {
	CreateHandwritingElement();
}

async function AttachHandwritingMenuItem() {
	const nav = await GetNode('#supplement-nav');
	menuItemList = nav.getElementsByTagName('ul')[0];
	for (var element of menuItemList.children) {
		console.log(element);
		//getEventListeners(element);
	}

	const newItemHtml =
		'<li data-index="4" data-itemtype="kanji" class>Handwriting</li>';
	handWritingMenuItem = new DOMParser().parseFromString(
		newItemHtml,
		'text/html'
	).body.firstElementChild;
	menuItemList.appendChild(handWritingMenuItem);

	handWritingMenuItem.addEventListener('click', OnHandwritingMenuItemClicked);
}

async function OnHandwritingMenuItemClicked(event) {
	const supplementDiv = document.getElementById('supplement-kan');
	const lastContentDivId = supplementDiv.children[0].id;
	/*const svgWrapper = document.createElement('div');
	svgWrapper.innerHTML = svgText;
	contentWrapperDiv.appendChild(svgWrapper);*/
	supplementDiv.innerHTML = `<div id="${lastContentDivId}">
	<div class="pure-g-r">
		<div class="pure-u-1 col1">
		${svgText}
		</div>
	</div>
	</div>`;
	menuItemList.querySelector('.active').classList.remove('active');
	handWritingMenuItem.classList.add('active');
}

async function GetNodeList(query, node = document) {
	let nodeList;
	while (!nodeList || nodeList.length < 1) {
		nodeList = node.querySelectorAll(query);
		await TimeoutMs(10);
	}
	return nodeList;
}

async function GetNode(query, node = document) {
	let sNode;
	while (!sNode) {
		sNode = node.querySelector(query);
		await TimeoutMs(10);
	}
	return sNode;
}

async function TimeoutMs(time) {
	return new Promise((res, rej) => {
		setTimeout(() => {
			res();
		}, time);
	});
}

function GetRequest(url, timeout = 10000) {
	return new Promise((res, rej) => {
		chrome.runtime.sendMessage(
			{
				type: 'getData',
				url: url,
				timeout
			},
			function (resp) {
				console.log('Resolving');
				console.log(resp);
				res(resp);
			}
		);
	});
}

OnLessonItemChanged();
CreateHandwritingButton();
//AttachHandwritingMenuItem();
