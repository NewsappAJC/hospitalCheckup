HospitalCheckup.module("Common.Chart", function(Chart, HospitalCheckup, Backbone, Marionette, $, _){
  Chart.BarBase = ChartBaseView.extend({
    constructor: function(options) {
      ChartBaseView.apply(this, arguments);
      this.options.bar_padding = options.bar_padding || 4;
      this.transition_duration = 500;
      this.$chart_container.attr('id', 'infections-chart-container');
      return this;
    },
    draw: function() {
      this.get_scales();
      this.create_axes();
      this.create_svg();
      this.draw_bars();
      this.draw_axes();//needs to be on top of bars
      this.draw_data();
    },

    get_xMax: function(){
      var chart = this;
      return d3.max(chart.data, function(d) { return d.infections[chart.options.measure].upper });
    },

    get_scales: function() {
      var chart = this;
      

      chart.yScale = d3.scale.ordinal()
        .rangeBands([0, chart.dimensions.height])
        .domain(_.map(chart.data, function(d) { return d.display_name; }));

      chart.xScale = d3.scale.linear()
        .rangeRound([0, chart.dimensions.width])
        .domain([0, chart.get_xMax()])
        .nice(); //extend bounds to nearest round value
    },

    create_axes: function() {
      var chart = this;

      chart.xAxis = d3.svg.axis()
        .scale(chart.xScale)
        .orient("bottom");

      chart.yAxis = d3.svg.axis()
        .scale(chart.yScale)
        //.ticks(( $(chart.el).width() <= 550 )? 5:9 )
        .orient("left");
    },

    create_svg: function() {
      var chart = this;

      //create new svg for the bar chart
      chart.svg = d3.select(chart.el).append("svg")
        .attr("width", chart.dimensions.wrapperWidth)
        .attr("height", chart.dimensions.wrapperHeight)
        .attr("class", "chart")
      .append("g")
        .attr("transform", "translate(" + chart.options.margin.left + ", " + chart.options.margin.top + ")");
    },

    draw_bars: function() {
      var chart = this;

      chart.svg.selectAll("rect")
        .data(chart.data)
          .enter()
          .append("rect")
            .attr("class", "base bar")
            //.attr("text-anchor", "middle")
            /*.attr("x", function(d) {
              return chart.xScale(d.infections[d.measure].upper);
            })*/
            .attr("y", function(d) {
              return chart.yScale(d.display_name);
            })
            .attr("width", chart.dimensions.width)
            .attr("height", function(d) {
              return (chart.dimensions.wrapperHeight / chart.data.length) - chart.options.bar_padding; //-4 for padding between bars
              //return chart.dimensions.height - chart.yScale(d[chart.options.y_key]) - 1;
            })
    },

    draw_axes: function() {
      var chart = this;

      //create and set x axis position
      chart.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chart.dimensions.height + ")")
        //.attr("text-anchor", "middle")
        .call(chart.xAxis);

      //create and set y axis positions
      var gy = chart.svg.append("g")
        .attr("class", "y axis")
        .attr("y", 6)
        .call(chart.yAxis);

    draw_data: function(){
      this.draw_range();

    },

    draw_range: function(){
      var chart = this;

      //enter
      chart.svg.selectAll(".range-bar")
        .data(chart.data)
        .enter()
        .append("rect")
        .attr("class", "range-bar")
        .attr("x", function(d) {
          return chart.xScale(d.infections[chart.options.measure].lower);
        })
        .attr("y", function(d) {
          return chart.yScale(d.display_name);
        })
        .attr("width", function(d){
          return chart.xScale(d.infections[chart.options.measure].upper - d.infections[chart.options.measure].lower)
        })
        .attr("height", function(d) {
          return (chart.dimensions.wrapperHeight / chart.data.length) - chart.options.bar_padding;
        });

      //update
      d3.selectAll(".range-bar")
        .transition()
        .duration(chart.transition_duration)
          .attr("x", function(d) {
            return chart.xScale(d.infections[chart.options.measure].lower);
          })
          .attr("width", function(d){
            return chart.xScale(d.infections[chart.options.measure].upper - d.infections[chart.options.measure].lower)
          })
        .transition().each(function(d){
          var category = d.infections[chart.options.measure].category;
          if(category === "No Different than U.S. National Benchmark"){
            d3.select(this).classed({"normal": true, "good": false, "bad": false});
          } else if (category === "Better than the U.S. National Benchmark"){
            d3.select(this).classed({"normal": false, "good": true, "bad": false});
          } else if (category === "Worse than the U.S. National Benchmark"){
            d3.select(this).classed({"normal": false, "good": false, "bad": true});
          } else {
            d3.select(this).classed({"normal": false, "good": false, "bad": false});
          }
        });
        /*range_sel.filter(function(d){
          return d.infections[chart.options.measure].category === "No Different than U.S. National Benchmark"
        }).classed("normal", true);*/
    },

    onUpdateChart: function(criterion){
      var chart = this;

      chart.options.measure = criterion;
      chart.xScale.domain([0, chart.get_xMax()]).nice();
      chart.xAxis.scale(chart.xScale);
      
      chart.svg.selectAll(".x.axis")
        .transition().duration(chart.transition_duration).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .call(chart.xAxis);

        chart.draw_data();
    }
  });
});