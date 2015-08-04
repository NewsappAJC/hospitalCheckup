HospitalCheckup.module("Entities", function(Entities, HospitalCheckup, Backbone, Marionette, $, _){

  Entities.Infection = Backbone.Model.extend({
    defaults: {
      display_name: "No display name found!"
    },
    urlRoot: "infections"
  });

  Entities.configureStorage("HospitalCheckup.Entities.Infection");

  Entities.InfectionCollection = Backbone.Collection.extend({
    url: "infections", //we could use our .json file but then we wouldn't be able to use this url for local storage
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
          //get models from file. Doing this here instead of by just setting the 
          //collection URL to the file on initialization bc we need to use list 
          //page URL for local storage. If we had a restful API we could use same URL for both
          $.ajax({
            dataType: "json",
            url: "/assets/data/infections.json",
            type: "GET",
            success: resetModels
          });
        }
        function resetModels(models){
          infections.reset(models);
          infections.forEach(function(infection){
            infection.save(); //to local storage
          });
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

  HospitalCheckup.reqres.setHandler("infection:entities", function(){ //list infections
    return API.getInfectionEntities();
  });

  HospitalCheckup.reqres.setHandler("infection:entity", function(id){ //hospital selected from infection list, show hospital detail page
    return API.getInfectionEntity(id);
  });
});