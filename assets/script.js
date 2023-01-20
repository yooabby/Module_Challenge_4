// elements
var questionsEl = document.querySelector("#questions");
var timerEl = document.querySelector("#time");
var choicesEl = document.querySelector("#choices");
var submitBtn = document.querySelector("#submit");
var startBtn = document.querySelector("#start");
var initialsEl = document.querySelector("#initials");
var feedbackEl = document.querySelector("#feedback");

// questions and answers
var questions = [
    {
      title: "Commonly used data types do NOT include:",
      choices: ["Strings", "Booleans", "Alerts", "Numbers"],
      answer: "Alerts"
    },
    {
      title: "The condition in an if/else statement is enclosed in:",
      choices: ["Quotes", "Parentheses", "Curly Brackets", "Square Brackets"],
      answer: "Parentheses"
    },
    {
      title: "Arrays in JavaScript can be used to store:",
      choices: ["Numbers and Strings", "Other Arrays", "Booleans", "All of the Above"],
      answer: "All of the Above"
    },
    {
      title: "String values must be enclosed within __________ when being assigned to variables:",
      choices: ["Commas", "Curly Brackets", "Quotes", "Parentheses"],
      answer: "Quotes"
    },
    {
      title:
        "A very useful tool used during development and debugging for printing content to the debugger is:",
      choices: ["JavaScript", "Terminal Bash", "for loops", "console.log"],
      answer: "console.log"
    },
  ];

// start quiz page
var currentQuestionIndex = 0;
var time = questions.length * 10;
var timerId;

function startQuiz() {
  // hide start screen
  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");
  // un-hide questions section
  questionsEl.removeAttribute("class");
  // start timer
  timerId = setInterval(clockTick, 1000);
  // show starting time
  timerEl.textContent = time;
  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];
  // update title with current question
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;
  // clear out any old question choices
  choicesEl.innerHTML = "";
  // loop over choices
  currentQuestion.choices.forEach(function(choice, i) {
    // create new button for each choice
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);
    choiceNode.textContent = i + 1 + ". " + choice;
    // attach click event listener to each choice
    choiceNode.onclick = questionClick;
    // display on the page
    choicesEl.appendChild(choiceNode);
  });
}

function questionClick() {
  // if user guessed wrong
  if (this.value !== questions[currentQuestionIndex].answer) {
    // penalize time
    time -= 10;
    if (time < 0) {
      time = 0;
    }
    // display new time on page
    timerEl.textContent = time;
    // wrong
    feedbackEl.textContent = "Wrong!";
    feedbackEl.style.color = "red";
    feedbackEl.style.fontSize = "200%";
    // correct
  } else {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "green";
    feedbackEl.style.fontSize = "200%";
  }
  // feedback
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);
  // next question
  currentQuestionIndex++;
  // time check
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

// end quiz page
function quizEnd() {
  // stop timer
  clearInterval(timerId);
  // show end screen
  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");
  // show final score
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;
  // hide questions section
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  // update time
  time--;
  timerEl.textContent = time;
  // if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
    // get value of input box
    var initials = initialsEl.value.trim();
    if (initials !== "") {
      // get saved scores from localstorage, or if not any, set to empty array
      var highscores =
        JSON.parse(window.localStorage.getItem("highscores")) || [];
      // format new score object for current user
      var newScore = {
        score: time,
        initials: initials
      };
      // save to localstorage
      highscores.push(newScore);
      window.localStorage.setItem("highscores", JSON.stringify(highscores));
      // redirect to next page
      window.location.href = "score.html";
    }
  }
  
  function checkForEnter(event) {
    if (event.key === "Enter") {
      saveHighscore();
    }
  }
  
  submitBtn.onclick = saveHighscore;
  startBtn.onclick = startQuiz;
  initialsEl.onkeyup = checkForEnter;
  
  // score page
  function printHighscores() {
      // either get scores from localstorage or set to empty array
      var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];
      // sort highscores by score property in descending order
      highscores.sort(function(a, b) {
        return b.score - a.score;
      });
      highscores.forEach(function(score) {
        // create li tag for each high score
        var liTag = document.createElement("li");
        liTag.textContent = score.initials + " - " + score.score;
        // display on page
        var olEl = document.getElementById("highscores");
        olEl.appendChild(liTag);
      });
    }
    
    function clearHighscores() {
      window.localStorage.removeItem("highscores");
      window.location.reload();
    }
    
    document.getElementById("clear").onclick = clearHighscores;
    
    printHighscores();