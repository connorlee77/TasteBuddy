var lat, longi;
var phoneNumbers = []; //initializes array of phone numbers in order to call later on a click

var window = Ti.UI.createWindow({
	backgroundColor: "#FFFFFF",
});

var myTable = Ti.UI.createTableView({
	style: Ti.UI.iPhone.TableViewStyle.PLAIN
});

/**
 * Takes in current position of device
 * 
 * @param lat latitude of device
 * @param longi longitude of device 
 */
Ti.Geolocation.getCurrentPosition(function(e) {
	lat = e.coords.latitude;
	longi = e.coords.longitude;
});


/**
 * Sets up http-client
 * 
 * categoryId: Food
 * radius: 12km
 */
var url = "https://api.foursquare.com/v2/venues/search?ll="+ lat +","+ longi +"&categoryId=4d4b7105d754a06374d81259&radius=12000&oauth_token=UAZZOWG1VFZM1ARM4HASQYR3G5JH2RATGDQ1EMGHQRU4COWP&v=20140319";
var client = Ti.Network.createHTTPClient();

client.onerror = function(e) {
	createAlert('Error!', e.error);
};

/**
 * Runs when client loads
 * 
 * Parses the response of the request to FourSquare and 
 * stores the names of the restaurants in the row. 
 * 
 * Also adds phone number of each restaurant into array 
 * in order of its respective row placement. 
 */

client.onload = function() 
{	
	var places = JSON.parse(this.responseText);
	var tableRow = [];
	for(var i = 0; i <places.response.venues.length; i++) {
		var number = places.response.venues[i].contact.formattedPhone;
		var row = Ti.UI.createTableViewRow({
			title: places.response.venues[i].name,
			hasChild: false,
			height: 60,
			color: '#000'
		});
		tableRow.push(row);
		phoneNumbers.push(number);
	};
	myTable.setData(tableRow);
};


/**
 * Allows a click to show an alert for a phone number.
 * When there is no phone number, the alert will say so.
 */
myTable.addEventListener('click', function(e) {
	var call = phoneNumbers[e.index];
	
	if(call == null){ 								
		alert('No Number Listed');
	}
	else {
		alert(call);
	}
});


window.add(myTable);

if(Ti.Network.online) {
	client.open('GET', url);
	client.send();
}

window.open();