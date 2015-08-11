HospitalCheckup.module("HomeApp", function(HomeApp, HospitalCheckup, Backbone, Marionette, $, _) {
  HomeApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "(/)(#)": "showHome",
      "": "showHome"
    }
  });

  var API = {
    showHome: function() {
      HomeApp.Controller.showHome();
      HospitalCheckup.execute("set:active:header", "");
    }
  };

  HospitalCheckup.on("home:show", function() {
    HospitalCheckup.navigate("");
    API.showHome();
  });

  HospitalCheckup.addInitializer(function() { //I don't know why on(start) doesn't work here like it does on the others but it doesn't
    new HomeApp.Router({
      controller: API
    });
  });
});
