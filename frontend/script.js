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
        {scale: '1'},
        {scale: '0.98'},
        {scale: '1'}
    ],{
        duration: 300,
        iterations: 1,
        easing: 'ease-in'
    })
    element.querySelector("p").animate([
        {scale: '1'},
        {scale: '0.9'},
        {scale: '1.02'},
        {scale: '1'}
    ],{
        duration: 200,
        iterations: 1,
        easing: 'ease-in'
    })

    let clickCircle = document.querySelector('.clickCircle')
    let elemBounds = element.getBoundingClientRect()
    clickCircle.style.top = elemBounds.top + window.scrollY + elemBounds.height/2 + "px"
    clickCircle.style.left = elemBounds.left + elemBounds.width/2 + "px"

    clickCircle.animate([
        {scale: '.3', opacity: '1'},
        {scale: '1', opacity: '0'},
    ],{
        duration: 500,
        iterations: 1,
        easing: 'ease-in',
        fill: "forwards"
    })
}