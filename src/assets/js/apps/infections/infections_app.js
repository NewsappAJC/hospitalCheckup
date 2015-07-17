HospitalCheckup.module("InfectionsApp", function(InfectionsApp, HospitalCheckup, Backbone, Marionette, $, _){
  InfectionsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "infections": "listInfections"
    }
  });

  var API = {
    listInfections: function(){
      InfectionsApp.List.Controller.listInfections();
    }
  };

  
  InfectionsApp.on("start", function(){
    new InfectionsApp.Router({
      controller: API
    });
  });
});
