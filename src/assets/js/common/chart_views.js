HospitalCheckup.module("Common.Chart", function(Chart, HospitalCheckup, Backbone, Marionette, $, _){

  //all the common elements that all list charts in hospital app will share
  Chart.BarBase = ChartBaseView.extend({
    constructor: function(options) {
      ChartBaseView.apply(this, arguments);
      this.options.bar_padding = options.bar_padding || 4;
      this.options.section = options.section || "infections";
      this.options.stat = options.stat || "ratio";
      this.duration = 500;
      this.easing = "sin-in-out"; // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
      this.bar_height = (this.dimensions.height / this.collection.length) - this.options.bar_padding;
      this.$chart_container.attr('id', this.el.id+"-container");
      return this;
    },
    draw: function() {
      var data = this.filter_data(this.data);
      this.get_scales(data);
      this.create_axis("x", "bottom"); //super
      this.create_axis("y", "left"); //super
      this.create_svg(); //super
      this.create_svg_containers();
      this.draw_base_bars(data);
      this.draw_data(data);
      this.draw_axes(data);//needs to be on top of bars
    },

    //remove items with no data and sort by stat
    filter_data: function(){
      var chart = this,
      section = chart.options.section,
      stat = chart.options.stat;

      var filtered = chart.data.filter(function(d){
        return d[section][chart.options.measure].na != 1;
      });
      filtered.sort(function(a,b){
        return d3.ascending(a[section][chart.options.measure][stat], b[section][chart.options.measure][stat]);
      });
      return filtered;
    },

    get_xMax: function(data){
      var chart = this;
      return d3.max(data, function(d) { return d[chart.options.section][chart.options.measure].upper });
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

    create_svg_containers: function(){
      //extend this
      return this;
    },

    draw_base_bars: function(data) {
      var chart = this;
      var bars = chart.svg.select("#baseBars").selectAll(".base.bar")
        .data(data);
        //.data(data, function(d){ return d.id });

      bars.exit().transition().duration(chart.duration)
        .ease(chart.easing)
        .style("opacity", 0).remove();

      bars.enter().append("rect")
        .attr("class", "base bar")
        .style("opacity", 0)
        .attr("y", function(d) {
          return chart.yScale(d.display_name);
        })
        .attr("width", chart.dimensions.width)
        .attr("height", chart.bar_height);

      bars.transition().duration(chart.duration)
        .ease(chart.easing)
        .style("opacity", 1)
        //.attr("y", function(d){ return chart.yScale(d.display_name); })
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
        .ease(chart.easing)  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .attr("transform", "translate(0," + height + ")")
        .call(chart.xAxis);

      chart.yScale.rangeBands([0, height]).domain(_.map(filtered, function(d) { return d.display_name; }));

      chart.svg.select("#axes").selectAll(".y.axis")
        .transition().duration(chart.duration)
        .ease(chart.easing)
        .call(chart.yAxis);

      chart.draw_base_bars(filtered);
      chart.onSelectHospital(chart.selected);
    },

    onSelectHospital: function(label){
      d3.selectAll(".y.axis text").classed("active", function(d){
        return d === label
      });
      this.selected = label; //store it so we can check for it when new labels enter
    },

    set_tooltip: function(chart, obj, measure){
      obj.on("mouseover", function(d) {
        chart.attach_tooltip(d, measure);
      })
      .on("mouseout", function() {
        $("#ttip").remove();
      });
    },

    attach_tooltip: function(data, measure) {
      data.measure = measure; //template needs access

      var tmpl = _.template($("#"+this.options.section+"-tooltip-template").html());
      var tt = $(tmpl(data));
      tt.css("top", (parseFloat(d3.event.layerY - 15)) + "px");
      tt.css("left", (parseFloat(d3.event.layerX + 25)) + "px");
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
      ids = ["baseBars", "rangeBars", "axes", "contextLines", "statCircles"];

      for(var i=0; i<ids.length; i++){
        chart.svg.append("g").attr("id", ids[i]);
      }
    },

    draw_data: function(data){
      this.draw_range_bars(data);
      this.draw_context_lines(data);
      this.draw_stat_circles(data);
    },

    draw_range_bars: function(data){
      var chart = this,
      measure = chart.options.measure,
      section = chart.options.section;

      var rangeBars = chart.svg.select("#rangeBars").selectAll(".range.bar")
        .data(data, function(d){ return d.id });

      rangeBars.exit().transition().duration(chart.duration)
        .ease(chart.easing)
        .style("opacity", 0).remove();

      rangeBars.enter()
      .append("rect")
      .attr("class", "range bar")
        .style("opacity", 0)
      .attr("x", function(d) {
        return chart.xScale(d[section][measure].lower);
      })
      .attr("y", function(d) {
        return chart.yScale(d.display_name);
      })
      .attr("width", function(d){
        return chart.xScale(d[section][measure].upper - d[section][measure].lower)
      })
      .attr("height", chart.bar_height);
      chart.set_tooltip(chart, rangeBars, measure);

      //update
      rangeBars.transition().duration(chart.duration)
        .ease(chart.easing)
        .style("opacity", 1)
        .attr("x", function(d) {
          return chart.xScale(d[section][measure].lower);
        })
        .attr("y", function(d) {
          return chart.yScale(d.display_name);
        })
        .attr("width", function(d){
          return chart.xScale(d[section][measure].upper - d[section][measure].lower);
        })
        .each(function(d){
          var ratingClasses = {"normal": false, "good": false, "bad": false};
          ratingClasses[d[section][measure].ratingClass] = true;
          d3.select(this).classed(ratingClasses);
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
        .text("State avg.")
        .attr("text-anchor", function(){
          if(avg < 1){
            return "end"
          } return "start"
        })
        .attr("class", "chart-label")
        .attr("id", "avgTxt")
        .transition().duration(chart.duration)
        .ease(chart.easing)
        .attr("x", chart.xScale(avg))
        .attr("y", -5);

      if(chart.options.section === "infections"){
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
          .attr("class", "chart-label")
          .attr("id", "benchmarkTxt")
          .attr("x", chart.xScale(1))
          .attr("y", -5);
      }
    },

    draw_stat_circles: function(data){
      var chart = this,
      measure = chart.options.measure,
      section = chart.options.section,
      stat = chart.options.stat;

      var circles = chart.svg.select("#statCircles").selectAll(".stat-circle")
        .data(data, function(d){ return d.id });

      circles.exit().transition().duration(chart.duration)
        .ease(chart.easing)
        .style("opacity", 0).remove();;

      circles.enter().append("circle")
        .style("opacity", 0)
        .attr("class", "stat-circle")
        .attr("cx", function(d) {
          return chart.xScale(d[section][measure][stat]);
        })
        .attr("cy", function(d) {
          return chart.yScale(d.display_name)+chart.bar_height/2;
        })
        .attr("r", 6);
        chart.set_tooltip(chart, circles, measure);

      //update
      circles.transition().duration(chart.duration)
        .ease(chart.easing)
        .style("opacity", 1)
        .attr("cx", function(d) {
          return chart.xScale(d[section][measure][stat]);
        })
        .attr("cy", function(d) {
          return chart.yScale(d.display_name)+chart.bar_height/2;
        });
    },

    onUpdateChart: function(criterion){
      this.options.measure = criterion;
      var chart = this,
      filtered = chart.filter_data(),
      height = chart.get_currentHeight(filtered),
      avg = HospitalCheckup.Entities.averages.get(criterion);

      Chart.BarBase.prototype.onUpdateChart.call(this, filtered, height); //am I doing this right?

      chart.draw_range_bars(filtered);
      chart.draw_stat_circles(filtered);

      //update context lines
      chart.svg.select("#averageLine")
        .transition().duration(chart.duration)
        .ease(chart.easing)
        .attr("y2", height)
        .attr("x1", chart.xScale(avg))
        .attr("x2", chart.xScale(avg));

      chart.svg.select("#avgTxt")
        .transition().duration(chart.duration)
        .ease(chart.easing)
        .attr("x", chart.xScale(avg))
        .attr("text-anchor", function(){
          if(avg < 1){
            return "end"
          } return "start"
        });

      if(chart.options.section === "infections"){
        chart.svg.select("#benchmarkLine")
          .transition().duration(chart.duration)
          .ease(chart.easing)
          .attr("y2", height)
          .attr("x1", chart.xScale(1)) //benchmark is always 1
          .attr("x2", chart.xScale(1));

        chart.svg.select("#benchmarkTxt")
          .transition().duration(chart.duration)
          .ease(chart.easing)
          .attr("x", chart.xScale(1))
          .attr("text-anchor", function(){
            if(avg < 1){
              return "start"
            } return "end"
          });
      }
    }
  });

  Chart.HospitalDetail = ChartBaseView.extend({
    constructor: function(options) {
      ChartBaseView.apply(this, arguments);
      return this;
    },
    draw: function(){
      this.get_scales(this.data);
      this.create_axis("x", "bottom"); //super
      this.create_svg(); //super
      this.draw_axes(this.data);
      this.draw_data();

    },

    get_scales: function(data) {
      this.xScale = d3.scale.linear()
        .rangeRound([0, this.dimensions.width])
      .domain([0, d3.max([data.predicted, data.observed])])
        .nice(); //extend bounds to nearest round value
    },

    draw_axes: function(data) {
      //create and set x axis position
      this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.dimensions.height + ")")
        .call(this.xAxis);
    },

    draw_data: function(){
      this.draw_lines("predicted");
      this.draw_lines("observed");
    },

    draw_lines: function(str){
      var num = this.data[str],
      chart = this;

      this.svg.append("line")
        .attr("class", str)
        .attr("y1", 0)
        .attr("y2", this.dimensions.height)
        .attr("x1", this.xScale(num))
        .attr("x2", this.xScale(num))

      this.svg.append("text").text(d3.round(num, rounder(num)))
      .attr("class", str+" chart-label txt")
      .attr("text-anchor", "middle")
      .attr("x", this.xScale(num))
      .attr("y", function(){
        //if the lables might overlap, bump up the predicted one
        if(str==="observed" | Math.abs(chart.xScale(num) - chart.xScale(chart.data.observed)) >= 21){
          return -5
        }
        return -18
      })

      //round display text relative to its value
      function rounder(num){
        if (num > .1){
          return 1
        } else if (num > .01){
          return 2
        } else {
          return 3
        }
      }
    }
  });
});