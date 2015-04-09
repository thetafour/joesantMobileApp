var currentItem = 0; //Selection variable
var tax = 0; // calculating tax variable
var subtotal = 0; //calculating subtotal variable
var total = 0; //calculating total variable

//fucntion that handles customer appointments. -> appends to id=home
$(document).on("pagebeforeshow", "#home", function () {

	$.ajax({
		url: "customer.json", //imports the JSON file
		dataType: "json",
		success: function (result) {
			//clears the data on the home page listview and to avoid duplications -> appends to id=appDates
			$("#appDates").empty();

			//Loop through the JSON file and pulls out data and appends data onto a listview 
			for (var i = 0; i < result.customerList.length; i++) {
				//captures the dates in the JSON file and creates a 'list-divider' -> appends to id=appDates
				$("#appDates").append("<li data-role='list-divider'>" + result.customerList[i].date + "</li>");

				//captures the customerName, time, intersection, city and date and generates a collection of buttons. 
				//Used for filtering based on data displayed -> appends to id=appDates
				$("#appDates").append("<li id=" + i + "><a href='#info'>" +
					"Name: " + result.customerList[i].customerName + "<small>" + " @ " + result.customerList[i].time + "</small>" + "</br>" +
					result.customerList[i].inter + "<small>" + " -- " + result.customerList[i].city + "</small>" + "</br>" +
					"<small>" + "Date: " + result.customerList[i].date + "</small>" + "</a></li>");

			}
			//Creates a list view and returns list of text (button information) -> appends to id=appDates
			$("#appDates").listview().listview("refresh");
			//				autodividers: true,
			//				autodividersSelector: function (li) {
			//					return (li.text());
			//				}

			//On click open Customer Page with appropriate id
			$("#appDates li").click(function () {
				currentItem = $(this).attr('id');
			});
		},
		//Error message displayed if JSON script or network disturbance occured.
		error: function (request, error) {
			alert('Network error has occurred please try again!');
		}
	});
});

//funtion that handles customer information. -> appends to id=info
$(document).on("pagebeforeshow", "#info", function () {
	$.ajax({
		url: "customer.json", //imports the JSON file
		dataType: "json",
		success: function (result) {
			//clears the data on the info page(s) and to avoid duplications
			$("#name").empty();
			$("#address").empty();
			$("#city").empty();
			$("#prov").empty();
			$("#postal").empty();
			$("#note").empty();
			$("#phoneNum").empty();

			//captures customer name -> //appends to id=name
			$("#name").append("<h4>" + "Name: " + result.customerList[currentItem].customerName + "</h4>");

			//captures customer address -> //appends to id=address
			$("#address").append("<h4>" + "Address: " + result.customerList[currentItem].address + "</h4>");

			//captures customer city -> //appends to id=city
			$("#city").append("<h4>" + "City: " + result.customerList[currentItem].city + "</h4>");

			//captures customer province -> //appends to id=prov
			$("#prov").append("<h4>" + "Prov: " + result.customerList[currentItem].prov + "</h4>");

			//captures customer postal code -> //appends to id=postal
			$("#postal").append("<h4>" + "PoCode: " + result.customerList[currentItem].postal + "</h3>");

			//captures customer note -> //appends to id=note
			$("#note").append("<h4>" + "Note: " + result.customerList[currentItem].note + "</h4>");

			//captures customer phone number -> //appends to id=phoneNum
			$("#phoneNum").append("<h4>" + "Number: " + result.customerList[currentItem].phoneNum + "</h4>");
		},
		//Error message displayed if JSON script or network disturbance occured.
		error: function (request, error) {
			alert('Network error has occurred please try again!');
		}
	});
});

