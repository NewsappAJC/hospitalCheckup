HospitalCheckup.module("Entities", function(Entities, HospitalCheckup, Backbone, Marionette, $, _){
  //Entities = models and collections

  var API = {
    getChartEntities: function(entityID, sectionID){
      Entities.StateAverages = Backbone.Model.extend({
        sessionStorage: new Backbone.SessionStorage(sectionID+"-state-avg") //using this instead of a URL!
      });

      Entities.Hospital = Backbone.Model.extend({
        urlRoot: sectionID
      });
      Entities.configureStorage("HospitalCheckup.Entities.Hospital");

      Entities[entityID+"Collection"] = Backbone.Collection.extend({
        url: sectionID, //we could use our .json file but then we wouldn't be able to use this url for local storage
        model: Entities.Hospital
      });
      Entities.configureStorage("HospitalCheckup.Entities."+entityID+"Collection");

      Entities.averages = new Entities.StateAverages(); //attach to Entities so chart can get at it
      var entities = new Entities[entityID+"Collection"]();
      var deferLocal = $.Deferred(); //wait for localStorage data to be fetched
      var deferServer = $.Deferred(); //we might need to wait for data to be fetched from server
      //check local storage to see if our data is already stored in there
      entities.fetch({
        success: function(data){
          deferLocal.resolve(data);
        }
      });
      $.when(deferLocal.promise()).done(function(fetchedEntities){
        if(fetchedEntities.length === 0){
          //get models from file. Doing this here instead of by just setting the 
          //collection URL to the file on initialization bc we need to use list 
          //page URL for local storage. If we had a restful API we could use same URL for both
          function resetModels(data){
            Entities.averages.set(data.averages);
            Entities.averages.save();

            entities.reset(data.hospitals);
            entities.forEach(function(entity){
              entity.save(); //to local storage
            });
            deferServer.resolve(entities);
          }

          $.ajax({
            dataType: "json",
            url: "/assets/data/"+sectionID+".json",
            //url: "//hospitals.myajc.com/assets/data/"+sectionID+".json",
            type: "GET",
            success: resetModels
          });
        } else {
          Entities.averages.fetch();
          Entities.averages.attributes = Entities.averages.attributes[0]; //I don't know why but fetching was nesting them instide another object and I couldn't get to them
          deferServer.resolve(fetchedEntities);
        }

      });
      return deferServer.promise();
    },

    getHospitalEntity: function(hospitalId){
      var hospital = new Entities.Hospital({id: hospitalId});
      var defer = $.Deferred();
      hospital.fetch({
        success: function(data){
          defer.resolve(data);
        }, error: function(data){
          defer.resolve(undefined);
        }
      });
      return defer.promise();
    }
  }

  HospitalCheckup.reqres.setHandler("chart:entities", function(entityID, sectionID){ //list infections
    return API.getChartEntities(entityID, sectionID);
  });

  HospitalCheckup.reqres.setHandler("hospital:entity", function(id){ //hospital selected from infection list, show hospital detail page
    return API.getHospitalEntity(id);
  });
});