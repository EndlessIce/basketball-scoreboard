// GENERAL VARIABLES
const minValue = 0
const maxValue = 59

// POINTS AND FOULS VARIABLES
const maxPtsValue = 999
const maxFoulsValue = 4
const error = document.getElementById("error") // ELEMENT WITH TEXT OF ERROR

// TIME VARIABLES
const btnStart = document.getElementById("btn-start")
const btnPause = document.getElementById("btn-pause")
const btnReset = document.getElementById("btn-reset")
const btnSet = document.getElementById("btn-set")
const inputMinutes = document.getElementById("minutes")
const inputSeconds = document.getElementById("seconds")
const timeDisplay = document.getElementById("time")
const maxMinutesValue = parseInt(inputMinutes.value)
const maxSecondsValue = maxValue
let countMinutes
let countSeconds
let timeInterval = minValue

// QUARTER VARIABLES
const minQuarterValue = 1
const maxQuarterValue = 4
let countQuarter = minQuarterValue
const displayQuarter = document.getElementById("quarter")
displayQuarter.textContent = countQuarter

// NEW GAME BUTTON
const btnNewGame = document.getElementById("new-game")

// CALL FUNCTIONS ON BUTTON CLICK
for (button of document.querySelectorAll(".manage-btn")) {
    button.addEventListener("click", managePtsAndFouls)
}
for (button of document.querySelectorAll(".time-btn")) {
    button.addEventListener("click", manageTimeAndQuarter)
}
btnNewGame.addEventListener("click", newGame)

// COUNT POINTS/FOULS
function managePtsAndFouls(event) {
    // BUTTONS AND THEIR DATA ATTRIBUTES
    const button = event.currentTarget
    const {diff, team, type, reset, title} = button.dataset
    // TARGET PROPER DISPLAY ELEMENT
    const displayElement = document.querySelector(`#${type}-${team}`)
    // ADD/SUBTRACT POINTS/FOULS
    let count = Number(displayElement.textContent)
    count += Number(diff)
    // PUT NEW VALUE FOR POINTS/FOULS INTO PROPER DISPLAY OR RESET DISPLAY
    reset === "reset"
        // IF BUTTON IS RESET BUTTON
        ? type === "points"
            ? team === "home"
                ? (count = minValue, displayElement.textContent = count.toString().padStart(3, '0'), error.textContent = "")
                : (count = minValue, displayElement.textContent = count.toString().padStart(3, '0'), error.textContent = "")
            : team === "home"
                ? (count = minValue, displayElement.textContent = count.toString(), error.textContent = "")
                : (count = minValue, displayElement.textContent = count.toString(), error.textContent = "")
        // IF BUTTON IS NOT RESET BUTTON
        : type === "points"
            ? count > maxPtsValue
                ? (count = maxPtsValue, error.textContent = `Max score is ${maxPtsValue}!`)
                : count < minValue
                    ? (count = minValue, error.textContent = `Min score is ${minValue}!`)
                    : (displayElement.textContent = count.toString().padStart(3, '0'), error.textContent = "")
            : count > maxFoulsValue
                ? (count = maxFoulsValue, error.textContent = `Max number of fouls is ${maxFoulsValue}!`)
                : count < minValue
                    ? (count = minValue, error.textContent = `Min number of fouls is ${minValue}!`)
                    : (displayElement.textContent = count.toString(), error.textContent = "") 
    // DEFINE DISPLAYS AND HEADINGS FOR HIGHLIGHTING
    const displayGuest = document.querySelector(`#${type}-guest`)
    const displayHome = document.querySelector(`#${type}-home`)
    const headingGuest = document.querySelector(`#${title}-${type}-guest`)
    const headingHome = document.querySelector(`#${title}-${type}-home`)
    // HIGHLIGHT "TEAM FOULS" IF NUMBER OF FOULS REACHES MAX VALUE
    type === "fouls"
        ? team === "home"
            ? count >= maxFoulsValue
                ? headingHome.classList.add("color-highlight")
                : headingHome.classList.remove("color-highlight")     
            : count >= maxFoulsValue 
                ? headingGuest.classList.add("color-highlight")
                : headingGuest.classList.remove("color-highlight")
        : null
    // HIGHLIGHT LEADER
    type === "points"
        ? team === "home"
            ? count > Number(displayGuest.textContent)
                ? (headingHome.classList.add("color-highlight"), headingGuest.classList.remove("color-highlight"))
                : count < Number(displayGuest.textContent)
                    ? (headingHome.classList.remove("color-highlight"), headingGuest.classList.add("color-highlight"))
                    : (headingHome.classList.remove("color-highlight"), headingGuest.classList.remove("color-highlight"))
            : count > Number(displayHome.textContent)
                ? (headingGuest.classList.add("color-highlight"), headingHome.classList.remove("color-highlight"))
                : count < Number(displayHome.textContent)
                    ? (headingGuest.classList.remove("color-highlight"), headingHome.classList.add("color-highlight"))
                    : (headingGuest.classList.remove("color-highlight"), headingHome.classList.remove("color-highlight"))
        : null
}

