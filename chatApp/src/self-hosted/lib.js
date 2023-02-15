export function getCookie(name) {
    var nameEQ = name + "=";
    //alert(document.cookie);
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(nameEQ) != -1) return c.substring(nameEQ.length,c.length);
    }
    return null;
    } 
  
export function createCookie(name, value, days) {
      var date, expires;
      if (days) {
          date = new Date();
          date.setDate(date.getDate()+days);
          expires = "; expires="+date.toUTCString();
      } else {
          expires = "";
      }
      document.cookie = name+"="+value+expires+"; path=/";
  }

  export const isMobile = (mobileBreakpoint = 600) => {
        const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if (w < mobileBreakpoint) {
            return true;
        }
    return false;
};