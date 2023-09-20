async function fetchData() {
    try {
        const [recipesResponse, nutritionsResponse, ratingsResponse] = await Promise.all([
            fetch('http://127.0.0.1:5000/api/v1.0/recipes').then((res) => res.json()),
            fetch('http://127.0.0.1:5000/api/v1.0/nutrition').then((res) => res.json()),
            fetch('http://127.0.0.1:5000/api/v1.0/ratings').then((res) => res.json())
        ]);

        return {
            recipes: recipesResponse,
            nutritions: nutritionsResponse,
            ratings: ratingsResponse
        };
    } catch (error) {
        console.log('Error', error);
    }
}

async function loadDataAndDisplay(recipeId) {
    const cookingTimeBox = d3.select('#custom-cookingtime');
    const linkElement = d3.select('#external-link');
    const recipeImage = d3.select('#recipe-image');

    // Clear the previous content of the container
    cookingTimeBox.html('');

    const data = await fetchData();

    if (data) {
        const selectedRecipe = data.recipes.find((item) => item.id == recipeId);
        const selectedNutrition = data.nutritions.find((item) => item.meal_id == recipeId);
        const selectedRating = data.ratings.find((item) => item.meal_id == recipeId);

        if (selectedRecipe) {
            cookingTimeBox
                .selectAll('p')
                .data(['prep_time', 'cook_time', 'total_time', 'servings'])
                .enter()
                .append('p')
                .text((d) => `${d.replace('_', ' ').toUpperCase()}:  ${selectedRecipe[d]}`);

            cookingTimeBox
                .append('p')
                .text('(Unit: Minute)');

            linkElement.attr('href', selectedRecipe.url);
            recipeImage.attr('src', selectedRecipe.img_src);
        }

        if (selectedNutrition && selectedRecipe && selectedRating){
            const myRadarChart = document.getElementById('radar').getContext('2d');
            const raderChart = new Chart(myRadarChart, {
                type: 'radar',
                data: {
                    labels: ['Total Time (hrs)', 'Rating','Carbs','Serving'],
                    datasets:[{
                        label:'Values',
                        data:[((selectedRecipe.total_time)/60).toFixed(2), selectedRating.rating, 
                            (selectedNutrition.carbohydrate),selectedRecipe.servings],
                        backgroundColor:'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth:3
                    }]
                },
                options: {
                    scale: {
                        angleLines: {
                            display: true // Show radial lines
                        },
                        ticks: {
                            beginAtZero: true, // Start the scale at 0
                            max: 100, // Maximum scale value
                            stepSize: 20 // Step size between scale values
                        }
                    }
                }
            });

        };

        if (selectedNutrition) {
            const fat = selectedNutrition.fat;
            const carbs = selectedNutrition.carbohydrate;
            const protein = selectedNutrition.protein;
            const fiber = selectedNutrition.dietary_fiber;

            const chartData = {
                labels: ['Protein', 'Carbs', 'Fat', 'Dietary Fiber'],
                datasets: [{
                    label: 'Nutrition Values (g)',
                    data: [protein, carbs, fat, fiber],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)', // Fat
                        'rgba(54, 162, 235, 0.2)', // Carbs
                        'rgba(255, 206, 86, 0.2)', // Protein
                        'rgba(75, 192, 192, 0.2)' // Fiber
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            };

            const myBarChart = document.getElementById('bar').getContext('2d');
            const nutriChart = new Chart(myBarChart, {
                type: 'bar',
                data: {
                    labels: ['Protein', 'Carbs', 'Fat', 'Dietary Fiber'],
                    datasets: [{
                        label: 'Nutrition Values (g)',
                        data: [protein, carbs, fat, fiber],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)', // Fat
                            'rgba(54, 162, 235, 0.2)', // Carbs
                            'rgba(255, 206, 86, 0.2)', // Protein
                            'rgba(75, 192, 192, 0.2)' // Fiber
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            if (selectedRating) {
                const ratingData = [
                    {
                        type: "indicator",
                        mode: "gauge+number",
                        value: selectedRating.rating,
                        gauge: {
                            axis: { range: [0, 5], tickvals: [0, 1, 2, 3, 4, 5] },
                            bar: { color: "#a8d1d1" },
                            steps: [
                                { range: [0, 1], color: "rgba(255, 218, 185, 0.2)" },
                                { range: [1, 2], color: "rgba(255, 218, 185, 0.4)" },
                                { range: [2, 3], color: "rgba(255, 218, 185, 0.6)" },
                                { range: [3, 4], color: "rgba(255, 218, 185, 0.8)" },
                                { range: [4, 5], color: "rgba(255, 218, 185, 1.0)" },
                            ],
                        },
                    },
                ];

                const layout = {
                    width: 400,
                    height: 270,
                    margin: { t:0, r: 25, l: 25, b: 25 },
                    paper_bgcolor: "white",
                    font: { color: "black", family: "Monaco" },
                };

                // Plot the Gauge Chart in the specified container
                Plotly.newPlot("gauge", ratingData, layout);
            }

        }
    }
}

async function optionChanged(recipeId){
    await loadDataAndDisplay(recipeId);
}

function init() {
    const dropdown = document.getElementById('selDataset');

    fetch('http://127.0.0.1:5000/api/v1.0/recipes')
        .then((res) => res.json())
        .then(data => {
            data.forEach((recipe) => {
                const option = document.createElement("option");
                option.value = recipe.id;
                option.text = recipe.recipe_name;
                dropdown.appendChild(option);
                
            });

                // Get the first recipe ID
                const firstRecipeId= data[0].id

                 // Load and display data for the first recipe
                loadDataAndDisplay(firstRecipeId);
            });

    dropdown.addEventListener('change', (event) => {
        optionChanged(event.target.value);
    });

    document.addEventListener("DOMContentLoaded", function () {
        const reviewForm = document.getElementById("review-form");
        const commentBox= document.getElementById("sample-comments")
    
        reviewForm.addEventListener("submit", function (e) {
          e.preventDefault();
          const userReview = document.getElementById("review-text").value;
      
          // Log the review to the console
          const boxItem= document.createElement('li');
          boxItem.textContent = userReview;
          commentBox.appendChild(boxItem);

          console.log("Submitted Review:", userReview);
      
          // Clear the form
          document.getElementById("review-text").value = "";
        });
      });
}

init();