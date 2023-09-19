// Function to fetch data from the API
async function fetchResult(){
    try {
        // Fetch data from the API and convert the response to JSON
        const resultsResponse = await fetch('http://127.0.0.1:5000/api/v1.0/results').then((res) => res.json());
        
        // Return the results in an object
        return { results: resultsResponse };
    } catch (error) {
        console.log(error);
    }
}

// Function to create and display charts
async function createCharts(){
    // Fetch data using the fetchResult function
    const data = await fetchResult();

    if (data.results){
        // Initialize arrays to store ingredients, ratings, and total time
        const ingredients = [];
        const ratings = [];
        const totalTime = [];

        // Loop through the results and extract ingredient, rating, and total time data
        for (let result of data.results){
            const ingredient = result.ingredient;
            const rating = result.avg_rating;
            const time = result.avg_total_time;

            // Push the data into respective arrays
            ingredients.push(ingredient);
            ratings.push(rating);
            totalTime.push(time);
        }

        // Define data and options for the bar chart
        const barChartData = {
            labels: ingredients,
            datasets: [{
                label: 'Rating',
                data: ratings,
                backgroundColor:'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };

        // Create a bar chart
        const myBarChart = document.getElementById('bar').getContext('2d');
        const inRatingChart = new Chart(myBarChart, {
            type: 'bar',
            data: barChartData
        });

        // Define data and options for the line chart
        const lineChartData = {
            labels: ratings,
            datasets: [{
                label: 'Total Time',
                data: totalTime,
                backgroundColor:'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        };
    
        // Create a line chart
        const myLineChart = document.getElementById('line').getContext('2d');
        const timeRatingChart = new Chart(myLineChart, {
            type: 'line',
            data: lineChartData
        });

        // Define data and options for the combined chart
        const comboChartData = {
            labels: ingredients,
            datasets: [
              {
                label: 'Total Time',
                data: totalTime,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                stack: 'combined', // Stack the bars
                type: 'bar', // Bar chart type for this dataset
                yAxisID: 'y-axis-1', // Use the primary y-axis
              },
              {
                label: 'Rating',
                data: ratings,
                fill: false, // Do not fill the area under the line
                backgroundColor:'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                type: 'line', // Line chart type for this dataset
                yAxisID: 'y-axis-2', // Use the secondary y-axis
              },
            ],
          };
          
          // Create a combined chart
          const myComboChart = document.getElementById('combo').getContext('2d');
          const comboChart = new Chart(myComboChart, {
            type: 'bar', // Set the primary chart type
            data: comboChartData,
            options: {
              scales: {
                yAxes: [
                  {
                    id: 'y-axis-1',
                    type: 'linear',
                    position: 'left', // Position on the left for the bar chart
                  },
                  {
                    id: 'y-axis-2',
                    type: 'linear',
                    position: 'right', // Position on the right for the line chart
                  },
                ],
              },
              responsive: true
            },
          });
    }
}

// Call the createCharts function to generate and display the charts
createCharts();
