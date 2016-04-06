//general ContactManager app code (defining regions, the start handler, etc.):
var MainRegion = Marionette.Region.extend({
  el: "#main-region",
  onShow: function(view, region, options){
    //every time a new view is shown in the main region, check for .tipped class and add tooltips
    view.on("show", function(){
      HospitalCheckup.$tooltip.hide(); //make sure there aren't any hanging around
      HospitalCheckup.addTips();
    });
  }
});

var HospitalCheckup = new Marionette.Application({
  initialize: function(){
    this.$tooltip = $("#tooltip");
  }
});

HospitalCheckup.navigate = function(route, options){
  options || (options = {});
  Backbone.history.navigate(route, options);
};

HospitalCheckup.getCurrentRoute = function(){
  return Backbone.history.fragment
};

HospitalCheckup.on("before:start", function(){
  var RegionContainer = Marionette.LayoutView.extend({
    el: "#app-container",

    regions: {
      header: "#header-region",
      loadingRegion: "#loading-region",
      main: MainRegion
    }
  });

  HospitalCheckup.regions = new RegionContainer();
});

HospitalCheckup.addTips = function(){ //currently only used on measure labels on ER waits page
  $(".tipped").on("mouseover", function(e){
    var that = e.target;
    //store title info in data
    if(!that.data){
      that.data = that.title;
      that.title = ""; //clear title attribute to prevent browser default tooltips
    }
  });
  $(".tipped").on("click", function(e){
    HospitalCheckup.$tooltip
      .show()
      .html(e.target.data)
      .css("top", e.pageY + "px")
      .css("left", e.pageX + 15 + "px");
  }).on("mouseout", function(){
    HospitalCheckup.$tooltip.hide();
  });
}

HospitalCheckup.on("start", function(){
  if(Backbone.history){
    Backbone.history.start();

    /*if(this.getCurrentRoute() === ""){
      HospitalCheckup.trigger("infections:list");
    }*/
  }

  $(document).on('click', 'a[href^="#benchmark"]', function (e) { //TODO this doesn't belong here
    e.preventDefault();
    element = document.getElementById("benchmark")
    element.scrollIntoView(true); //parameter = "alignToTop"
  });
});
