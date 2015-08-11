HospitalCheckup.module("HeaderApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){
  List.Controller = {
    listHeader: function(){
      var links = HospitalCheckup.request("header:entities");
      var headers = new List.Headers({collection: links});

      headers.on("childview:navigate", function(childView, model){
        var url = model.get("url");
        if(url === ""){
          HospitalCheckup.trigger("home:show");
        } else if(url === "infections"){
          HospitalCheckup.trigger("infections:list");
        } else if(url === "hipsknees"){
          console.log("trigger hipsknees");
        } else if(url === "perinatal"){
          console.log("trigger perinatal");
        } else{
          throw "No such sub-application: " + url;
        }
      });

      HospitalCheckup.regions.header.show(headers);
    },

    setActiveHeader: function(headerUrl){
      var links = HospitalCheckup.request("header:entities");
      var headerToSelect = links.find(function(header){
        return header.get("url") === headerUrl;
      });
      headerToSelect.select();
      links.trigger("reset");
    }
  };
});