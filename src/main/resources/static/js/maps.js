/**
 * 
 */
var canvas;
var context;
var imagePaper1;
var imagePaper2;
var imagePaper3;
var imagePaper4;
var arr;
var cleanlist = [];
var kx = 384700;
var ky = 6675500;
var filescale = "8000";
var cordinate_move = 1800;
var jakaja = 2;
var cx = 0;
var cy = 0;
var mousex;
var mousey;
var mouseDown = 0;
var x;
var y;
var date_selection = "";
var edit_status = false;

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function drawlines(){
	context.beginPath();
	var koex_t = 0;
	var koey_t = 0;
	for(var i=0;i<arr.length;i++){
		var obj = arr[i];
		
		if(cleanlist.length>0 && cleanlist.indexOf(obj['dates']) != -1)
			continue;
		
		var lon = obj['lon'];
		var lat = obj['lat'];
		var koex = (lon - kx)/jakaja + cx - 450;
		var koey = (ky - lat)/jakaja + cy - 450;
		if((Math.abs(koex - koex_t) > 5) && (Math.abs(koey - koey_t) > 5)){
			context.rect(koex, koey, 10, 10);
			koex_t = koex;
			koey_t = koey;
			}
	}

	context.fillStyle = 'yellow';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = 'black';
    context.stroke();
}

function loadmapfile(){
	if (document.getElementById('showtracks').checked)
		arr = JSON.parse(httpGet("/locations?lon="+kx+"&lat="+ky+"&size="+cordinate_move+"&dates="+date_selection));
	imagePaper1.src = "/karttaainesto/"+filescale+kx+"-"+ky;
	imagePaper2.src = "/karttaainesto/"+filescale+(kx+cordinate_move)+"-"+ky;
	imagePaper3.src = "/karttaainesto/"+filescale+kx+"-"+(ky-cordinate_move);
	imagePaper4.src = "/karttaainesto/"+filescale+(kx+cordinate_move)+"-"+(ky-cordinate_move);
	imagePaper1.onload = function() {
		context.drawImage(imagePaper1, cx-450, cy-450);
	}
	imagePaper2.onload = function() {
		context.drawImage(imagePaper2, cx+450, cy-450);
	}
	imagePaper3.onload = function() {
		context.drawImage(imagePaper3, cx-450, cy+450);
	}
	imagePaper4.onload = function() {
		context.drawImage(imagePaper4, cx+450, cy+450);
	}
}

onload = function () {

	document.body.onmousedown = function() { 
	    mouseDown = 1;
		mousex = x;
		mousey = y;
	}
	document.body.onmouseup = function() {
	    mouseDown = 0;
	}

	document.addEventListener('mousemove', onMouseMove, false)
	
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");
	imagePaper1 = new Image();
	imagePaper2 = new Image();
	imagePaper3 = new Image();
	imagePaper4 = new Image();
	loadmapfile();
	loaddateselection();
	
	document.getElementById('editrow').style.display = "none";
};

function loaddateselection(){
	var dayarr = JSON.parse(httpGet("/locationsday"));
	var daySelect = document.getElementById('dateselection');
	for(var i=0;i<dayarr.length;i++)
		daySelect.options[daySelect.options.length] = new Option(dayarr[i], dayarr[i]);
}

function draw4images(){
	context.drawImage(imagePaper1, cx-450, cy-450);
	context.drawImage(imagePaper2, cx+450, cy-450);
	context.drawImage(imagePaper3, cx-450, cy+450);
	context.drawImage(imagePaper4, cx+450, cy+450);
}

function onMouseMove(e){

	x = e.clientX;
	y = e.clientY;

	if(mouseDown){

	if(edit_status){
		findCleanPoint();
	} else {

		cx += Math.floor((x - mousex)/10);
		cy += Math.floor((y - mousey)/10);
	
		draw4images();
		if (document.getElementById('showtracks').checked)
			drawlines();
	
		if(cx > 450){
			kx -= cordinate_move;
			cx = 0;
			loadmapfile();
		} else if(cx < -450){
			kx += cordinate_move;
			cx = 0;
			loadmapfile();
		}
		if(cy > 450){
			ky += cordinate_move;
			cy = 0;
			loadmapfile();
		} else if(cy < -450){
			ky -= cordinate_move;
			cy = 0;
			loadmapfile();
		}
		writePosition((kx + (900-cx) * jakaja), (ky - (900-cy) * jakaja))
		}
	}
}

