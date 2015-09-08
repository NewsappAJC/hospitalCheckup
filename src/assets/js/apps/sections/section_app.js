HospitalCheckup.module("SectionsApp", function(SectionsApp, HospitalCheckup, Backbone, Marionette, $, _){
  SectionsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      //"infections(/)": "listInfections",
      "infections(/:id)(/filter/:criterion)": "listInfections", //hospital selection IDs and dropdown infections filters
      "surgery(/:id)(/filter/:criterion)": "listSurgeries",
      "perinatal(/:id)(/filter/:criterion)": "listPerinatal"
    }
  });

  var API = {
    listInfections: function(id, criterion){
      SectionsApp.Section.Controller.listInfections(id, criterion);
      HospitalCheckup.execute("set:active:header", "infections"); //update navigation toolbar
    },

    listSurgeries: function(id, criterion){
      SectionsApp.Section.Controller.listSurgeries(id, criterion);
      HospitalCheckup.execute("set:active:header", "surgery"); //update navigation toolbar
    },

    listPerinatal: function(id, criterion){
      SectionsApp.Section.Controller.listPerinatal(id, criterion);
      HospitalCheckup.execute("set:active:header", "perinatal"); //update navigation toolbar
    },

    showHospital: function(id, aboutView, chartsView, defaultModel){  //received URL with ID parameter
      SectionsApp.Hospital.Controller.showHospital(id, aboutView, chartsView, defaultModel);
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

  HospitalCheckup.on("perinatal:list", function(){ //list infections, triggered from nav or click on viz
    HospitalCheckup.navigate("perinatal");
    API.listPerinatal();
  });

  HospitalCheckup.on("hospital:show", function(id, aboutView, chartsView, defaultModel){ //received URL with ID parameter
    API.showHospital(id, aboutView, chartsView, defaultModel);
  });

  HospitalCheckup.on("hospital:change", function(id, app, aboutView, chartsView){ //hospital selected from infection list
    HospitalCheckup.navigate(app+"/" + id);
    API.showHospital(id, aboutView, chartsView);
  });

  HospitalCheckup.on("infections:filter", function(criterion){ //filter menu changed
    HospitalCheckup.navigate("infections/filter/" + criterion);
  });

  HospitalCheckup.on("surgery:filter", function(criterion){ //filter menu changed
    HospitalCheckup.navigate("surgery/filter/" + criterion);
  });

  HospitalCheckup.on("perinatal:filter", function(criterion){ //filter menu changed
    HospitalCheckup.navigate("perinatal/filter/" + criterion);
  });

  SectionsApp.on("start", function(){
    new SectionsApp.Router({
      controller: API
    });
  });
});
