var rowID;
var custId;
var InvoiceId;
var email;
var name;
var info;

$(document).on("pagecreate", "#home", function() {
	$.ajax({
		type:"GET", url:"customer.json", dataType:"json",
		success: parseJson,
		error: ajaxerror		
	});
});

$(document).on("pageshow", "#individual", function() {
	$.ajax({
		type:"GET", url:"customer.json", dataType:"json",
		success: parseJsonIndividual,
		error: ajaxerror		
	});
	
	if (navigator.geolocation) {
		info = new google.maps.InfoWindow({
		content: "Where am I?",
		maxWidth: 150		
		});
    } 
	else{
        alert("Geolocation is not supported by this browser.");
    }
	
});

$(document).on("pageshow", "#invoice", function() {
	$.ajax({
		type:"GET", url:"customer.json", dataType:"json",
		success: parseJsonInvoice,
		error: ajaxerror		
	});
});

$(document).on("click", "ul#customersList >li", function() {
	rowID = $(this).closest("li").attr("li-id");
});

$(document).on("click", "ul#customersList >li", function() {
	custId = $(this).closest("li").attr("data-custId");
});

$(document).on("click", "ul#InvoiceList >li", function() {
	InvoiceId = $(this).closest("li").attr("li-id");
});

function ajaxerror(){
	alert("JSON not loaded.");
}

function parseJson(data){
	
	var n=0;
	var p = 0;
	for(var i =0; i< data.customer.length; i++ ){
		var compId = data.customer[i].compId;
		var compName = data.customer[i].compName;
		var compAdd = data.customer[i].compAddr;
		var compCont = data.customer[i].compContact;
		var compPhone = data.customer[i].compPhone;
		var compEmail = data.customer[i].compEmail;
		
		for(var j=0; j<data.customer[i].invNumber.length; j++){
			
			var invNo = data.customer[i].invNumber[j].invNum;
		}
		
		$("#customersList").append("<li data-custId='" + p  + "' li-id='" + n + "'>" + "<a href='#individual' data-transition='flip'>" + compName + "</a> </li>");
		n++;
		p = p+3;
	}
	
	$("#customersList").listview("refresh");	
}

function parseJsonIndividual(data){
					
		var compId = data.customer[rowID].compId;
		var compName = data.customer[rowID].compName;
		var compAddr = data.customer[rowID].compAddr;
		var compCont = data.customer[rowID].compContact;
		var compPhone = data.customer[rowID].compPhone;
		var compEmail = data.customer[rowID].compEmail;
		
		email = compEmail;
		name = compName;
		
		var n = 0;
		var clat;
		var clng;
		
		$("#compId").html(compId);
		$("#compName").html(compName);
		$("#compAddr").html(compAddr);
		$("#compCont").html(compCont);
		$("#compPhone").html(compPhone);
		$("#compEmail").html(compEmail);
		
		getCoord();
		//---------------------------
		function getCoord()  {
    var address = data.customer[rowID].compAddr;
	var geocoder = new google.maps.Geocoder();

    

    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
	    clat = results[0].geometry.location.lat();
	    clng = results[0].geometry.location.lng();
		drawMap();
        }});
	}
	    
	function drawMap()  {
	
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var labelIndex = 0;	
        var geocoder = new google.maps.Geocoder();
        var lat = clat;
        var lng = clng;
        var latlng = new google.maps.LatLng(lat,lng);
        geocoder.geocode({"latLng":latlng}, function(data,status)  {
            if (status == google.maps.GeocoderStatus.OK)  {
				
                var mapOptions = {
                    center: latlng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                
                //  Display map
                var map = new google.maps.Map($("#mapDiv")[0], mapOptions);

                //  Define map marker
                var myLoc = new google.maps.Marker ({
                    map: map,
                    animation: google.maps.Animation.DROP,
                    position: latlng,
                    label: labels[labelIndex++ % labels.length]			
                    });
                    
                google.maps.event.addListener(myLoc, "click", function() { 
                    var latlng = new google.maps.LatLng(this.position.lat(),this.position.lng());
                    geocoder.geocode({"latLng":latlng}, function(data,status)  {
                        if (status === google.maps.GeocoderStatus.OK)
                            info.setContent(compName + "<br>" + data[0].formatted_address);
                        });
                    info.open(map, this);
                    });
                }
        });
    };
						
    function error(err)  {
        alert("Error " + err.code + " : " + err.message);
    };						
		
		
	$("#InvoiceList").html(" ");
	for(var j=0; j<data.customer[rowID].invNumber.length; j++){
		var invNo = data.customer[rowID].invNumber[j].invNum;
		$("#InvoiceList").append("<li li-id='" + n + "'>" + "<a href='#invoice'  data-transition='flip'>" + invNo + "</a> </li>");
		n++;
	}
	$("#InvoiceList").listview("refresh");	
			
}

function parseJsonInvoice(data){
		var n = 1;
		var invoiceNo = parseInt(custId) + parseInt(InvoiceId) ; 
	
		var invNum = data.invoice[invoiceNo].invNum;
		var invDate = data.invoice[invoiceNo].invDate;
		var invAmt = data.invoice[invoiceNo].invAmt;
		var compId = data.invoice[invoiceNo].compId;
		
		$("#invoiceNumber").html(invNum);
		$("#invoiceDate").html(invDate);
		$("#invoiceAmount").html(invAmt);
		$("#invCompId").html(compId);
		
		for(var i=0 ; i<data.invoice[invoiceNo].products.length; i++){
			var prodId = data.invoice[invoiceNo].products[i].prodId;
			var qty = data.invoice[invoiceNo].products[i].qty;
			
			$("#productId"+n).html(prodId);
			$("#quantity"+n).html(qty);
			
			var productId;
			
			for(var j=0 ; j<data.product.length; j++){
				 productId = data.product[j].prodId;
				 
				 if(prodId===productId){
					 var productDesc = data.product[j].prodDesc;
					 var productAmt = data.product[j].prodAmt;
					 
				 	$("#prodDesc"+n).html(productDesc);
					$("#prodAmt"+n).html(productAmt);
				 }
			}
			n++;
		}			
}

function sendEmail(){

		var subject = "Final Project test email";
		var message = "Hi, " + name + ". We are deSiGniT.";
		
		var x = "mailto:" + email+ '?subject=' + subject + '&body=' + message ;
		document.location.href = x;
		$('#demo').HTML = x;
}

