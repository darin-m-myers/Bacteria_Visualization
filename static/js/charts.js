var jsonData = "static/json/samples.json"

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json(jsonData).then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    buildDashboard(sampleNames[0]);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildDashboard(newSample)
}

function buildDashboard(sample) {
  buildMetadata(sample);
  buildCharts(sample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json(jsonData).then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json(jsonData).then((data) => {
    // Create a variable that holds the samples array. 
    var samples = data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample)[0];
      
    console.log(resultArray);
    
    //  Create a variable that holds the first sample in the array.
    // var result = resultArray.sort((a,b) => a.sample_values - b._sample_values).reverse();
    var result = resultArray;
    delete result.id;

    // console.log(result);

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // #### BAR CHARTING DATA ####
    // Create the trace for the bar chart. 
    var barData = [{
      type: 'bar',
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.map(i => "OTU " + i).slice(0,10).reverse(),
      orientation: 'h',
      text: otu_labels.slice(0,10).reverse()
    }];

    // Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      margin: {
        l: 100,
        r: 100,
        b: 30,
        t: 50,
        pad: 4
      },
      paper_bgcolor: '#FCF7F8'
    };

    
    // #### BUBBLE CHARTING DATA ####
    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: 'Earth'
      }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '<b>Bacterial Cultures Per Sample</b>',
      showlegend: false,
      xaxis: {
        title: {
          text: 'OTU ID',
          }
        },
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 75,
        pad: 4
      },
      paper_bgcolor: '#FCF7F8',
    };

    // #### Gague CHARTING DATA #### 
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var wfreq = parseFloat(resultArray[0].wfreq);

    // Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: "" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
        ],
      }
    }];

    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
      margin: {
        l: 50,
        r: 50,
        b: 30,
        t: 50
      },
      paper_bgcolor: '#FCF7F8',
    };

  
    // Use Plotly to plot the data with the layout.
    var config = {responsive: true}
    Plotly.newPlot("bar",barData,barLayout,config);
    Plotly.newPlot("bubble",bubbleData,bubbleLayout,config); 
    Plotly.newPlot("gauge",gaugeData,gaugeLayout,config); 
  });
}