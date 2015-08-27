HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){

  Show.MissingHospital = Marionette.ItemView.extend({
    template: "#missing-hospital-view"
  });

  Show.HospitalLayout = Marionette.LayoutView.extend({
    template: "#hospital-layout",
    className: "large-12 columns",
    regions: {
      topRegion: "#hospital-top-region",
      chartRegion: "#hospital-chart-region"
    }
  });

  Show.Hospital = Marionette.ItemView.extend({
    template: "#hospital-info-view",
    className: "hospital-info"
  });

  Show.HospitalChart = Marionette.ItemView.extend({
    template: "#hospital-chart-template",
    className: "hospital-list-item",
    onShow: function(){
      if(!this.model.get("na")){
        var detail = new HospitalCheckup.Common.Chart.HospitalDetail({
          el: "#"+this.model.get("measure")+"-chart",
          data: this.model.toJSON(),
          margin: {left: 15, right: 15, bottom: 25, top: 30},
          base_height: 70
        }).render();
      }
    }
  });

  Show.HospitalChartList = Marionette.CollectionView.extend({
    template: "#hospital-chart-holder",
    className: "hospital-list",
    childView: Show.HospitalChart,
    get_hospital_models: function(data){
      var dataArr = [];

      //we need unnamed, top-level objects for the collection
      _.each(data.get("infections"), function(values, key, collection){ //TODO do this on the model instead
        values.label = HospitalCheckup.Entities.InfectionLabels.findWhere({ key: key }).get("label"); //look up the display name for the current infection
        values.measure = key; //TODO need the full name
        dataArr.push(values);
      });
      return dataArr;
    }
  });
});