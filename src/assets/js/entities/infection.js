HospitalCheckup.module("Entities", function(Entities, HospitalCheckup, Backbone, Marionette, $, _){

  Entities.Infection = Backbone.Model.extend({
    defaults: {
      display_name: "No display name found!"
    },
    urlRoot: "infections"
  });

  Entities.configureStorage("HospitalCheckup.Entities.Infection");

  Entities.InfectionCollection = Backbone.Collection.extend({
    url: "infections", //we could use our .json file but then we wouldn't be able to use the url for local storage
    initialize: function(){
      this.model= Entities.Infection;
      this.comparator= "display_name"; //sort by
    }
  });

  Entities.configureStorage("HospitalCheckup.Entities.InfectionCollection");

  var API = {
    getInfectionEntities: function(){
      var infections = new Entities.InfectionCollection();
      var defer = $.Deferred();
      //check local storage to see if our data is already stored in there
      infections.fetch({
        success: function(data){
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      $.when(promise).done(function(fetchedInfections){
        if(fetchedInfections.length === 0){
          //get models from file
          $.ajax({
            dataType: "json",
            url: "/assets/data/infections.json",
            type: "GET",
            success: resetModels
          });

          function resetModels(models){
            infections.reset(models);
            infections.forEach(function(infection){
              infection.save();
            });
          }
        }
      });
      return promise;
    },

    getInfectionEntity: function(infectionId){
      var infection = new Entities.Infection({id: infectionId});
      var defer = $.Deferred();
      infection.fetch({
        success: function(data){
          defer.resolve(data);
        }, error: function(data){
          defer.resolve(undefined);
        }
      });
      return defer.promise();
    }
  }

  HospitalCheckup.reqres.setHandler("infection:entities", function(){
    return API.getInfectionEntities();
  });

  HospitalCheckup.reqres.setHandler("infection:entity", function(id){
    return API.getInfectionEntity(id);
  });
});