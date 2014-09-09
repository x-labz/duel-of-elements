document.body.insertAdjacentHTML('beforeend','<div id="debug"></div>')
window.onerror = function (msg,url,line) {
	var e = document.querySelector("#debug") ;
	e.insertAdjacentHTML('beforeend',"<p>"+msg+"-"+url+"-"+line+"</p>") ;
}