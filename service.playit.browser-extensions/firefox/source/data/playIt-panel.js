document.getElementById("save").onclick=function(){
    data = {
        'serviceAddress':document.getElementById('serviceAddress').value,
        'servicePort':document.getElementById('servicePort').value
    }
    console.error(data.serviceAddress)
    self.port.emit("save", data);
}
