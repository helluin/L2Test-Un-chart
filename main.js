class ChartManager {
    constructor() {
        this.margin = {
                top: 30,
                right: 40,
                bottom: 30,
                left: 40
            },
            this.width = $("svg").width() - this.margin.right - this.margin.left,
            this.height = $("svg").height() - this.margin.top - this.margin.bottom,
            this.dataGroup,
            this.groupNumDefault = "I",
            this.maxX, this.maxY,
            this.svg, this.xAxis, this.xScale, this.yAxis, this.yScale
    };


    //select and read data by group
    init() {
        var that = this;
        d3.json("data.json", function (d) {

            //get max values to config domain
            that.maxX = d3.max(d, function (d) {
                return d.x;
            });
            that.maxY = d3.max(d, function (d) {
                return d.y;
            });
            console.log(that.margin);
            //create svg
            that.svg = d3.select("svg")
                .attr("id", "scatter_plot")
                .attr("width", that.width)
                .attr("height", that.height)
                .append("g")
                .attr("width", that.width)
                .attr("height", that.height)
                .attr("id", "drawing_area")
                .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");
            //x-axis 
            that.xScale = d3.scale.linear().range([0, that.width]).domain([0, that.maxX]);
            that.xAxis = d3.svg.axis()
                .scale(that.xScale).orient("bottom").ticks(7).outerTickSize(0);
            that.svg.append("g")
                .attr("class", "x_axis")
                .attr("transform", "translate(0," + that.height + ")")
                .call(that.xAxis);

            //y-axis
            that.yScale = d3.scale.linear().range([0, that.height]).domain([that.maxY + 1, 0]);
            that.yAxis = d3.svg.axis().scale(that.yScale).orient("left").ticks(6).outerTickSize(0).innerTickSize(-that.width);
            that.svg.append("g")
                .attr("class", "y_axis")
                .call(that.yAxis);
            that.selectGroup(that.groupNumDefault);
        });
    };

    //update data group
    selectGroup(groupNum) {
        var that = this;
        d3.json("/data.json", function (d) {
            that.dataGroup = d.filter(function (el) {
                return el.group == groupNum;
            });
            // console.log(dataGroup);
            that.drawChart(that.dataGroup);

        });
    };


    //draw and update chart 
    drawChart(data) {
        var that = this;
        var selection = d3.select("svg").selectAll("circle")
            .data(data);
        //console.log(selection);


        //update selection
        selection.transition().duration(300).attr("cx", function (d) {
                console.log("updating!");
                return that.xScale(d.x);
            })
            .attr("cy", function (d) {
                return that.yScale(d.y) + that.margin.top;
            });
        //enter selection
        selection.enter()
            .append("circle")
            .attr("class", "dots")
            .attr("cx", function (d) {
                console.log("updating!");
                return that.xScale(d.x);
            })
            .attr("cy", function (d) {
                console.log(d.y);
                return that.yScale(d.y) + that.margin.top;
            })
            .attr("r", function (d) {
                return 10;
            })
            .attr("fill", "#bf4498");
        //exit selection
        selection.exit().remove();
    };



    //responsive
    resize_chart() {
        var that = this;
        console.log(that);
        //detect change
        that.width = $("svg").width() - that.margin.right - that.margin.left;
        that.height = $("svg").height() - that.margin.top - that.margin.bottom;
        d3.select("svg").attr("width", function (d) {
            return that.width;
        });


        //x-axis setup
        that.xScale = d3.scale.linear().range([0, that.width]).domain([0, that.maxX]);
        that.xAxis = d3.svg.axis()
            .scale(that.xScale).orient("bottom").ticks(7).outerTickSize(0);

        //y-axis setup
        that.yScale = d3.scale.linear().range([0, that.height]).domain([that.maxY + 1, 0]);
        that.yAxis = d3.svg.axis().scale(that.yScale).orient("left").ticks(6).outerTickSize(0).innerTickSize(-that.width);

        //drawing
        d3.select(".x_axis").attr("transform", "translate(0," + that.height + ")").call(that.xAxis);
        d3.select(".y_axis").call(that.yAxis);
        d3.selectAll("circle")
            .attr("cx", function (d) {
                console.log("updating!");
                return that.xScale(d.x);
            })
            .attr("cy", function (d) {
                console.log(d.y);
                return that.yScale(d.y) + that.margin.top;
            });
    }
}



let myManager = new ChartManager();
myManager.init();
$(window).on("resize", myManager.resize_chart.bind(myManager));