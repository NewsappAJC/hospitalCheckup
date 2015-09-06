HospitalCheckup.module("InfectionsApp", function(InfectionsApp, HospitalCheckup, Backbone, Marionette, $, _){
  InfectionsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      //"infections(/)": "listInfections",
      "infections(/:id)(/filter/:criterion)": "listInfections", //hospital selection IDs and dropdown infections filters
      "surgery(/:id)(/filter/:criterion)": "listSurgeries"
    }
  });

  var API = {
    listInfections: function(id, criterion){
      InfectionsApp.List.InfectionsController.listInfections(id, criterion);
      HospitalCheckup.execute("set:active:header", "infections"); //update navigation toolbar
    },

    listSurgeries: function(id, criterion){
      InfectionsApp.List.SurgeriesController.listSurgeries(id, criterion);
      HospitalCheckup.execute("set:active:header", "surgery"); //update navigation toolbar
    },

    showHospital: function(id, aboutView, chartsView, defaultModel){  //received URL with ID parameter
      InfectionsApp.Show.Controller.showHospital(id, aboutView, chartsView, defaultModel);
    }
  };

  HospitalCheckup.on("infections:list", function(){ //list infections, triggered from nav or click on viz
    HospitalCheckup.navigate("infections");
    API.listInfections();
  });

  HospitalCheckup.on("surgeries:list", function(){ //list infections, triggered from nav or click on viz
    HospitalCheckup.navigate("surgery");
    API.listSurgeries();
  });

  HospitalCheckup.on("hospital:show", function(id, aboutView, chartsView, defaultModel){ //received URL with ID parameter
    API.showHospital(id, aboutView, chartsView, defaultModel);
  });

  HospitalCheckup.on("hospital:change", function(id, aboutView, chartsView){ //hospital selected from infection list
    HospitalCheckup.navigate("infections/" + id);
    API.showHospital(id, aboutView, chartsView);
  });

  HospitalCheckup.on("infections:filter", function(criterion){ //filter menu changed
    HospitalCheckup.navigate("infections/filter/" + criterion);
  });

  HospitalCheckup.on("surgery:filter", function(criterion){ //filter menu changed
    HospitalCheckup.navigate("surgery/filter/" + criterion);
  });

  InfectionsApp.on("start", function(){
    new InfectionsApp.Router({
      controller: API
    });
  });
});
