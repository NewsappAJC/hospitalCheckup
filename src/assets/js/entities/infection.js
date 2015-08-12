HospitalCheckup.module("Entities", function(Entities, HospitalCheckup, Backbone, Marionette, $, _){
  //Entities = models and collections
  Entities.Hospital = Backbone.Model.extend({
    defaults: {
      display_name: "No display name found!",
      //measure: "cdiff"
    },
    urlRoot: "infections"
  });

  Entities.configureStorage("HospitalCheckup.Entities.Hospital");

  Entities.InfectionCollection = Backbone.Collection.extend({
    url: "infections", //we could use our .json file but then we wouldn't be able to use this url for local storage
    model: Entities.Hospital,
    comparator: "display_name",
    //parse: function(response){
      /*response.forEach(function(hospital){
        hospital.infections.forEach(function(group){ //create collections for the different infection types, attatch them to Entities and add the rest of the collection
          var tmp = Entities[group.infection];
          if(tmp){
            tmp.add(group);
          } else {
            Entities[group.infection] = new Entities.InfectionCollection({model: group});
          }
        });
        //hospitalHospitalInfectionsCollection = new Entities.HospitalInfectionsCollection(hospital.infections);
      });*/
      //return response;
    //}
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

  HospitalCheckup.reqres.setHandler("infection:entities", function(criterion){ //list infections
    return API.getInfectionEntities(criterion);
  });

  HospitalCheckup.reqres.setHandler("hospital:entity", function(id){ //hospital selected from infection list, show hospital detail page
    return API.getHospitalEntity(id);
  });
});