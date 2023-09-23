const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 15;


async function loadQuestion(){ 
    const APIUrl = 'https://opentdb.com/api.php?amount=20&category=9&difficulty=hard';        
    const result = await fetch(`${APIUrl}`)                                                     
    const data = await result.json();                                                          
    _result.innerHTML = "";
    showQuestion(data.results[0]);                                                              
}

function HTMLDecode(textString) {                                                              
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}


function eventListeners(){
    _checkBtn.addEventListener('click', checkAnswer);                                         
    _playAgainBtn.addEventListener('click', restartQuiz);                                      
}

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    setCount();
});



function showQuestion(data){
    _checkBtn.disabled = false;                                                               
    correctAnswer = data.correct_answer;                                                    
    let incorrectAnswer = data.incorrect_answers;                                              
    let optionsList = incorrectAnswer;                                                          
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer); 
    console.log(correctAnswer);                                                            
    _question.innerHTML = `${data.question} <span class = "category"> ${data.category} </span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}



function selectOption(){
    const listItems = Array.from(_options.querySelectorAll('li'));                           

    listItems.forEach(option => {                                                              
        option.addEventListener('click', () => {                                            
            const activeOption = _options.querySelector('.selected');                       
            if (activeOption) {                                                                 
                activeOption.classList.remove('selected');                                 
            }
            option.classList.add('selected');                                                 
    });
});

}


function checkAnswer() {
    _checkBtn.disabled = true;                                                                 
    if (_options.querySelector('.selected')) {                                               
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if (selectedAnswer == HTMLDecode(correctAnswer)) {                                 
            correctScore+=5;                                                                    
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;       
        } else {
            _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;  
                                                                                            
            setTimeout(restartQuiz, 1000);                                                  
            return;                                                                            
        }
        checkCount();                                                                        
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        _checkBtn.disabled = false;                                                       
    }
}



function checkCount(){
    askedCount++;                                                                             
    setCount();                                                                            
    
    if (correctScore == 15) {                                                                 
    window.location.href = 'congratulations.html';                                           
    } else {
        setTimeout(function(){                                                               
            loadQuestion();
        }, 1000);
    }
}


function setCount(){
    _totalQuestion.textContent = totalQuestion;                                              
    _correctScore.textContent = correctScore;                                              
}


function restartQuiz(){
    correctScore = askedCount = 0;                                                            
    _playAgainBtn.style.display = "none";                                                    
    setCount();                                                                              
    loadQuestion();                                                                       
}
