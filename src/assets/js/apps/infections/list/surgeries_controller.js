HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.SurgeriesController = {
    listSurgeries: function(id, criterion){
      var isMobile = document.body.clientWidth < 405,
      defaultMeasure = "complication";
      var loadingView = new HospitalCheckup.Common.Views.Loading();
      HospitalCheckup.regions.main.show(loadingView);

      var fetchingData = HospitalCheckup.request("chart:entities", "Surgery", "surgery");

      var surgeriesListLayout = new List.Layout(),
      hospitalLayout = new HospitalCheckup.InfectionsApp.Show.HospitalLayout(),
      surgeriesHeadlineView = new List.TextBlock({text: HospitalCheckup.Entities.SurgeriesIntroTxt["headline"]}),
      surgeriesIntroView = new List.TextBlock({text: HospitalCheckup.Entities.SurgeriesIntroTxt["intro_text"]}),
      surgeriesMenuView = new List.Menu({collection: HospitalCheckup.Entities.SurgeriesLabels, section: "surgery"}),//TODO rename section
      surgeriesLegendView = new List.Legend(),
      hospitalShowView = new HospitalCheckup.InfectionsApp.Show.Hospital(),
      //hospitalChartsView = new HospitalCheckup.InfectionsApp.Show.HospitalInfectionItemList({collection: new Backbone.Collection(), section: "infections", labelArr: "Infection"}),
      surgeriesListView;

      $.when(fetchingData).done(function(surgeries){

        if(!isMobile){
          surgeriesListView = new List.MainChart();
        } else {
          surgeriesListView = new List.MobileList({collection: surgeries, measure: criterion || defaultMeasure });
          surgeriesListView.listenTo(surgeriesMenuView, "surgery:filter", surgeriesListView.onFilter);//TODO updating event naming
        }

        surgeriesListLayout.on("show", function(){
          surgeriesListLayout.headlineRegion.show(surgeriesHeadlineView);
          surgeriesListLayout.introRegion.show(surgeriesIntroView);
          surgeriesListLayout.menuRegion.show(surgeriesMenuView);
          surgeriesListLayout.legendRegion.show(surgeriesLegendView);
          surgeriesListLayout.listRegion.show(surgeriesListView);
          surgeriesListLayout.hospitalRegion.show(hospitalLayout);
        });

        // surgeriesListView.on("hospital:change", function(id){ //triggered by behaviors
        //   HospitalCheckup.trigger("hospital:change", id, hospitalShowView, hospitalChartsView);
        // });

        //wait for #main-chart to be rendered
        surgeriesListView.on("show", function(){
          if(!isMobile){
            List.surgeriesChartView = new HospitalCheckup.Common.Chart.BarRangeDot({ //adding it to List module so we can target it later
              el: "#main-chart",
              collection: surgeries,
              base_height: 700,
              bar_padding: 4,
              margin: {left: 195, right: 10, bottom: 20, top: 25},
              measure: criterion || defaultMeasure,
              section: "surgery",
              stat: "rate"
            });
            List.surgeriesChartView.render(); //for some reason this breaks filtering when chained with initialization above
          }
        });

        surgeriesMenuView.on("surgery:filter", function(filterCriterion){//TODO update mobile trigger
          HospitalCheckup.trigger("surgery:filter", filterCriterion); //update routes
          Marionette.triggerMethodOn(HospitalCheckup.module("InfectionsApp.List.surgeriesChartView"), "update:chart", filterCriterion);
        });

        surgeriesMenuView.once("show", function(){ //TODO we only need to do this manually when user enters the page via a filter URL
          surgeriesMenuView.triggerMethod("set:filter:criterion", criterion);
        });

        // hospitalLayout.on("show", function(){
        //   var defaultModel = surgeries.at(0);
        //   HospitalCheckup.trigger("hospital:show", id, hospitalShowView, hospitalChartsView, defaultModel);
        //   hospitalLayout.topRegion.show(hospitalShowView);
        //   hospitalLayout.legendRegion.show(hospitalLegendView);
        //   hospitalLayout.chartRegion.show(hospitalChartsView);
        // });

        HospitalCheckup.regions.main.show(surgeriesListLayout);
      });
    }
  }
});