//funtion that handles customer location. -> appends to id=map_page
$(document).on("pagebeforeshow", "#info", function () {
	$.ajax({
		url: "customer.json", //imports the JSON file
		dataType: "json",
		success: function (result) {
			//clears the data on the map_page and to avoid duplications
			$("#directions").empty();
			$("#result").empty();
			$("map_canvas").empty();
			var lat = result.customerList[currentItem].lat; //<-- customer latitude from JSON file
			var lon = result.customerList[currentItem].lon; //<-- customer longitude from JSON file

			var map,
				currentPosition,
				directionsDisplay,
				directionsService,
				destinationLatitude = lat,
				destinationLongitude = lon;

			//function that intializes map and calculates route -> lat, lon
			function initializeMapAndCalculateRoute(lat, lon) {
				directionsDisplay = new google.maps.DirectionsRenderer();
				directionsService = new google.maps.DirectionsService();

				currentPosition = new google.maps.LatLng(lat, lon);

				map = new google.maps.Map(document.getElementById("map_canvas"), {
					zoom: 15,
					center: currentPosition,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				});

				directionsDisplay.setMap(map);

				var currentPositionMarker = new google.maps.Marker({
					position: currentPosition,
					map: map,
					title: "Current position"
				});


				//calculate Route
				calculateRoute();
			}
			//the current position could not be located
			function locError(error) {
				alert('the current position could not be located');
			}

			//initialize map with current position and calculate the route
			function locSuccess(position) {
				initializeMapAndCalculateRoute(position.coords.latitude, position.coords.longitude);
			}
			
			//function to calculate route
			function calculateRoute() {

				var targetDestination = new google.maps.LatLng(destinationLatitude, destinationLongitude);
				if (currentPosition != '' && targetDestination != '') {

					var request = {
						origin: currentPosition,
						destination: targetDestination,
						travelMode: google.maps.DirectionsTravelMode["DRIVING"]
					};

					directionsService.route(request, function (response, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							directionsDisplay.setPanel(document.getElementById("directions"));
							directionsDisplay.setDirections(response);


							$("#results").show();
						} else {
							$("#results").hide();
						}
					});
				} else {
					$("#results").hide();
				}
			}


			// find current position and on success initialize map and calculate the route
			navigator.geolocation.getCurrentPosition(locSuccess, locError);


		},
		//Error message displayed if JSON script or network disturbance occured.
		error: function (request, error) {
			alert('Network error has occurred please try again!');
		}
	});
});

//fucntion that handles creating quotes -> appends to id=quote
$(document).on("pagebeforeshow", "#quote", function () {
	$.ajax({
		url: "customer.json", //imports the JSON file
		dataType: "json",
		success: function (result) {
			
			//Submit button on click
			$("#submit").click(function () {
				
				//clears the data on the output and to avoid duplications
				$("#output").empty();
				
				//captures shingles material cost
				var materialCost = parseInt($('#material option:selected').val());
				
				//captures shingles material name
				var materialName = $('#material option:selected').text();
				
				//captures the roofs dimension from calSurfaceArea function
				var roofDim = calSurfaceArea();

				//subtotal is stored from materialCost * calSurfaceArea();
				subtotal = materialCost * calSurfaceArea();
				
				//tax is stored from HST * subtotal
				tax = .13 * subtotal;
				
				//total is stored from subtotal + tax
				total = subtotal + tax;
				
				//Quote information is generated into a table -> appends to id=output
				$("#output").append("<h3>Quote Info:</h3>");
				$("#output").append("<table data-role='table' class='ui-responsive'>");
				$("#output").append("<th>Name:</th><th>Address:</th><th>Roof Dim:</th><th>Material:</th><th>Tax:</th><th>Subtotal:</th><th>Total:</th>");
				$("#output").append("<tr><td>" + result.customerList[currentItem].customerName + " </td><td> " + result.customerList[currentItem].address + " </td><td> " + roofDim +" sq. ft. " + " </td><td> " + materialName + " </td><td> " + "$"+tax.toFixed(2) + " </td><td> " + "$"+subtotal.toFixed(2) + " </td><td> " + "$"+total.toFixed(2)  +  " </td></tr> ");
				
				$("#output").append("</table>").addClass('tableStyle');
			});
		},
		//Error message displayed if JSON script or network disturbance occured.
		error: function (request, error) {
			alert('Network error has occurred please try again!');
		}
	});
});

//function to calculate roof surfacearea
function calSurfaceArea() {
	var face;
	var area1;
	var area2;
	var area3;
	var surfaceArea;
	var base = parseInt($("#base").val());
	var length = parseInt($("#length").val());
	var slant = parseInt($("#slant").val());

	//base of the roof must be greater or equals to the slant of the house, else throw an error message.
	if (base >= slant) {
		base = base / 2;
		height = (Math.pow(slant, 2)) - (Math.pow(base, 2));
		height = Math.sqrt(height, 2).toFixed(2);
		base = parseInt($("#base").val());
		face = 1 / 2 * base * height;
		area1 = slant * length;
		area2 = base * length;
		area3 = slant * length;
		surfaceArea = (face * 2) + (area1 + area2 + area3);
	} else {
		alert("Calculation Error! Base is less than Pitch");
	}
	return surfaceArea;
}