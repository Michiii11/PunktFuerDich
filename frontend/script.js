let michiCount = 0;
let yanikCount = 0;

function increaseMichi(){
    let counter = document.querySelector('.michi')
    updateCounter(counter, ++michiCount)
}

function increaseYanik(){
    let counter = document.querySelector('.yanik')
    updateCounter(counter, ++yanikCount)
}

function updateCounter(element, count){
    element.querySelector("p").innerHTML = count
    element.animate([
        {transform: 'scale(1)'},
        {transform: 'scale(0.98)'},
        {transform: 'scale(1)'}
    ],{
        duration: 300,
        iterations: 1,
        easing: 'ease-in'
    })
    element.querySelector("p").animate([
        {transform: 'scale(1)'},
        {transform: 'scale(0.9)'},
        {transform: 'scale(1.02)'},
        {transform: 'scale(1)'}
    ],{
        duration: 200,
        iterations: 1,
        easing: 'ease-in'
    })
}