HospitalCheckup.module("InfectionsApp", function(InfectionsApp, HospitalCheckup, Backbone, Marionette, $, _){
  InfectionsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "infections": "listInfections",
      "infections/:id": "showInfection"
    }
  });

  var API = {
    listInfections: function(){
      InfectionsApp.List.Controller.listInfections();
    },

    showInfection: function(id){
      InfectionsApp.Show.Controller.showInfection(id);
    }
  };

  HospitalCheckup.on("infections:list", function(){ //list infections
    HospitalCheckup.navigate("infections");
    API.listInfections();
  });

  HospitalCheckup.on("infection:show", function(id){ //hospital selected from infection list, show hospital detail page
    HospitalCheckup.navigate("infections/" + id);
    API.showInfection(id);
  });

  InfectionsApp.on("start", function(){
    new InfectionsApp.Router({
      controller: API
    });
  });
});
