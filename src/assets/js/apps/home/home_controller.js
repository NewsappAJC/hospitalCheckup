HospitalCheckup.module("HomeApp", function(HomeApp, HospitalCheckup, Backbone, Marionette, $, _) {
  HomeApp.Controller = {
    showHome: function() {
      var homeView = new HomeApp.Home.HomeView();

      homeView.on("show", function(){
        new HomeApp.Home.IconCollectionView({collection: HospitalCheckup.Entities.headers}).render();
        homeView.fix_gap();
      });

      HospitalCheckup.regions.main.show(homeView);
    }
  };
});
