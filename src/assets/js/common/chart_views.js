HospitalCheckup.module("Common.Chart", function(Chart, HospitalCheckup, Backbone, Marionette, $, _){

  //all the common elements that all list charts in hospital app will share
  Chart.BarBase = ChartBaseView.extend({
    constructor: function(options) {
      ChartBaseView.apply(this, arguments);
      this.options.bar_padding = options.bar_padding || 4;
      this.duration = 500;
      this.bar_height = (this.dimensions.height / this.collection.length) - this.options.bar_padding;
      this.$chart_container.attr('id', this.el.id+"-container");
      return this;
    },
    draw: function() {
      var data = this.filter_data(this.data);
      this.get_scales(data);
      this.create_axes();
      this.create_svg();
      this.create_svg_containers();
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

    create_svg_containers: function(){
      //extend this
      return this;
    },

    draw_base_bars: function(data) {
      var chart = this;
      var bars = chart.svg.select("#baseBars").selectAll(".base.bar")
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
      chart.svg.select("#axes").append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chart.get_currentHeight(data) + ")")
        //.attr("text-anchor", "middle")
        .call(chart.xAxis);

      //create and set y axis positions
      var gy = chart.svg.select("#axes").append("g")
        .attr("class", "y axis")
        .attr("y", 6)
        .call(chart.yAxis);

      gy.selectAll("text")
      .classed("hospital-label", true)
    },

    draw_data: function(data){
      return this;
    },

    onUpdateChart: function(filtered, height){
      var chart = this;

      //update scales and axes
      chart.xScale.domain([0, chart.get_xMax(filtered)]).nice();
      chart.xAxis.scale(chart.xScale);

      chart.svg.select("#axes").selectAll(".x.axis")
        .transition().duration(chart.duration)
        .ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .attr("transform", "translate(0," + height + ")") //TODO looks weird bc it shouldn't start at 0
        .call(chart.xAxis);

      chart.yScale.rangeBands([0, height]).domain(_.map(filtered, function(d) { return d.display_name; }));

      chart.svg.select("#axes").selectAll(".y.axis")
        .transition().duration(chart.duration)
        .ease("sin-in-out")
        .call(chart.yAxis);

      chart.draw_base_bars(filtered);
    },

    set_tooltip: function(chart, obj, measure){
      obj.on("mouseover", function(d) {
        chart.attach_tooltip(d, measure);
      })
      .on("mouseout", function() {
        $("#ttip").remove();
      })
    },

    attach_tooltip: function(data, measure) {
      data.measure = measure;

      var tmpl = _.template($("#tooltip-template").html());
      var tt = $(tmpl(data));
      tt.css("top", (parseFloat(d3.event.pageY) - 220) + "px");
      tt.css("left", (parseFloat(d3.event.pageX) - 50) + "px");
      this.$el.append(tt);
    }
  });

  Chart.BarRangeDot = Chart.BarBase.extend({
    constructor: function(options) {
      Chart.BarBase.apply(this, arguments);
      return this;
    },

    //create containers so that entering items stay layered at the correct depth
    create_svg_containers: function(){
      var chart = this,
      ids = ["baseBars", "rangeBars", "axes", "contextLines", "ratioCircles"];

      for(var i=0; i<ids.length; i++){
        chart.svg.append("g")
          .attr("id", ids[i])
      }
    },

    draw_data: function(data){
      this.draw_range_bars(data);
      this.draw_context_lines(data);
      this.draw_ratio_circles(data);
    },

    draw_range_bars: function(data){
      var chart = this,
      measure = chart.options.measure;

      var rangeBars = chart.svg.select("#rangeBars").selectAll(".range-bar")
        .data(data);

      rangeBars.exit().remove()

      rangeBars.enter()
      .append("rect")
      .attr("class", "range-bar")
      .attr("x", function(d) {
        return chart.xScale(d.infections[measure].lower);
      })
      .attr("y", function(d) {
        return chart.yScale(d.display_name);
      })
      .attr("width", function(d){
        return chart.xScale(d.infections[measure].upper - d.infections[measure].lower)
      })
      .attr("height", chart.bar_height);
      chart.set_tooltip(chart, rangeBars, measure);

      //update
      rangeBars.transition()
        .duration(chart.duration)
        .attr("x", function(d) {
          return chart.xScale(d.infections[measure].lower);
        })
        .attr("width", function(d){
          return chart.xScale(d.infections[measure].upper - d.infections[measure].lower)
        })
        .transition().each(function(d){
          var category = d.infections[measure].category;
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
      var chart = this,
      height = chart.get_currentHeight(data),
      avg = HospitalCheckup.Entities.averages.get(chart.options.measure);

      var contextLines = chart.svg.select("#contextLines");
      
      contextLines.append("line")
        .attr("y1", 0)
        .attr("y2", height)
        .attr("x1", chart.xScale(avg))
        .attr("x2", chart.xScale(avg))
        .attr("id", "averageLine");

      contextLines.append("text")
        .text("State avg.: " + avg)
        .attr("text-anchor", function(){
          if(avg < 1){
            return "end"
          } return "start"
        })
        .attr("class", "label")
        .attr("id", "avgTxt")
        .transition().duration(chart.duration)
        .attr("x", chart.xScale(avg))
        .attr("y", -5);

      contextLines.append("line")
        .attr("y1", 0)
        .attr("y2", height)
        .attr("x1", chart.xScale(1)) //benchmark is always 1
        .attr("x2", chart.xScale(1))
        .attr("id", "benchmarkLine");

      contextLines.append("text")
        .text("Benchmark")
        .attr("text-anchor", function(){ //figure out which side the line is on
          if(avg < 1){
            return "start"
          } return "end"
        })
        .attr("class", "label")
        .attr("id", "benchmarkTxt")
        .attr("x", chart.xScale(1))
        .attr("y", -5);
    },

    draw_ratio_circles: function(data){
      var chart = this,
      measure = chart.options.measure;

      var circles = chart.svg.select("#ratioCircles").selectAll(".ratio-circle")
        .data(data);

      circles.exit().remove()

      circles.enter()
      .append("circle")
      .attr("class", "ratio-circle")
      .attr("cx", function(d) {
        return chart.xScale(d.infections[measure].ratio);
      })
      .attr("cy", function(d) {
        return chart.yScale(d.display_name)+chart.bar_height/2;
      })
      .attr("r", 6);
      chart.set_tooltip(chart, circles, measure);

      //update
      circles.transition()
        .duration(chart.duration)
        .attr("cx", function(d) {
          return chart.xScale(d.infections[measure].ratio);
        })
        .attr("y", function(d) {
          return chart.yScale(d.display_name)+chart.bar_height/2;
        })
    },

    onUpdateChart: function(criterion){
      this.options.measure = criterion;
      var chart = this,
      filtered = chart.filter_data(),
      height = chart.get_currentHeight(filtered),
      avg = HospitalCheckup.Entities.averages.get(criterion);

      Chart.BarBase.prototype.onUpdateChart.call(this, filtered, height); //am I doing this right?

      chart.draw_range_bars(filtered);
      chart.draw_ratio_circles(filtered);

      //update context lines
      chart.svg.select("#averageLine")
        .transition().duration(chart.duration)
        .attr("y2", height)
        .attr("x1", chart.xScale(avg))
        .attr("x2", chart.xScale(avg))

      chart.svg.select("#avgTxt")
        .transition().duration(chart.duration)
        .attr("x", chart.xScale(avg))
        .text("State avg.: " + avg)
        .attr("text-anchor", function(){
          if(avg < 1){
            return "end"
          } return "start"
        });

      chart.svg.select("#benchmarkLine")
        .transition().duration(chart.duration)
        .attr("y2", height)
        .attr("x1", chart.xScale(1)) //benchmark is always 1
        .attr("x2", chart.xScale(1));

      chart.svg.select("#benchmarkTxt")
        .transition().duration(chart.duration)
        .attr("x", chart.xScale(1))
        .attr("text-anchor", function(){
          if(avg < 1){
            return "start"
          } return "end"
        });
    }
  });
});