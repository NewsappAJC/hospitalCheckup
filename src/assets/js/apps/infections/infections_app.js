HospitalCheckup.module("InfectionsApp", function(InfectionsApp, HospitalCheckup, Backbone, Marionette, $, _){
  InfectionsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "infections(/)": "listInfections",
      "infections/:id(/)": "showInfection",
      "infections(/filter/:criterion)": "listInfections" //dropdown infections filters
    }
  });

  var API = {
    listInfections: function(criterion){
      InfectionsApp.List.Controller.listInfections(criterion);
      HospitalCheckup.execute("set:active:header", "infections");
    },

    showInfection: function(id){
      InfectionsApp.Show.Controller.showInfection(id);
      HospitalCheckup.execute("set:active:header", "infections");
    }
  };

  HospitalCheckup.on("infections:list", function(){ //list infections, triggered from nav
    HospitalCheckup.navigate("infections");
    API.listInfections();
  });

  HospitalCheckup.on("infection:show", function(id){ //hospital selected from infection list, show hospital detail page
    HospitalCheckup.navigate("infections/" + id);
    API.showInfection(id);
  });

  HospitalCheckup.on("infections:filter", function(criterion){ //filter menu changed
    HospitalCheckup.navigate("infections/filter/" + criterion);
  });

  InfectionsApp.on("start", function(){
    new InfectionsApp.Router({
      controller: API
    });
  });
});
