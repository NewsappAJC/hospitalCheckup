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

  Entities.StateAverages = Backbone.Model.extend({
    localStorage: new Backbone.LocalStorage("infections-state-avg") //using this instead of a URL!
  });

  Entities.InfectionCollection = Backbone.Collection.extend({
    url: "infections", //we could use our .json file but then we wouldn't be able to use this url for local storage
    model: Entities.Hospital,
    comparator: "display_name"
  });
  Entities.configureStorage("HospitalCheckup.Entities.InfectionCollection");

  Entities.InfectionLabels = new Backbone.Collection([
    {label: "Clostridium difficile (C.diff)", key: "cdiff"},
    {label: "Methicillin-resistant staphylococcus sureus (MRSA)", key: "mrsa"},
    {label: "Catheter-associated urinary tract infections", key: "cauti"},
    {label: "Central line-associated blood stream infections", key: "clabsi"},
    {label: "Surgical Site Infection from colon surgery", key: "ssicolon"},
    {label: "Surgical Site Infection from abdominal hysterectomy", key: "ssihyst"}
  ]);

  var API = {
    getInfectionEntities: function(){
      Entities.averages = new Entities.StateAverages(); //attach to Entities so chart can get at it
      var infections = new Entities.InfectionCollection();
      var deferLocal = $.Deferred(); //wait for localStorage data to be fetched
      var deferServer = $.Deferred(); //we might need to wait for data to be fetched from server
      //check local storage to see if our data is already stored in there
      infections.fetch({
        success: function(data){
          deferLocal.resolve(data);
        }
      });
      $.when(deferLocal.promise()).done(function(fetchedInfections){
        if(fetchedInfections.length === 0){
          //get models from file. Doing this here instead of by just setting the 
          //collection URL to the file on initialization bc we need to use list 
          //page URL for local storage. If we had a restful API we could use same URL for both
          function resetModels(data){
            Entities.averages.set(data.averages);
            Entities.averages.save();

            infections.reset(data.hospitals);
            infections.forEach(function(infection){
              infection.save(); //to local storage
            });
            deferServer.resolve(infections);
          }

          $.ajax({
            dataType: "json",
            url: "/assets/data/infections.json",
            //url: "//ajcnewsapps.s3-website-us-east-1.amazonaws.com/2015/staging/hospital-checkup/assets/data/infections.json",
            type: "GET",
            success: resetModels
          });
        } else {
          Entities.averages.fetch();
          Entities.averages.attributes = Entities.averages.attributes[0]; //I don't know why but fetching was nesting them instide another object and I couldn't get to them
          deferServer.resolve(fetchedInfections);
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

  HospitalCheckup.reqres.setHandler("infection:entities", function(criterion){ //list infections
    return API.getInfectionEntities(criterion);
  });

  HospitalCheckup.reqres.setHandler("hospital:entity", function(id){ //hospital selected from infection list, show hospital detail page
    return API.getHospitalEntity(id);
  });
});