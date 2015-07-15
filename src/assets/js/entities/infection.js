HospitalCheckup.module("Entities", function(Entities, HospitalCheckup, Backbone, Marionette, $, _){

  Entities.Infection = Backbone.Model.extend({
    defaults: {
      display_name: "No display name found!"
    }
  });

  Entities.InfectionCollection = Backbone.Collection.extend({
    url: "/src/assets/data/infections.json",
    initialize: function(){
      this.model= Entities.Infection;
      this.comparator= "display_name" //sort by
    }
  });

  var infections;
  var API = {
    getInfectionEntities: function(){
      //TODO make sure the data loads over the network, John used `defer`
      if(infections === undefined){
        infections = new Entities.InfectionCollection();
        infections.fetch({
          success: function(data){
            return data
          }
        });
      }
      return infections;
    }
  }

  HospitalCheckup.reqres.setHandler("infection:entities", function(){
    return API.getInfectionEntities();
  });

});