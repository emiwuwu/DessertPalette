// Function to fetch data from the API
async function fetchResult(){
    try {
        // Fetch data from the API and convert the response to JSON
        const resultsResponse = await fetch('http://127.0.0.1:5000/api/v1.0/flavored-ingredients').then((res) => res.json());
        
        // Return the results in an object
        return { results: resultsResponse };
    } catch (error) {
        console.log(error);
    }
}

// Function to create and display charts
async function createChartsAndInsights(){
    // Fetch data using the fetchResult function
    const data = await fetchResult();

    if (data.results){
        // Initialize arrays to store ingredients, ratings, total time and data points
        const ingredients = [];
        const ratings = [];
        const totalTime = [];
        const dataPoints=[];

        // Loop through the results and extract ingredient, rating, and total time data
        for (let result of data.results){

            const ingredient = result.ingredient;
            const rating = result.avg_rating;
            const time = result.avg_total_time;

            // Push the data into respective arrays
            ingredients.push(ingredient);
            ratings.push(rating);
            totalTime.push(time);

            // Create a data point object for the scatter plot
            const dataPoint={
              x: rating,
              y: time
            };
            dataPoints.push(dataPoint);
        }

        // Create a bar chart
        const myBarChart = document.getElementById('bar').getContext('2d');
        const inRatingChart = new Chart(myBarChart, {
            type: 'bar',
            data: {
              labels: ingredients,
              datasets: [{
                  label: 'Rating',
                  data: ratings,
                  backgroundColor:'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
              }]
          },
            options: {
              scales: {
                  y: {
                      beginAtZero:false,
                      min:4.1
                  }
              }
          }
            
        });

        // Performing linear regression on the xyData
        const xyData = dataPoints.map((dataPoint) => [dataPoint.x, dataPoint.y]);
        const result = regression.linear(xyData);
        const rSquared = result.r2; // Extract R-squared value

        // Create a scatter plot
        const myScatterPlot = document.getElementById('scatter').getContext('2d');
        const scatterPlot= new Chart(myScatterPlot,{
          type:'scatter',
          data: {
            datasets:[{
              label: `Ratings vs Total Cooking Time (R-Squared: ${rSquared})`,
              data: dataPoints,
              backgroundColor: 'rgba(255, 99, 132, 0.2)', // Adjust color as needed
              borderColor: 'rgba(255, 99, 132, 1)',
              pointRadius: 6,
            }]
          },
          options: {
            scales: {
                x:{
                    type: 'linear',
                    position: 'bottom'
                }
            }
          } 
        });
          
        // Create a combined chart
        const myComboChart = document.getElementById('combo').getContext('2d');
        const comboChart = new Chart(myComboChart, {
          type: 'bar', // Set the primary chart type
          data: {
            labels: ingredients,
            datasets: [
              {
                label: 'Total Time',
                data: totalTime,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                type: 'bar', // Bar chart type for this dataset
                order: 2
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
                order: 1,
                yAxisID: 'y2'
                },
            ],
            },
            options: {
              scales: {
                x: {
                   grid: {
                     display: false, // Disable grid lines on the x-axis
                  }
                },
                y: {
                    id: 'y1',
                    type: 'linear',
                    position: 'left', // Position on the left for the bar chart
                    grid: {
                      display: false, // Disable grid lines on the y-axis
                  }
                  },
                y2: {
                    id: 'y2',
                    type: 'linear',
                    position: 'right', // Position on the right for the line chart
                    beginAtZero: false,
                    min:4.1
                  },
              },
              responsive: true
            },
          });

          const insightsBox=  d3.selectAll('#text-box');
          insightsBox.html("");
          const insights= ["Based on the presented bar chart, it's evident that recipes featuring 'mixed fruit' have the highest average ratings. 'Rum flavored extract' and 'Brandy' closely follow as top-rated ingredients. This suggests that including alcoholic ingredients in dessert recipes may contribute to higher ratings.",
          "The scatter plot's R-squared value of 0.01 indicateds minimal correlation between total cooking time and ratings, implying a weak relationship between the two variables.",
          "Based on the combination chart, for desserts rated above 4.5, maple syrup-based recipes offer the best ratings while demanding the shortest total cooking time."]

          insights.forEach((insights) =>{
            insightsBox
            .append('li')
            .text(insights);
          });
    }
}

// Call the createChartsAndInsights function to generate and display the charts and insights
createChartsAndInsights();
