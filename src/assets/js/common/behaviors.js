HospitalCheckup.Behaviors = {
  HospitalSelect: Marionette.Behavior.extend({
    events: {
      "click .bar": "displayHospital"
    },

    displayHospital: function(e){
      this.view.trigger("hospital:change", d3.selectAll(e.currentTarget)[0].__data__.id );
    }
  })
}

Marionette.Behaviors.behaviorsLookup = function(){
  return HospitalCheckup.Behaviors;
}