HospitalCheckup.module("SectionsApp.Section", function(Section, HospitalCheckup, Backbone, Marionette, $, _){

  Section.Controller = {

    listInfections: function(id, criterion){
      this.buildLayout(id, criterion, "cdiff", "Infection", "infections", "BarRangeDot", "false", "than national benchmark", "SIR", "ratio");
    },

    listSurgeries: function(id, criterion){
      this.buildLayout(id, criterion, "complications", "Surgery", "surgery", "BarRangeDot", "false", "than national average", "Rate", "rate");
    },

    listPerinatal: function(id, criterion){
      this.buildLayout(id, criterion, "csect_pct", "Perinatal", "perinatal", "BarLeft");
    },

    listER: function(id, criterion){
      this.buildLayout(id, criterion, "er_time_to_eval", "ER", "er", "BarLeft", "true");
    },

    buildLayout: function(id, criterion, defaultMeasure, entityID, sectionID, chartType, customSort, legendLabel, dotLabel, stat){
      HospitalCheckup.vent.trigger("loading:show");
      var isMobile = document.body.clientWidth < 405;

      var fetchingData = HospitalCheckup.request("chart:entities", entityID, sectionID);

      var listLayout = new Section.Layout(),
      hospitalLayout = new HospitalCheckup.SectionsApp.Hospital.Layout(),
      headlineView = new Section.TextBlock({text: HospitalCheckup.Entities[entityID+"IntroTxt"]["headline"]}),
      introView = new Section.TextBlock({text: HospitalCheckup.Entities[entityID+"IntroTxt"]["intro_text"], entityID: entityID}),
      menuView = new Section.Menu({collection: HospitalCheckup.Entities[entityID+"Labels"], section: sectionID}),
      bottomView = new Section.TextBlock({text: HospitalCheckup.Entities[entityID+"IntroTxt"]["bottom_text"]}),
      hospitalInfoView = new HospitalCheckup.SectionsApp.Hospital.Info(),
      hospitalMeasuresView = new HospitalCheckup.SectionsApp.Hospital[entityID](),
      listView;

      if (sectionID === "er"){
        introView.on("show", function(){$(document).foundation('equalizer', 'reflow')});
      } else if (sectionID !== "perinatal"){ //also excluding er section on purpose
        var legendView = new Section.Legend({label: legendLabel, dot: dotLabel});
        hospitalMeasuresView.collection = new Backbone.Collection();
        if(sectionID === "infections"){ //TODO tie this into the infection measures view instead somehow?
          var hospitalLegendView = new HospitalCheckup.SectionsApp.Hospital.InfectionLegend();
        }
      }

      $.when(fetchingData).done(function(collection){

        if(!isMobile){
          listView = new Section.MainChart();
        } else {
          if(chartType === "BarRangeDot"){
            listView = new Section.MobileRangeDotList({collection: collection, measure: criterion || defaultMeasure, section: sectionID, stat: stat });
          } else {
            listView = new Section.MobileBarList({collection: collection, measure: criterion || defaultMeasure, entityID: entityID });
          }
          
          listView.listenTo(menuView, sectionID+":filter", listView.onFilter);
        }

        listLayout.on("show", function(){
          listLayout.headlineRegion.show(headlineView);
          listLayout.introRegion.show(introView);
          listLayout.menuRegion.show(menuView);
          if(legendView){
            listLayout.legendRegion.show(legendView);
          }
          listLayout.listRegion.show(listView);
          listLayout.hospitalRegion.show(hospitalLayout);
          listLayout.bottomRegion.show(bottomView); //currently only infections has bottomView, the others are empty string placeholders
        });

        listView.on("hospital:change", function(id){ //triggered by behaviors
          HospitalCheckup.trigger("hospital:change", id, sectionID, hospitalInfoView, hospitalMeasuresView);
        });

        //wait for #main-chart to be rendered
        listView.on("show", function(){
          if(!isMobile){
            Section.chartView = new HospitalCheckup.Common.Chart[chartType]({ //adding it to Section module so we can target it later
              el: "#main-chart",
              collection: collection,
              base_height: 745,
              bar_padding: 4,
              margin: {left: 195, right: 15, bottom: 20, top: 25}, //right padding needed to protect chart labels that extend past axis
              measure: criterion || defaultMeasure,
              section: sectionID,
              entityID: entityID,
              stat: stat,
              chartType: chartType,
              customSort: customSort
            });
            Section.chartView.render(); //for some reason this breaks filtering when chained with initialization above
          }
        });

        menuView.on(sectionID+":filter", function(filterCriterion){
          HospitalCheckup.trigger(sectionID+":filter", filterCriterion); //update routes
          Marionette.triggerMethodOn(HospitalCheckup.module("SectionsApp.Section.chartView"), "update:chart", filterCriterion);
        });

        menuView.once("show", function(){ //if filtering via URL, updated the select menu to reflect filter state
          menuView.triggerMethod("set:filter:criterion", criterion);
        });

        hospitalLayout.on("show", function(){
          var defaultModel = collection.at(0);
          HospitalCheckup.trigger("hospital:show", id, hospitalInfoView, hospitalMeasuresView, defaultModel);
          hospitalLayout.topRegion.show(hospitalInfoView);
          if(sectionID === "infections"){
            hospitalLayout.legendRegion.show(hospitalLegendView);
          }
          hospitalLayout.measuresRegion.show(hospitalMeasuresView);
        });

        HospitalCheckup.regions.main.show(listLayout);
        HospitalCheckup.vent.trigger("loading:hide");
      });
    }
  }
});