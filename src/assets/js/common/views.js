HospitalCheckup.module("Common.Views", function(Views, HospitalCheckup, Backbone, Marionette, $, _){
  Views.Loading = Marionette.ItemView.extend({
    template: "#loading-view",

    onShow: function(){
      var opts = {
        lines: 13,
        lenght: 10,
        width: 10,
        radius: 20,
        corners: 1,
        rotate: 0,
        direction: 1, //1:clockwise, -1:counterclockwise
        color: "#000",
        speed: 1, //Rounds per second
        trail: 60, //Afterglow percentage
        shadow: false,
        hwaccel: false, //Whether to use hardware acceleration
        className: "spinner",
        zIndex: 2e9, //defaults to 2000000000
        top: "100px", //relative to parent
        left: "60px"
      }
      $("#spinner").spin(opts);
    }
  });
});