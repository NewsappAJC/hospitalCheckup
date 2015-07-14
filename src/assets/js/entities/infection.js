HospitalCheckup.module("Entities", function(Entities, HospitalCheckup, Backbone, Marionette, $, _){

  Entities.Infection = Backbone.Model.extend({
    defaults: {
      display_name: "No display name found!"
    }
  });

  Entities.InfectionCollection = Backbone.Collection.extend({
    model: Entities.Infection,
    comparator: "display_name"
  });

});