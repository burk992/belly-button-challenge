// URL set as a constant variable 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Gets samples.json and logs it for use
d3.json(url).then(function(data) {
  console.log(data);
});

// Initializes the working dashboard 
function init() {

    // Calls D3 to select the menu that drops down
    let dropdown = d3.select("#selDataset");

    // Calls D3 to get names of samples nad then populate the drop menu
    d3.json(url).then((data) => {
        
        // Var for all the samples from the json
        let names = data.names;

        // This lists all the samples to the drop menu
        names.forEach((id) => {

            // Logs the values of each ID for the looping func
            console.log(id);

            dropdown.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list
        let first_sample = names[0];

        // Logs the value of first_sample
        console.log(first_sample);

        // Build the initial plots
        buildMetadata(first_sample);
        buildBarChart(first_sample);
        buildBubbleChart(first_sample);
    });
};

// Function that populates metadata info
function buildMetadata(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let meta = data.metadata;

        // Filter based on the value of the sample
        let value = meta.filter(result => result.id == sample);

        // Log the array of metadata objects after the have been filtered
        console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function that builds the bar chart
function buildBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let values = value[0];

        // Get the taxonomy idents, labels, and sample values
        let otu_id = values.otu_ids;
        let otu_label= values.otu_labels;
        let otu_samples = values.sample_values;

        // Log the data to the console
        console.log(otu_id,otu_label,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_id.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = otu_samples.slice(0,10).reverse();
        let labels = otu_label.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds the bubble chart
function buildBubbleChart(sample) {

    // Calling all the data so far
    d3.json(url).then((data) => {
        
        // Call all of the data from the samples
        let sampleInfo = data.samples;

        // Filter out the data based on sample values
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let values = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_id = values.otu_ids;
        let otu_label= values.otu_labels;
        let otu_samples = values.sample_values;

        // Log everything back to the console
        console.log(otu_id,otu_label,otu_samples);
        
        // Create traces for the bubble chart for plotly
        let trace1 = {
            x: otu_id,
            y: otu_samples,
            text: otu_label,
            mode: "markers",
            marker: {
                size: otu_samples,
                color: otu_id,
                colorscale: "Earth"
            }
        };

        // This creates the layout
        let layout = {
            title: "Bacterias Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU (Taxonomy) ID"},
        };

        // Calling on Plotly to create a bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Creating a func that auto updates the dashboard when values change in the sample
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

init();