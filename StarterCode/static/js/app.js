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
    for (var i = 0; i < 9; i++){
      if (data.samples[0].otu_ids[i] !== undefined) {
        x.push(data.samples[0].otu_ids[i]);  
        modX.push("OTU "+data.samples[0].otu_ids[i]);
      }
      if (data.samples[0].sample_values[i] !== undefined) {
        y.push(data.samples[0].sample_values[i]);
      }
      if (data.samples[0].otu_labels[i] !== undefined) {
        labels.push(data.samples[0].otu_labels[i]);
      }
    }
    drawBubbleChart(x,y,labels);
    y.sort(function(a,b){ return (a-b)});
    drawBarChart(y,modX,labels);
    
    
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
    try{
    data.metadata.every(elements => {
      if (elements.id == dataset) {
        updateDemographicInfo(elements);
        return false;
      }
      return true;
    });
    
    data.samples.every(element => {
      if (element.id == dataset) {
        for (var i = 0; i < 9; i++) {
          if (element.otu_ids[i] !== undefined) {
            x.push(element.otu_ids[i]);
            modX.push("OTU "+element.otu_ids[i]);
          }
          if (element.sample_values[i] !== undefined) {
            y.push(element.sample_values[i]);
          }
          if (element.otu_labels[i] !== undefined) {
            labels.push(element.otu_labels[i]);
          }
        }
        return false;
      }
      return true;
    });
    drawBubbleChart(x, y,labels);
    y.sort(function(a,b){ return (a-b)});
    drawBarChart(y,modX,labels);
    
  } catch (e) {
    if (e !== BreakException) throw e;
  }
  });
}

function createPanelBody() {
  panelBody = d3.select('#panel').append("div");
  panelBody.style('padding','10px');
  panelBody.property('class', "panel-body");
  panelBody.property('id', "sample-metadata");
}
function drawBarChart(xAxisData, yAxisData,labels) {
  dataa = [{
    y: yAxisData,
    x: xAxisData,
    text: labels,
    type: "bar",
    orientation: "h"
}];
Plotly.newPlot("bar", dataa);
}
function drawBubbleChart(xAxisData, yAxisData,labels) {
  dataa = [{
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
  Plotly.newPlot("bubble", dataa);
}
function drawGaugeChart(value){
  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: value,
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
      textinfo: 'text',
      textposition: 'inside',
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9] },
      }
    }
  ];
  Plotly.newPlot('gauge', data);
}
function updateDemographicInfo(data) {
  panelBody.append("p").text(`ID: ${data.id}`);
  panelBody.append("p").text(`Ethnicity: ${data.ethnicity}`);
  panelBody.append("p").text(`Gender: ${data.gender}`);
  panelBody.append("p").text(`Age: ${data.age}`);
  panelBody.append("p").text(`Location: ${data.location}`);
  panelBody.append("p").text(`bbtype: ${data.bbtype}`);
  panelBody.append("p").text(`wfreq: ${data.wfreq}`);
  drawGaugeChart(data.wfreq);
}