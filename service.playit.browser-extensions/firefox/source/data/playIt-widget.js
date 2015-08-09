window.addEventListener('click', function(event) {
  if(event.button == 0 && event.shiftKey == false){
    self.port.emit('playIt');
  }else if(event.button == 2 || (event.button == 0 && event.shiftKey == true)){
    self.port.emit('open-settings');
  }
  //event.preventDefault();
});