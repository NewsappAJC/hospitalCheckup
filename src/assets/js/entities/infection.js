HospitalCheckup.module("Entities", function(Entities, HospitalCheckup, Backbone, Marionette, $, _){

  Entities.Infection = Backbone.Model.extend({
    defaults: {
      display_name: "No display name found!"
    },
    urlRoot: "infections"
  });

  Entities.configureStorage("HospitalCheckup.Entities.Infection");

  Entities.InfectionCollection = Backbone.Collection.extend({
    //url: "/assets/data/infections.json",
    url: "infections",
    initialize: function(){
      this.model= Entities.Infection;
      this.comparator= "display_name" //sort by
    }
  });

  Entities.configureStorage("HospitalCheckup.Entities.InfectionCollection");

  var initializeInfections = function(){
    var infections = new Entities.InfectionCollection([
      {
        "address": {
          "city": "CUMMING", 
          "county": "FORSYTH", 
          "state": "GA", 
          "street": "1200 NORTHSIDE FORSYTH DRIVE", 
          "zip": "30041"
        }, 
        "display_name": "Northside Hospital Forsyth", 
        "id": "110005", 
        "infections": [
          {
            "category": "No Different than U.S. National Benchmark", 
            "days": "3665", 
            "infection": "cdiff", 
            "lower": "0.289", 
            "na": "0", 
            "note": "", 
            "observed": "4", 
            "predicted": "4.398", 
            "ratio": "0.91", 
            "upper": "2.194"
          },
        ], 
        "provider_name": "NORTHSIDE HOSPITAL FORSYTH"
      }, 
      {
        "address": {
          "city": "ATHENS", 
          "county": "CLARKE", 
          "state": "GA", 
          "street": "1230 BAXTER STREET", 
          "zip": "30606"
        }, 
        "display_name": "Saint Mary's Hospital", 
        "id": "110006", 
        "infections": [
          {
            "category": "Better than the U.S. National Benchmark", 
            "days": "1962", 
            "infection": "cdiff", 
            "lower": "0.009", 
            "na": "0", 
            "note": "", 
            "observed": "1", 
            "predicted": "5.331", 
            "ratio": "0.188", 
            "upper": "0.925"
          }
        ], 
        "provider_name": "ST MARY'S HOSPITAL"
      }
    ]);
    infections.forEach(function(infection){
      infection.save();
    });
    return infections;
  }

  var API = {
    getInfectionEntities: function(){
      //TODO make sure the data loads over the network, John used `defer`
      var infections = new Entities.InfectionCollection();
      infections.fetch();
      if(infections.length === 0){
        return initializeInfections();
      }
      return infections;
      /*if(infections === undefined){
        infections = new Entities.InfectionCollection();
        infections.fetch({
          success: function(data){
            return data
          }
        });
        initializeInfections();
        }
      return infections;*/
    },
    }
  }

  HospitalCheckup.reqres.setHandler("infection:entities", function(){
    return API.getInfectionEntities();
  });

});