var margin = {
    top: 30,
    right: 40,
    bottom: 30,
    left: 40
}
var width = $("svg").width() - margin.right - margin.left,
    height = $("svg").height() - margin.top - margin.bottom;
var dataGroup;
var groupNumDefault = "I";
var maxX, maxY;
var svg, xAxis, xScale, yAxis, yScale;



//select and read data by group
function init() {
    d3.json("data.json", function (d) {
        //get max values to config domain
        maxX = d3.max(d, function (d) {
            return d.x;
        });
        maxY = d3.max(d, function (d) {
            return d.y;
        });
        console.log(maxX);
        //create svg
        svg = d3.select("svg")
            .attr("id", "scatter_plot")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("width", width)
            .attr("height", height)
            .attr("id", "drawing_area")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //x-axis 
        xScale = d3.scale.linear().range([0, width]).domain([0, maxX]);
        xAxis = d3.svg.axis()
            .scale(xScale).orient("bottom").ticks(7).outerTickSize(0);
        svg.append("g")
            .attr("class", "x_axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        //y-axis
        yScale = d3.scale.linear().range([0, height]).domain([maxY + 1, 0]);
        yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(6).outerTickSize(0).innerTickSize(-width);
        svg.append("g")
            .attr("class", "y_axis")
            .call(yAxis);
        //config button opacity
        //        $(window).one("load", function(){ 
        //             console.log("loaded");
        //            $("#group_1").css({"opacity":"0.5"});
        //            
        //        });
        //select data and draw 
        selectGroup(groupNumDefault);
    });
}

//update or select data 
function selectGroup(groupNum) {
    d3.json("/data.json", function (d) {
        dataGroup = d.filter(function (el) {
            return el.group == groupNum;
        });
        console.log(dataGroup);
        drawChart(dataGroup);

    });
}


//draw and update chart 
function drawChart(data) {
    var selection = d3.select("svg").selectAll("circle")
        .data(data);
    console.log(selection);


    //update selection
    selection.transition().duration(300).attr("cx", function (d) {
            console.log("updating!");
            return xScale(d.x);
        })
        .attr("cy", function (d) {
            return yScale(d.y) + margin.top;
        });
    //enter selection
    selection.enter()
        .append("circle")
        .attr("class", "dots")
        .attr("cx", function (d) {
            console.log("updating!");
            return xScale(d.x);
        })
        .attr("cy", function (d) {
            console.log(d.y)
            return yScale(d.y) + margin.top;
        })
        .attr("r", function (d) {
            return 10;
        })
        .attr("fill", "#bf4498");
    //exit selection
    selection.exit().remove();
}

init();

$(window).on("resize", resize_chart);

function resize_chart() {
    width = $("svg").width() - margin.right - margin.left;
    height = $("svg").height() - margin.top - margin.bottom;
    d3.select("svg").attr("width", function (d) {
        return width;
    });


    //x-axis 
    xScale = d3.scale.linear().range([0, width]).domain([0, maxX]);
    xAxis = d3.svg.axis()
        .scale(xScale).orient("bottom").ticks(7).outerTickSize(0);

    //y-axis
    yScale = d3.scale.linear().range([0, height]).domain([maxY + 1, 0]);
    yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(6).outerTickSize(0).innerTickSize(-width);

    //drawing
    d3.select(".x_axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    d3.select(".y_axis").call(yAxis);
    d3.selectAll("circle")
        .attr("cx", function (d) {
            console.log("updating!");
            return xScale(d.x);
        })
        .attr("cy", function (d) {
            console.log(d.y)
            return yScale(d.y) + margin.top;
        })





}