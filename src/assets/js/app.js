var HospitalCheckup = new Marionette.Application();

HospitalCheckup.on("before:start", function(){
  var RegionContainer = Marionette.LayoutView.extend({
    el: "#app-container",

    regions: {
      main: "#main-region"
    }
  });

  HospitalCheckup.regions = new RegionContainer();
});

HospitalCheckup.on("start", function(){
  if(Backbone.history){
    Backbone.history.start();

    if(Backbone.history.fragment === ""){
      Backbone.history.navigate("infections");
      HospitalCheckup.InfectionsApp.List.Controller.listInfections();
    }
  }
});
