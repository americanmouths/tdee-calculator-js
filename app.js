//Enable tooltips and popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})

$('.popup-marker').popover({
    html: true,
    trigger: 'manual'
}).click(function(e) {
    $('.popup-marker').not(this).popover('hide');
    $(this).popover('toggle');
});
$(document).click(function(e) {
    if (!$(e.target).is('.popup-marker, .popover-title, .popover-content')) {
        $('.popup-marker').popover('hide');
    }
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

// UI Vars
let age,
    weight,
    heightFt,
    heightIn,
    gender,
    activity,
    bmr,
    tdee,
    weightInKg = 0,
    heightToCm = 0,
    heightInCm = 0,
    breastfeeding;

//Form Event Listener
document.querySelector('.myForm').addEventListener('submit', function(e){
  //Hide results
  document.getElementById('results').style.display = "none";

  //Show Loader
  document.getElementById('loading').style.display = 'block';
  document.getElementById('loading').style.margin = 'auto';

  setTimeout(calculateBMR, 2000);
  e.preventDefault();
});

//Calculate BMR
function calculateBMR(){
  //Get values from form
  getFormValues();

  // Convert values
  weightHeightConversions(weight, heightFt, heightIn);

//Validate fields
  if (isNaN(age) || weight === ""){
    //Display error if fields empty
    showError('Please fill out all fields before submitting');
  } else {
    document.querySelector('.submit').disabled = "true"
    if (gender === "Female"){
      let femaleBmr = 655 + (9.6 * weightInKg) + (1.8 * heightInCm);
      bmr = (femaleBmr) - (4.7 * age);
      bmr = Math.round(bmr);

      if (breastfeeding === "Yes"){
        bmr += 450;
        calculateTDEE(bmr);
      } else {
        calculateTDEE(bmr);
      }

      //Show Results
      showResults(bmr, tdee);
    } else {
      console.log(gender, age, weight, weightInKg, heightInCm);
      let maleBmr = 66 + (13.7 * weightInKg) + (5 * heightInCm);
      bmr = (maleBmr) - (6.8 * age);
      bmr = Math.round(bmr);

      //calculate TDEE
      calculateTDEE(bmr);

      //Show Results
      showResults(bmr, tdee);
    }
  }
}


//Calculate TDEE
function calculateTDEE(bmr){
  switch(activity) {
    case "Sedentary":
      tdee = Math.round(bmr * 1.2)
      break;
    case "Lightly Active":
      tdee = Math.round(bmr * 1.375)
      break;
    case "Moderately Active":
      tdee = Math.round(bmr * 1.55)
      break;
    case "Very Active":
      tdee = Math.round(bmr * 1.725)
      break;
    case "Extremely Active":
      tdee = Math.round(bmr * 1.9)
      break;
  }
}

//Show results
function showResults(bmr, tdee){
  //Display results div
  document.getElementById('results').style.display = 'block';

  //Grab divs
  let bmrResults = document.querySelector('.bmr');
  let tdeeResults = document.querySelector('.tdee');
  let maintain = document.querySelector('.maintain');
  let lose1Lb = document.querySelector('.lose-1lb');
  let lose1HalfLb = document.querySelector('.lose-oneandhalflb');
  let lose2Lbs = document.querySelector('.lose-2lb');

  // Hide loader
  document.getElementById('loading').style.display = 'none';

  //Append results
  bmrResults.innerHTML += `  BMR:  ${bmr}`;
  tdeeResults.innerHTML += `  TDEE: ${tdee}`;
  maintain.innerHTML += `${tdee} Calories`;
  lose1Lb.innerHTML += `${tdee - 500} Calories`;
  lose1HalfLb.innerHTML += `${tdee - 750} Calories`;
  lose2Lbs.innerHTML += `${tdee - 1000} Calories`;

}

//Get values from form
function getFormValues(){
   age = parseInt(document.getElementById('age').value);
   weight = document.getElementById('weight').value;
   heightFt = parseInt(document.getElementById('height-feet').value);
   heightIn = parseInt(document.getElementById('height-inch').value);
   gender = document.getElementById('gender').value;
   activity = document.getElementById('activity').value;
   breastfeeding = document.getElementById('breast-feeding').value;
}

//Convert weight to kg and height to cm
function weightHeightConversions(weight, heightFt, heightIn){
  weightInKg = (weight / 2.2).toFixed(2);
  heightToCm = ((heightFt * 12) + heightIn);
  heightInCm = heightToCm * 2.54;
}


//Show error
function showError(error){
  // Hide results
  document.getElementById('results').style.display = 'none';

  // Hide loader
  document.getElementById('loading').style.display = 'none';

  // Create an error div
  const errorDiv = document.createElement('div');

  //Grab elements to put error between
  const form = document.querySelector('.myForm');
  const heading = document.querySelector('.field');

  //Give error bootstrap error class
  errorDiv.className = 'alert alert-danger';

  //Append error message to error div
  errorDiv.appendChild(document.createTextNode(error));

  //Insert error
  form.insertBefore(errorDiv, heading);

  setTimeout(clearError, 5000);
}

//Clear error
function clearError(){
  document.querySelector('.alert').remove();
}
