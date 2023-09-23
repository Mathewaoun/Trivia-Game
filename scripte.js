const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 15;

// This function is responsible for fetching quiz questions from an external API and displaying them on the web page.
async function loadQuestion(){ 
    const APIUrl = 'https://opentdb.com/api.php?amount=20&category=9&difficulty=easy';        //This line declares a constant variable named APIUrl and assigns it the URL of an API endpoint
    const result = await fetch(`${APIUrl}`)                                                     //This line uses the fetch function to make an HTTP GET request to the APIUrl and the await keyword is used to make the JavaScript code wait until the Promise is resolved and the data is available.
    const data = await result.json();                                                           // It awaits the result from the API, and then converts that response to JSON format.
    _result.innerHTML = "";
    showQuestion(data.results[0]);                                                              // This line calls a function and passes it the first question from the data object obtained from the API
}
//This function is used to convert HTML entities in a text string into their corresponding normal text.
function HTMLDecode(textString) {                                                               //So, the purpose of the HTMLDecode function is to take a string and convert it into its corresponding plain text representation.
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

// This function is likely to contain event listeners that will be set up later in the code to handle user interactions, such as clicking buttons.
function eventListeners(){
    _checkBtn.addEventListener('click', checkAnswer);                                           // This line adds an event listener to an element and when it's clicked, the checkAnswer function will be executed.
    _playAgainBtn.addEventListener('click', restartQuiz);                                       // This line adds an event listener to an element and when it's clicked, the restartQuiz function will be executed.
}
// This code adds an event listener to the 'DOMContentLoaded' event of the document. When the DOM content is fully loaded, it will execute the provided function
document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    setCount();
});


//This function is responsible for displaying a quiz question and its options on the web page.
function showQuestion(data){
    _checkBtn.disabled = false;                                                                 //This line sets the disabled property of an HTML element with the ID _checkBtn to false
    correctAnswer = data.correct_answer;                                                        //This line assigns the correct answer from the data object to the correctAnswer variable
    let incorrectAnswer = data.incorrect_answers;                                               //This line assigns the array of incorrect answer choices from the data object to the incorrectAnswer variable.
    let optionsList = incorrectAnswer;                                                          //This line creates a new variable optionsList and assigns it the value of the incorrectAnswer array.
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer); //This is typically done to shuffle the order of answer choices. ***********
    console.log(correctAnswer);                                                                 //This line logs the correct answer to the console.

    _question.innerHTML = `${data.question} <span class = "category"> ${data.category} </span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}


//This function adds event listeners to the list items within the _options element.
function selectOption(){
    const listItems = Array.from(_options.querySelectorAll('li'));                             // We are creating a variable and it will hold a array of the Nodelist

    listItems.forEach(option => {                                                               //This code uses the forEach method to iterate through each item and it takes a callback function as an argument and executes that function for each item.
        option.addEventListener('click', () => {                                                //This code means that when a user clicks on any of the list items, the function inside the event listener will be executed.
            const activeOption = _options.querySelector('.selected');                           //This line selects any list item with the class "selected" within the options element and assigns it to the activeOption variable.
            if (activeOption) {                                                                 //This line check if there a option already selected
                activeOption.classList.remove('selected');                                      //If so this line will remove the one he selected
            }
            option.classList.add('selected');                                                   //Regardless of whether, this line adds the selected class to the clicked answer choice
    });
});

}

//This function is called when the user clicks the check button to submit an answer.
function checkAnswer() {
    _checkBtn.disabled = true;                                                                  //Prevents users from repeatedly clicking it while the function is processing.
    if (_options.querySelector('.selected')) {                                                  //This condition checks if the user has selected an answer.
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if (selectedAnswer == HTMLDecode(correctAnswer)) {                                      //It checks if the user's answer matches the correct answer.
            correctScore++;                                                                    //Increment the score by 2
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;         //Displays a message 
        } else {
            _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;  //Displays a wrong message and show the player the right one
                                                                                                // Reset the game when the answer is incorrect
            setTimeout(restartQuiz, 1000);                                                      // Wait for 3 seconds before restarting
            return;                                                                             // Exit the function to prevent further execution
        }
        checkCount();                                                                           //Calls the fonction and updates the players progress
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;//If the user doesn't choice a option and clicks Check Answer, a message will ask him to select a option
        _checkBtn.disabled = false;                                                            //This line re-enables the check button to allow the user to attempt to answer again.
    }
}


//This function keeps track of the number of questions asked and updates the displayed count.
function checkCount(){
    askedCount++;                                                                               // This will increment the question count
    setCount();                                                                                 //This updates the total number and correct score
    
    if (correctScore == 15) {                                                                   // Redirect to the congratulation page
    window.location.href = 'congratulations.html';                                              // Change the URL to your congratulation page
    } else {
        setTimeout(function(){                                                                  //The code sets a timer to call the function after a 3 second delay.
            loadQuestion();
        }, 1000);
    }
}

//This function updates the displayed counts for the total number of questions and the correct score.
function setCount(){
    _totalQuestion.textContent = totalQuestion;                                                 //It updates the displayed total number of questions with the current value stored.
    _correctScore.textContent = correctScore;                                                   //It updates the displayed correct score with the current value stored.
}

//This function resets the quiz to its initial state when the user clicks the play again button.
function restartQuiz(){
    correctScore = askedCount = 0;                                                              // Resets the variables to 0
    _playAgainBtn.style.display = "none";                                                       //Hides the Play again button
    setCount();                                                                                 //the setCount function is responsible for updating and displaying the counts for the total number of questions and the correct score
    loadQuestion();                                                                             //Finally, this line calls the loadQuestion function. This function fetches and displays the first question in the quiz, effectively starting the quiz over from the beginning.
}