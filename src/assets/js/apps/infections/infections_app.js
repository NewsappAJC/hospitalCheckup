HospitalCheckup.module("InfectionsApp", function(InfectionsApp, HospitalCheckup, Backbone, Marionette, $, _){
  InfectionsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      //"infections(/)": "listInfections",
      "infections(/:id)(/filter/:criterion)": "listInfections" //hospital selection IDs and dropdown infections filters
    }
  });

  var API = {
    listInfections: function(id, criterion){
      InfectionsApp.List.Controller.listInfections(id, criterion);
      HospitalCheckup.execute("set:active:header", "infections"); //update navigation toolbar
    },

    showHospital: function(id, view){  //received URL with ID parameter
      InfectionsApp.Show.Controller.showHospital(id, view);
    }
  };

  HospitalCheckup.on("infections:list", function(){ //list infections, triggered from nav or click on viz
    HospitalCheckup.navigate("infections");
    API.listInfections();
  });

  HospitalCheckup.on("hospital:show", function(id, view){ //received URL with ID parameter
    API.showHospital(id, view);
  });

  HospitalCheckup.on("hospital:change", function(id, view){ //hospital selected from infection list
    HospitalCheckup.navigate("infections/" + id);
    API.showHospital(id, view);
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
