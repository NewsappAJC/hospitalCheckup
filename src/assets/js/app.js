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
