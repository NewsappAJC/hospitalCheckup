//general ContactManager app code (defining regions, the start handler, etc.):
var HospitalCheckup = new Marionette.Application();

HospitalCheckup.navigate = function(route, options){
  options || (options = {});
  Backbone.history.navigate(route, options);
};

HospitalCheckup.getCurrentRoute = function(){
  return Backbone.history.fragment
};

HospitalCheckup.on("before:start", function(){
  var RegionContainer = Marionette.LayoutView.extend({
    el: "#app-container",

    regions: {
      header: "#header-region",
      main: "#main-region"
    }
  });

  HospitalCheckup.regions = new RegionContainer();
});

HospitalCheckup.on("start", function(){
  window.localStorage.clear(); //we want fresh data which we will persist during this session
  if(Backbone.history){
    Backbone.history.start();

    /*if(this.getCurrentRoute() === ""){
      HospitalCheckup.trigger("infections:list");
    }*/
  }
});
