HospitalCheckup.module("HeaderApp", function(Header, HospitalCheckup, Backbone, Marionette, $, _){
  var API = {
    listHeader: function(){
      Header.List.Controller.listHeader();
    }
  };

  HospitalCheckup.commands.setHandler("set:active:header", function(name){
    HospitalCheckup.HeaderApp.List.Controller.setActiveHeader(name);
  });

  Header.on("start", function(){
    API.listHeader();
  });
});