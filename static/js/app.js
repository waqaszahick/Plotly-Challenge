// get samples.json file
var dataFile =  d3.json("./samples.json");

// Initialize x and y arrays
var x = [];
var y = [];
var labels = [];
var modX = [];

var dropdown = d3.selectAll("#selDataset");
var panelBody;

createPanelBody();

dropdown.on("change", updatePlotly);

dataFile.then(function (data) {
    x = data.samples[0].otu_ids.slice(0,10);
    y = data.samples[0].sample_values.slice(0,10);
    labels = data.samples[0].otu_labels.slice(0,10);
    drawBubbleChart(x, y,labels);
    y.sort(function(a,b){ return (a-b)});
    x.forEach(element => {
      modX.push("OTU "+element);
    });
    
    drawBarChart(y,modX,labels);

    drawPieChart(x,y,labels);
    
  data.names.forEach(elementt => {
    var opt = dropdown.append("option");
    opt.text(elementt);
    opt.property('value', elementt);
    opt.property('id', elementt);
  }); 

  updateDemographicInfo(data.metadata[0]);
})

// This function is called when a dropdown menu item is selected
function updatePlotly() {
  x = [];
  y = [];
  modX = [];
  labels = [];

  var dropdown = d3.select("#selDataset");
  var dataset = dropdown.property("value");
  panelBody.remove();
  createPanelBody();

  dataFile.then(function (data) {
    data.metadata.every(elements => {
      if (elements.id == dataset) {
        updateDemographicInfo(elements);
        return false;
      }
      return true;
    });
    
    
    data.samples.every(element => {
      if (element.id == dataset) {
        x = element.otu_ids.slice(0,10);
        y = element.sample_values.slice(0,10);
        labels = element.otu_labels.slice(0,10);
        
        drawBubbleChart(x, y,labels);
        
        y.sort(function(a,b){ return (a-b)});
    
        x.forEach(element => {
          modX.push("OTU "+element);
        });
    
        drawBarChart(y,modX,labels);
        drawPieChart(x,y,labels);
        return false;
      }
      return true;
    });
  });
}

function createPanelBody() {
  panelBody = d3.select('#panel').append("div");
  panelBody.style('padding','10px');
  panelBody.property('class', "panel-body");
  panelBody.property('id', "sample-metadata");
}
function drawBarChart(xAxisData, yAxisData,labels) {
  data_a = [{
    x: xAxisData,
    y: yAxisData,
    text: labels,
    type: "bar",
    orientation: "h"
}];
Plotly.newPlot("bar", data_a);
}
function drawBubbleChart(xAxisData, yAxisData,labels) {
  data_a = [{
    x: xAxisData,
    y: yAxisData,
    text: labels,
    type: "bubble",
    mode: 'markers',
    marker: {
      color:xAxisData,
      size: yAxisData,
    },
  }];
  Plotly.newPlot("bubble", data_a);
}
function drawPieChart(otuID_top10,sample_top10,otuDescription_top10){
  /*define pie chart data*/
  var piedata = [{
    labels: otuID_top10,
    values: sample_top10,
    type: "pie",
    hovertext:otuDescription_top10
}];
/*define pie chart layout*/
var layout_pie = {
  title: "<b>Top 10 Samples by OTU ID<br>(Pie Chart)</b>",
  height: 500,
  width: 500,
};
Plotly.newPlot("pie",piedata,layout_pie);
}
function drawGaugeChartA(value){
  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: value,
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrups per Week<br><b>(Digital Gauge)</b>" },
      textinfo: 'text',
      textposition: 'inside',
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9] },
      }
    }
  ];  
  Plotly.newPlot('gaugeA', data);
}

function drawGaugeChartB(wfreq){
  /*define x and y position of pointer tip*/
	var degrees = (9-wfreq)*20,
  radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

/*create a triangle to represent a pointer*/
var mainPath = 'M .0 -0.025 L .0 0.025 L ',
  pathX = String(x),
  space = ' ',
  pathY = String(y),
  pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);
/*define data for dot (scatter) and pie chart*/
var data = [
{ type: 'scatter',
  x: [0,], y:[0],
 marker: {size: 28, color:'850000'},
 showlegend: false,
 name: 'scrubs',
 text: wfreq,
 hoverinfo: 'text+name'},
 
 { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50/9,50/9,50/9, 50],
 rotation: 90,
 text: ['8-9', '7-8', '6-7','5-6', '4-5', '3-4', '2-3',
         '1-2', '0-1', ''],
 textinfo: 'text',
 textposition:'inside',
 marker: {colors:['rgba(30,120,30, .5)', 'rgba(55,135,55, .5)','rgba(80,150,80, .5)',
         'rgba(105,165,105, .5)', 'rgba(130,180,130, .5)','rgba(155,195,155, .5)',
          'rgba(180,210,180, .5)','rgba(205,225,205, .5)', 'rgba(230,240,230, .5)',
                      'rgba(255, 255, 255, 0)']},
 hoverinfo: 'none',
 hole: .5,
 type: 'pie',
 showlegend: false}
];
/*define the layout, shape and path*/
var layout = {
   shapes:[{
     type: 'path',
     path: path,
     fillcolor: '850000',
     line: { color: '850000' }
   }],
   title: '<b>Belly Button Washing Frequency</b><br>Scrups per Week<br><b>(Analogue Gauge)</b>',
   height: 600,
   width: 600,
   /*move the zero point to the middle of the pie chart*/
   xaxis: {zeroline:false, showticklabels:false,
          showgrid: false, range: [-1, 1]},
   yaxis: {zeroline:false, showticklabels:false,
          showgrid: false, range: [-1, 1]}
 };

Plotly.newPlot('gaugeB', data, layout);
}

function updateDemographicInfo(data) {
  panelBody.append("p").text(`ID: ${data.id}`);
  panelBody.append("p").text(`Ethnicity: ${data.ethnicity}`);
  panelBody.append("p").text(`Gender: ${data.gender}`);
  panelBody.append("p").text(`Age: ${data.age}`);
  panelBody.append("p").text(`Location: ${data.location}`);
  panelBody.append("p").text(`bbtype: ${data.bbtype}`);
  panelBody.append("p").text(`wfreq: ${data.wfreq}`);
  drawGaugeChartA(data.wfreq);
  drawGaugeChartB(data.wfreq);
}