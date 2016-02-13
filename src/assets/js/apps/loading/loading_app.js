HospitalCheckup.module("LoadingApp", function(LoadingApp, HospitalCheckup, Backbone, Marionette, $, _){
  var API = {
    createSpinner: function() {
      LoadingApp.Controller.createSpinner();
    },
    showSpinner: function() {
      LoadingApp.Controller.showSpinner();
    },
    hideSpinner: function() {
      LoadingApp.Controller.hideSpinner();
    }
  };

  LoadingApp.on("start", function() {
    API.createSpinner();
  });

  HospitalCheckup.vent.on("loading:show", function() {
    API.showSpinner();
  });

  HospitalCheckup.vent.on("loading:hide", function() {
    API.hideSpinner();
  });
});