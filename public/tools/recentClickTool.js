//recentClick is used to resolve UI bugs whilst polling where the UI changes before the result of the poll comes back.
let recentClick = false
  
recentClickChecker = function(){
  let returnVal
  recentClick = true ? returnVal = true : returnVal = false;
  return returnVal
}

applyRecentClick = function(){
  recentClick = true
  return recentClick
}
recentClickTimeout = function(){
  setTimeout(()=>{
      recentClick = false
      return recentClick
  }, 1000)
  return recentClick
}