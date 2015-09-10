HospitalCheckup.module("HomeApp", function(HomeApp, HospitalCheckup, Backbone, Marionette, $, _) {
  HomeApp.Controller = {
    showHome: function() {
      var homeView = new HomeApp.Home.HomeView(),
      iconBar = new HomeApp.Home.IconCollectionView();

      homeView.on("show", function(){
        var icons = new HomeApp.Home.IconCollectionView({collection: HospitalCheckup.Entities.headers}).render();
      });

      HospitalCheckup.regions.main.show(homeView);

      // if home page is too short for height of browser window, make footer the length of the rest of the window
      var windowHeight = $(window).height(),
      $footer = $('#homepage-bottom');
      var gap = windowHeight - $footer.position().top - parseInt($footer.css("borderTopWidth"));

      if (gap > $footer.height()){
      	$footer.height(gap);
      }
    }
  };
});
