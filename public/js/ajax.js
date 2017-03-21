/**
 * Do ajax request
 * @param  {String}   method
 * @param  {String}   url
 * @param  {Object}   headers  `key` : `value` pair for each header
 * @param  {Object}   data     body data
 * @param  {Function} callback on response
 */

function ajaxRequest(method, url, headers, data, callback) {
	let request = new XMLHttpRequest();
	request.open(method, url, true);
	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			switch (request.status) {
				case 200:
				case 201:
					callback(JSON.parse(request.responseText));
					break;
				case 205:
					callback(request.responseText);
					break;
				default:
					console.log(request.status);
					callback(request.status);
			}
		}
	};

	request.setRequestHeader("Accept", "application/json");

	// add custom headers
	if (headers) {
    for (header in headers) {
			request.setRequestHeader(`${header}`, `${headers[header]}`);
		}
  }

	if (method === "POST" || method === "PUT") {
		request.setRequestHeader("Content-Type", "application/json");
	}

	// send body data
	request.send(JSON.stringify(data));
}
