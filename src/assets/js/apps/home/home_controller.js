HospitalCheckup.module("HomeApp", function(HomeApp, HospitalCheckup, Backbone, Marionette, $, _) {
  HomeApp.Controller = {
    showHome: function() {
      var homeView = new HomeApp.Home.HomeView(),
      iconBar = new HomeApp.Home.IconCollectionView();

      homeView.on("show", function(){
        var icons = new HomeApp.Home.IconCollectionView({collection: HospitalCheckup.Entities.headers}).render();
        homeView.fix_gap();
      });

      HospitalCheckup.regions.main.show(homeView);
    }
  };
});
