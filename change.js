// https://alistapart.com/article/alternate/
  function setActiveStyleSheet(title) {
     var i, a;
     for(i = 0; (a = document.getElementsByTagName("link")[i]); i++) {
      console.log("HELLO" + a);
       if (a.getAttribute("rel").indexOf("style") != -1
          && a.getAttribute("title")) {
         a.disabled = true;
         if (a.getAttribute("title") == title) a.disabled = false;
       }
     }
  }
/*
// http://www.codelifter.com/main/javascript/changestyles.html
var doAlerts=true;
function changeStyleSheet(whichSheet){
  whichSheet=whichSheet-1;
  if(document.styleSheets){
    var c = document.styleSheets.length;
    if (doAlerts) alert('Change to Style '+(whichSheet+1));
    for(var i=0;i<c;i++){
      if(i!=whichSheet){
        document.styleSheets[i].disabled=true;
      }else{
        document.styleSheets[i].disabled=false;
      }
    }
  }
}
*/
