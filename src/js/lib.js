export const validURL =  (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  };
  
  export const makeValidURL = (str) => {
    // add protocol
    if(str.substring(0,4)!=='http') {
      str ="https://"+str;
    }
    return str;
  }

  export const fillMissingFieldValues = (arr, dates, ) => {
    let keyValuePair = {};
    const newArry=[];
    if(Array.isArray(arr)) {
      arr.forEach(arr=>{
        keyValuePair[arr.x] = arr.y;
      });
    }
  
    dates.reverse().forEach(date => {
      if(!keyValuePair.hasOwnProperty(date)) {
        newArry.push({x: date, y:0});
      } else {
        newArry.push({
          x: date,
          y: keyValuePair[date],
        });
      }
  });
  
  return newArry;
  }
  
  export const getDaysBetweenDates = function(startDate, endDate) {
    var now = startDate.clone(), dates = [];
    while (now.isBefore(endDate) || now.format('YYYY-MM-DD')=== endDate.format('YYYY-MM-DD')) {
        dates.push(now.format('YYYY-MM-DD'));
        now.add(1, 'days');
    }
    return dates;
  };