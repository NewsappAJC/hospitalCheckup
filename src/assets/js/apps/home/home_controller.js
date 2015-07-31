HospitalCheckup.module("HomeApp", function(HomeApp, HospitalCheckup, Backbone, Marionette, $, _) {
  HomeApp.Controller = {
    showHome: function() {
      var homeView = new HomeApp.Home.HomeView();
      HospitalCheckup.regions.main.show(homeView);
    }
  };
});
