function ajaxRequest(method, url, data, callback) {
	let request = new XMLHttpRequest();
	request.open(method, url, true);
	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			if (request.status === 200) {
				callback(JSON.parse(request.responseText));
			}
			else if (request.status === 201) {
				callback(JSON.parse(request.responseText));
			}
			else if (request.status === 204) {
				callback(204);
			}
			else if (request.status === 205) {
				callback(request.responseText);
			}
			else if (request.status === 400) {
				console.log("400 Bad request");
			}
			else if (request.status === 403) {
				console.log("403 Forbidden");
				callback(403);
			}
			else if (request.status === 404) {
				console.log("404 Not Found");
				callback(404);
			}
			else if (request.status === 405) {
				console.log("405 Method not allowed");
				callback(405);
			}
			else if (request.status === 418) {
				console.log("418 Teapot");
				callback(418);
			}
		}
	};
	request.setRequestHeader("Accept", "application/json");
	if (method === "POST" || method === "PUT") {
		request.setRequestHeader("Content-Type", "application/json");
	}
	request.send(JSON.stringify(data));
}
