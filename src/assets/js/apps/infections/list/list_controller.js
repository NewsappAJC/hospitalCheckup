HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Controller = {
    listInfections: function(id, criterion){
      var loadingView = new HospitalCheckup.Common.Views.Loading();
      HospitalCheckup.regions.main.show(loadingView);

      var fetchingInfections = HospitalCheckup.request("infection:entities");

      var infectionsListLayout = new List.Layout();
      var infectionsMenuView = new List.Menu();

      $.when(fetchingInfections).done(function(infections){
        var filteredInfections = HospitalCheckup.Entities.FilteredCollection({
          collection: infections,
          filterFunction: function(criterion){
            return function(infection){
              infection.set({measure:criterion || "cdiff"}); //TODO better way to set default before menu renders?
              infection.save();
              return infection;
            }
          }
        });

        List.infectionsListView = new List.InfectionsChart(); //we will target this from chart later

        var hospitalShowView = new HospitalCheckup.InfectionsApp.Show.Hospital();

        infectionsListLayout.on("show", function(){
          infectionsListLayout.menuRegion.show(infectionsMenuView);
          infectionsListLayout.listRegion.show(List.infectionsListView);
          infectionsListLayout.hospitalRegion.show(hospitalShowView);
        });

        List.infectionsListView.on("hospital:change", function(id){
          HospitalCheckup.trigger("hospital:change", id, hospitalShowView);
        });

        //wait for #infections-chart to be rendered
        List.infectionsListView.on("show", function(){
          var infectionsChartView = new HospitalCheckup.Common.Chart.BarBase({
            el: "#infections-chart",
            collection: filteredInfections.filter(criterion),
            base_height: 750,
            bar_padding: 4,
            margin: {left: 190, right: 70, bottom: 20, top: 25}
          });
          infectionsChartView.render();

          if(id){ //if we were passed a hospital ID through the URL (i.e. bookmark)
            HospitalCheckup.trigger("hospital:show", id, hospitalShowView);
          } else { //use the first model in the list as a default
            hospitalShowView.model = filteredInfections.models[0];
            //hospitalShowView.render();
          }
        });

        infectionsMenuView.on("infections:filter", function(filterCriterion){
          HospitalCheckup.trigger("infections:filter", filterCriterion); //update routes
          filteredInfections.filter(filterCriterion); //update collection
        });

        infectionsMenuView.once("show", function(){ //TODO we only need to do this manually when user enters the page via a filter URL
          infectionsMenuView.triggerMethod("set:filter:criterion", criterion);
        });

        HospitalCheckup.regions.main.show(infectionsListLayout);
      });
    }
  }
});