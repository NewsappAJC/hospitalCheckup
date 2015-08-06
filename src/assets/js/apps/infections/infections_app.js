HospitalCheckup.module("InfectionsApp", function(InfectionsApp, HospitalCheckup, Backbone, Marionette, $, _){
  InfectionsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "infections/:id": "showInfection",
      "infections(/filter/:criterion)": "listInfections" //dropdown infections filters
    }
  });

  var API = {
    listInfections: function(criterion){
      InfectionsApp.List.Controller.listInfections(criterion);
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

  HospitalCheckup.on("infections:filter", function(criterion){ //filter menu changed
    HospitalCheckup.navigate("infections/filter/" + criterion);
    API.listInfections(criterion);
  });

  InfectionsApp.on("start", function(){
    new InfectionsApp.Router({
      controller: API
    });
  });
});
