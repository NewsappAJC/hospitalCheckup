HospitalCheckup.module("SectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.InfectionsController = {
    listInfections: function(id, criterion){
      var isMobile = document.body.clientWidth < 405,
      defaultMeasure = "cdiff";
      var loadingView = new HospitalCheckup.Common.Views.Loading();
      HospitalCheckup.regions.main.show(loadingView);

      var fetchingData = HospitalCheckup.request("chart:entities", "Infection", "infections");

      var listLayout = new List.Layout(),
      hospitalLayout = new HospitalCheckup.SectionsApp.Hospital.HospitalLayout(),
      headlineView = new List.TextBlock({text: HospitalCheckup.Entities.InfectionsIntroTxt["headline"]}),
      introView = new List.TextBlock({text: HospitalCheckup.Entities.InfectionsIntroTxt["intro_text"]}),
      menuView = new List.Menu({collection: HospitalCheckup.Entities.InfectionLabels, section: "infections"}),
      legendView = new List.Legend({label: "than national benchmark"}),
      bottomView = new List.TextBlock({text: HospitalCheckup.Entities.InfectionsIntroTxt["bottom_text"]}),
      hospitalInfoView = new HospitalCheckup.SectionsApp.Hospital.HospitalInfo(),
      hospitalLegendView = new HospitalCheckup.SectionsApp.Hospital.InfectionLegend(),
      hospitalMeasuresView = new HospitalCheckup.SectionsApp.Hospital.HospitalInfectionItemList({collection: new Backbone.Collection(), section: "infections", labelArr: "Infection"}),
      infectionsListView;

      $.when(fetchingData).done(function(infections){

        if(!isMobile){
          listView = new List.MainChart();
        } else {
          listView = new List.MobileList({collection: infections, measure: criterion || defaultMeasure });
          listView.listenTo(menuView, "infections:filter", listView.onFilter);
        }

        listLayout.on("show", function(){
          listLayout.headlineRegion.show(headlineView);
          listLayout.introRegion.show(introView);
          listLayout.menuRegion.show(menuView);
          listLayout.legendRegion.show(legendView);
          listLayout.listRegion.show(listView);
          listLayout.hospitalRegion.show(hospitalLayout);
          listLayout.bottomRegion.show(bottomView);
        });

        listView.on("hospital:change", function(id){ //triggered by behaviors
          HospitalCheckup.trigger("hospital:change", id, "infections", hospitalInfoView, hospitalMeasuresView);
        });

        //wait for #main-chart to be rendered
        listView.on("show", function(){
          if(!isMobile){
            List.chartView = new HospitalCheckup.Common.Chart.BarRangeDot({ //adding it to List module so we can target it later
              el: "#main-chart",
              collection: infections,
              base_height: 700,
              bar_padding: 4,
              margin: {left: 195, right: 10, bottom: 20, top: 25},
              measure: criterion || defaultMeasure,
              section: "infections",
              stat: "ratio"
            });
            List.chartView.render(); //for some reason this breaks filtering when chained with initialization above
          }
        });

        menuView.on("infections:filter", function(filterCriterion){
          HospitalCheckup.trigger("infections:filter", filterCriterion); //update routes
          Marionette.triggerMethodOn(HospitalCheckup.module("SectionsApp.List.chartView"), "update:chart", filterCriterion);
        });

        menuView.once("show", function(){ //TODO we only need to do this manually when user enters the page via a filter URL
          menuView.triggerMethod("set:filter:criterion", criterion);
        });

        hospitalLayout.on("show", function(){
          var defaultModel = infections.at(0);
          HospitalCheckup.trigger("hospital:show", id, hospitalInfoView, hospitalMeasuresView, defaultModel);
          hospitalLayout.topRegion.show(hospitalInfoView);
          hospitalLayout.legendRegion.show(hospitalLegendView);
          hospitalLayout.chartRegion.show(hospitalMeasuresView);
        });

        HospitalCheckup.regions.main.show(listLayout);
      });
    }
  }
});