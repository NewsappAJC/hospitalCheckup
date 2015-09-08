HospitalCheckup.module("SectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.SurgeriesController = {
    listSurgeries: function(id, criterion){
      var isMobile = document.body.clientWidth < 405,
      defaultMeasure = "complication";
      var loadingView = new HospitalCheckup.Common.Views.Loading();
      HospitalCheckup.regions.main.show(loadingView);

      var fetchingData = HospitalCheckup.request("chart:entities", "Surgery", "surgery");

      var listLayout = new List.Layout(),
      hospitalLayout = new HospitalCheckup.SectionsApp.Hospital.HospitalLayout(),
      headlineView = new List.TextBlock({text: HospitalCheckup.Entities.SurgeriesIntroTxt["headline"]}),
      introView = new List.TextBlock({text: HospitalCheckup.Entities.SurgeriesIntroTxt["intro_text"]}),
      menuView = new List.Menu({collection: HospitalCheckup.Entities.SurgeriesLabels, section: "surgery"}),
      legendView = new List.Legend({label: "than national rate"}),
      hospitalInfoView = new HospitalCheckup.SectionsApp.Hospital.HospitalInfo(),
      hospitalMeasuresView = new HospitalCheckup.SectionsApp.Hospital.HospitalSurgeryDetails({collection: new Backbone.Collection()}),
      listView;

      $.when(fetchingData).done(function(surgeries){

        if(!isMobile){
          listView = new List.MainChart();
        } else {
          listView = new List.MobileList({collection: surgeries, measure: criterion || defaultMeasure, section: "surgery", stat: "rate" });
          listView.listenTo(menuView, "surgery:filter", listView.onFilter);
        }

        listLayout.on("show", function(){
          listLayout.headlineRegion.show(headlineView);
          listLayout.introRegion.show(introView);
          listLayout.menuRegion.show(menuView);
          listLayout.legendRegion.show(legendView);
          listLayout.listRegion.show(listView);
          listLayout.hospitalRegion.show(hospitalLayout);
        });

        listView.on("hospital:change", function(id){ //triggered by behaviors
          HospitalCheckup.trigger("hospital:change", id, "surgery", hospitalInfoView, hospitalMeasuresView);
        });

        //wait for #main-chart to be rendered
        listView.on("show", function(){
          if(!isMobile){
            List.chartView = new HospitalCheckup.Common.Chart.BarRangeDot({ //adding it to List module so we can target it later
              el: "#main-chart",
              collection: surgeries,
              base_height: 700,
              bar_padding: 4,
              margin: {left: 195, right: 10, bottom: 20, top: 25},
              measure: criterion || defaultMeasure,
              section: "surgery",
              stat: "rate"
            });
            List.chartView.render(); //for some reason this breaks filtering when chained with initialization above
          }
        });

        menuView.on("surgery:filter", function(filterCriterion){
          HospitalCheckup.trigger("surgery:filter", filterCriterion); //update routes
          Marionette.triggerMethodOn(HospitalCheckup.module("SectionsApp.List.chartView"), "update:chart", filterCriterion);
        });

        menuView.once("show", function(){ //TODO we only need to do this manually when user enters the page via a filter URL
          menuView.triggerMethod("set:filter:criterion", criterion);
        });

        hospitalLayout.on("show", function(){
          var defaultModel = surgeries.at(0);
          HospitalCheckup.trigger("hospital:show", id, hospitalInfoView, hospitalMeasuresView, defaultModel);
          hospitalLayout.topRegion.show(hospitalInfoView);
          hospitalLayout.chartRegion.show(hospitalMeasuresView);
        });

        HospitalCheckup.regions.main.show(listLayout);
      });
    }
  }
});