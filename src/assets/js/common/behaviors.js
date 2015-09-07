HospitalCheckup.Behaviors = {
  HospitalSelect: Marionette.Behavior.extend({
    events: {
      "click .bar": "displayHospital",
      "click .range-bar": "displayHospital",
      "click .stat-circle": "displayHospital",
      "click .y.axis text": "displayHospital"
    },

    displayHospital: function(e){
      var data = d3.selectAll(e.currentTarget)[0].__data__;
      if(!data.id){ //clicks on hospital label text won't register ID, tried everything to attach it to DOM but failed
        data = HospitalCheckup.SectionsApp.List.chartView.collection.findWhere({ display_name: data }).get("id");
      } else {
        data = data.id;
      }
      this.view.trigger("hospital:change", data);
    }
  })
}

Marionette.Behaviors.behaviorsLookup = function(){
  return HospitalCheckup.Behaviors;
}