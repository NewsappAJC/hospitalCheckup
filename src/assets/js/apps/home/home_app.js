HospitalCheckup.module("HomeApp", function(HomeApp, HospitalCheckup, Backbone, Marionette, $, _) {
  HomeApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "": "showHome",
      "home": "showHome"
    }
  });

  var API = {
    showHome: function() {
      HomeApp.Controller.showHome();
    }
  };

  HospitalCheckup.on("homeapp:home", function() {
    HospitalCheckup.navigate("/");
    API.showHome();
  });

  HospitalCheckup.addInitializer(function() {
    new HomeApp.Router({
      controller: API
    });
  });
});
