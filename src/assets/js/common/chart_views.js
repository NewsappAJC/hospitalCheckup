HospitalCheckup.module("Common.Chart", function(Chart, HospitalCheckup, Backbone, Marionette, $, _){
  Chart.BarBase = ChartBaseView.extend({
    constructor: function(options) {
      ChartBaseView.apply(this, arguments);
      this.options.bar_padding = options.bar_padding || 4;
      this.transition_duration = 500;
      this.bar_height = (this.dimensions.height / this.collection.length) - this.options.bar_padding;
      this.$chart_container.attr('id', 'infections-chart-container');
      return this;
    },
    draw: function() {
      var data = this.filter_data(this.data);
      this.get_scales(data);
      this.create_axes();
      this.create_svg();
      this.draw_base_bars(data);
      this.draw_data(data);
      this.draw_axes(data);//needs to be on top of bars
    },

    //remove items with no data and sort by ratio
    filter_data: function(){
      var chart = this;
      var filtered = chart.data.filter(function(d){
        return d.infections[chart.options.measure].category != "Not Available";
      });
      filtered.sort(function(a,b){
        return d3.ascending(a.infections[chart.options.measure].ratio, b.infections[chart.options.measure].ratio);
      });
      return filtered;
    },

    get_xMax: function(data){
      var chart = this;
      return d3.max(data, function(d) { return d.infections[chart.options.measure].upper });
    },

    get_currentHeight: function(data){
      return (this.options.bar_padding + this.bar_height) * data.length;
    },

    get_scales: function(data) {
      var chart = this;
      chart.yScale = d3.scale.ordinal()
        .rangeBands([0, chart.get_currentHeight(data)])
        .domain(_.map(data, function(d) { return d.display_name; }));

      chart.xScale = d3.scale.linear()
        .rangeRound([0, chart.dimensions.width])
        .domain([0, chart.get_xMax(data)])
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

    draw_base_bars: function(data) {
      var chart = this;
      var bars = chart.svg.selectAll(".base.bar")
        .data(data);

      bars.exit().remove();

      bars.enter().append("rect")
        .attr("class", "base bar")
        //.attr("text-anchor", "middle")
        /*.attr("x", function(d) {
          return chart.xScale(d.infections[d.measure].upper);
        })*/
        .attr("y", function(d) {
          return chart.yScale(d.display_name);
        })
        .attr("width", chart.dimensions.width)
        .attr("height", chart.bar_height)
    },

    draw_axes: function(data) {
      var chart = this;
      //create and set x axis position
      chart.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chart.get_currentHeight(data) + ")")
        //.attr("text-anchor", "middle")
        .call(chart.xAxis);

      //create and set y axis positions
      var gy = chart.svg.append("g")
        .attr("class", "y axis")
        .attr("y", 6)
        .call(chart.yAxis);

      gy.selectAll("text")
      .classed("hospital-label", true)
    },

    draw_data: function(data){
      this.draw_range_bars(data);
      this.draw_context_lines(data);
    },

    draw_range_bars: function(data){
      var chart = this;
      var rangeBars = chart.svg.selectAll(".range-bar")
          .data(data);

      rangeBars.exit().remove()

      rangeBars.enter()
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
      .attr("height", chart.bar_height);

      //update
      rangeBars.transition()
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

    },

    draw_context_lines: function(data){
      var chart = this;

      chart.svg.append("line")
        .attr("y1", 0)
        .attr("y2", chart.get_currentHeight(data))
        .attr("x1", chart.xScale(HospitalCheckup.Entities.averages.get(chart.options.measure)))
        .attr("x2", chart.xScale(HospitalCheckup.Entities.averages.get(chart.options.measure)))
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3)
        .attr("id", "averageLine");

    },

    onUpdateChart: function(criterion){
      var chart = this;
      chart.options.measure = criterion;
      var filtered = chart.filter_data();
      var chartHeight = chart.get_currentHeight(filtered);

      chart.xScale.domain([0, chart.get_xMax(filtered)]).nice();
      chart.xAxis.scale(chart.xScale);

      chart.svg.selectAll(".x.axis")
        .transition().duration(chart.transition_duration)
        .ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .attr("transform", "translate(0," + chartHeight + ")") //TODO looks weird bc it shouldn't start at 0
        .call(chart.xAxis);

      chart.yScale.rangeBands([0, chartHeight]).domain(_.map(filtered, function(d) { return d.display_name; }));

      chart.svg.selectAll(".y.axis")
        .transition().duration(chart.transition_duration)
        .ease("sin-in-out")
        .call(chart.yAxis);

      chart.draw_base_bars(filtered);
      chart.draw_range_bars(filtered);

      //SVG does not support Z-index, so in order to get this element on top it needs to be moved up in the DOM
      // var $tmp = $("#averageLine").detach();
      // $("svg").append($tmp);

      var avgLine = d3.select("#averageLine").transition().duration(chart.transition_duration)
        .attr("y2", chart.get_currentHeight(filtered))
        .attr("x1", chart.xScale(HospitalCheckup.Entities.averages.get(chart.options.measure)))
        .attr("x2", chart.xScale(HospitalCheckup.Entities.averages.get(chart.options.measure)))
    }
  });
});