// TIME COUNTDOWN AND CURRENT QUARTER
function manageTimeAndQuarter(event) { 
    const countDown = () => {
        if (countMinutes > minValue) {
            if (countSeconds > minValue) {
                countSeconds--
                timeDisplay.textContent = countMinutes.toString().padStart(2, '0') + ":" + countSeconds.toString().padStart(2, '0')
            } else {
                countMinutes--
                countSeconds = maxSecondsValue
                timeDisplay.textContent = countMinutes.toString().padStart(2, '0') + ":" + countSeconds.toString().padStart(2, '0')
            }     
        } else if (countSeconds > minValue) {
            countSeconds--
            timeDisplay.textContent = countMinutes.toString().padStart(2, '0') + ":" + countSeconds.toString().padStart(2, '0')
        } else if (countQuarter < maxQuarterValue) {
            countMinutes = minValue
            countSeconds = minValue
            timeDisplay.textContent = countMinutes.toString().padStart(2, '0') + ":" + countSeconds.toString().padStart(2, '0')
            countQuarter++
            displayQuarter.textContent = countQuarter.toString()
            clearInterval(timeInterval) 
            timeInterval = minValue
            button.removeAttribute("disabled")
        } else {
            countMinutes = minValue
            countSeconds = minValue
            timeDisplay.textContent = countMinutes.toString().padStart(2, '0') + ":" + countSeconds.toString().padStart(2, '0')
            countQuarter = maxQuarterValue
            displayQuarter.textContent = countQuarter.toString()
            clearInterval(timeInterval)
            timeInterval = minValue
            button.removeAttribute("disabled")
        }
    }
    
    if (event.currentTarget === btnReset) {
        clearInterval(timeInterval)
        timeInterval = minValue
        countMinutes = minValue
        countSeconds = minValue
        timeDisplay.textContent = countMinutes.toString().padStart(2, '0') + ":" + countSeconds.toString().padStart(2, '0')
        btnStart.removeAttribute("disabled")
    } else if (event.currentTarget === btnPause && timeDisplay.textContent !== "00:00") {
        clearInterval(timeInterval)
        timeInterval = minValue
        timeDisplay.textContent = countMinutes.toString().padStart(2, '0') + ":" + countSeconds.toString().padStart(2, '0')
        btnStart.removeAttribute("disabled")        
    } else if (event.currentTarget === btnStart && timeDisplay.textContent !== "00:00") {
        timeInterval = setInterval(countDown, 1000)
        btnStart.setAttribute("disabled", "true")      
    } else if (event.currentTarget === btnSet && !inputMinutes.value.match(/\D/) && !inputMinutes.value.match(/\D/) && inputMinutes.value <= maxValue && inputMinutes.value >= minValue && inputSeconds.value <= maxValue && inputSeconds.value >= minValue) {
        
        if (inputMinutes.value === "") {
            inputMinutes.value = minValue 
        }
        
        if (inputSeconds.value === "") {
            inputSeconds.value = minValue
        }
        
        timeDisplay.textContent = inputMinutes.value.padStart(2, '0') + ":" + inputSeconds.value.toString().padStart(2, '0')
        countMinutes = parseInt(inputMinutes.value)
        countSeconds = parseInt(inputSeconds.value)
        btnStart.removeAttribute("disabled")
        clearInterval(timeInterval)
    }
}

// NEW GAME
function newGame() {
    clearInterval(timeInterval)
    timeInterval = minValue
    btnStart.removeAttribute("disabled")
    count = minValue
    countQuarter = minQuarterValue
    displayQuarter.textContent = countQuarter.toString()
    document.getElementById("points-home").textContent = count.toString().padStart(3, '0')
    document.getElementById("points-guest").textContent = count.toString().padStart(3, '0')
    document.getElementById("fouls-home").textContent = count.toString()
    document.getElementById("fouls-guest").textContent = count.toString()
    document.getElementById("title-points-home").classList.remove("color-highlight")
    document.getElementById("title-points-guest").classList.remove("color-highlight")
    document.getElementById("title-fouls-home").classList.remove("color-highlight")
    document.getElementById("title-fouls-guest").classList.remove("color-highlight")
    inputMinutes.value = ""
    inputSeconds.value = ""
    countMinutes = minValue
    countSeconds = minValue 
    timeDisplay.textContent = countMinutes.toString().padStart(2, '0') + ":" + countSeconds.toString().padStart(2, '0')
}
