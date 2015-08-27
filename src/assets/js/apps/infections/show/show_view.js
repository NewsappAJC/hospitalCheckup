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
    template: "#hospital-view"
  });

  Show.HospitalChart = Marionette.ItemView.extend({
    template: "#hospital-chart-template",
    onShow: function(){
      var detail = new HospitalCheckup.Common.Chart.HospitalDetail({
        el: "#"+this.model.get("measure")+"-chart",
        data: this.model.toJSON(),
        margin: {left: 15, right: 15, bottom: 25, top: 20},
        base_height: 60
      }).render();
    }
  });

  Show.HospitalChartList = Marionette.CollectionView.extend({
    template: "#hospital-chart-holder",
    childView: Show.HospitalChart,
    get_hospital_models: function(data){
      var dataArr = [];

      //we need unnamed, top-level objects for the collection
      _.each(data.get("infections"), function(values, key, collection){
        values.measure = key; //TODO need the full name
        dataArr.push(values);
      });
      return dataArr;
    }
  });
});