function findCleanPoint(){
	var rect = canvas.getBoundingClientRect();
	var ty = y - rect.top;
	var tx = x - rect.left;
//	console.log("tx="+x+" ty="+y);

	for(var i=0;i<arr.length;i++){
		var obj = arr[i];
		var lon = obj['lon'];
		var lat = obj['lat'];

		var koex = (lon - kx)/jakaja + cx - 450;
		var koey = (ky - lat)/jakaja + cy - 450;

		if (((tx-10) < koex) && ((tx+10) > koex) && ((ty-10) < koey) && ((ty+10) > koey) && (cleanlist.indexOf(obj['dates']) === -1)){
			cleanlist.push(obj['dates']);
			draw4images();
			if (document.getElementById('showtracks').checked)
				drawlines();
		}
	}
}

function cleanFunction(){
	edit_status =! edit_status;
	if (edit_status){
		cleanlist = [];
		document.getElementById('homebutton').disabled = true;
		document.getElementById('scaleselection').disabled = true;
		document.getElementById('dateselection').disabled = true;
		document.getElementById('showtracks').disabled = true;
		document.getElementById('editrow').style.display = "";
	} else {
		document.getElementById('homebutton').disabled = false;
		document.getElementById('scaleselection').disabled = false;
		document.getElementById('dateselection').disabled = false;
		document.getElementById('showtracks').disabled = false;
		document.getElementById('editrow').style.display = "none";
	}
}

function commitFunction(){
	if(confirm("Are you sure to delete selected points?")){
	    var xmlHttp = new XMLHttpRequest();
	    xmlHttp.open( "DELETE", "/deletelocations", false );
	    xmlHttp.send( cleanlist );	    
	    if(JSON.parse(xmlHttp.responseText).message == 'OK'){
	    	cleanFunction();
	    	alert("Delete complete.");
	    }
	}
}

function rollbackFunction(){
	cleanlist = [];
	draw4images();
	if (document.getElementById('showtracks').checked)
		drawlines();
	cleanFunction();
}

function scaleSelection(){
	var myselect = document.getElementById("scaleselection");
	
	if(myselect.selectedIndex == 0){

		filescale = "8000";
		cordinate_move = 1800;
		kx += (900-cx) * jakaja;
		ky -= (900-cy) * jakaja;
				
		setCordinateTrac();
		cx=0;
		cy=0;
		kx -= 1800;
		ky += 1800;
				
//		console.log("kx="+kx+" ky="+ky);
	} else {
		kx = 368500;
		ky = 6689900;
		filescale = "80000";
		cordinate_move = 14400;
	}
	jakaja = cordinate_move / 900;
	writePosition((kx + (900-cx) * jakaja), (ky - (900-cy) * jakaja))
	
    loadmapfile();
    draw4images();
	if (document.getElementById('showtracks').checked)
		drawlines();
}

function setCordinateTrac(){
	for(var f=712300 ; f>188500 ; f-=cordinate_move){
		if(f < kx){
			kx = f;
			break;
		}
	}
	for(var f=6628700 ; f<6994100 ; f+=cordinate_move){
		if(f > ky){
			ky = f;
			break;
		}
	}
}

function goHome(){
	var myselect = document.getElementById("scaleselection");

	cx=0;
	cy=0;
	if(myselect.selectedIndex == 0){
		kx = 384700;
		ky = 6675500;
	} else {
		kx = 368500;
		ky = 6689900;
	}
	jakaja = cordinate_move / 900;
	writePosition((kx + 450 * jakaja), (ky - 450 * jakaja))
	
    loadmapfile();
    draw4images();
	if (document.getElementById('showtracks').checked)
		drawlines();
}

function showTracks(){
	if (document.getElementById('showtracks').checked){
		arr = JSON.parse(httpGet("/locations?lon="+kx+"&lat="+ky+"&size="+cordinate_move+"&dates="+date_selection));
		drawlines();
	}
}

function dateSelection(){
	var myselect = document.getElementById("dateselection");
	date_selection = myselect.options[myselect.selectedIndex].value;
	arr = JSON.parse(httpGet("/locations?lon="+kx+"&lat="+ky+"&size="+cordinate_move+"&dates="+date_selection));
	drawlines();
}

function writePosition(testx, testy){
	document.getElementById("testx").innerHTML = 'Y ' + testx;
	document.getElementById("testy").innerHTML = 'N ' + testy;
}
