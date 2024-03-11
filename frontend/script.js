document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#newEntry').addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            increase(event.currentTarget.value)
            event.currentTarget.value = ""
        }
    });
});

createSocketConnection()
function createSocketConnection() {
    let socket = new WebSocket("ws://localhost:8080/socket/entry");

    socket.onopen = (m) => {
        fetch("http://localhost:8080/api/entry/getall")
            .then(response => {return response.json()})
            .then(data => {
                updateHTML(data)
            })
    }
    socket.onmessage = (m) => {
        updateHTML(JSON.parse(m.data))
    }
}

function updateHTML(m) {
    document.querySelector('.leaderboard').innerHTML = ""
    for (const key in m) {
        if(m[key].name === "MICHI"){
            document.querySelector('.michi p').innerHTML = m[key].points
        }
        if(m[key].name === "YANIK"){
            document.querySelector('.yanik p').innerHTML = m[key].points
        }

        document.querySelector('.leaderboard').innerHTML += `<div class="entry">
            <p class="name">${m[key].displayName}</p>
            <button onclick="increase('${m[key].displayName}')">+</button>
            <p class="points">${m[key].points}</p>
            <button onclick="decrease('${m[key].displayName}')">-</button>
        </div>`
    }

    document.querySelector('#newEntry').focus()
}

function increase(name){
    fetch("http://localhost:8080/api/entry/increase/" + name)
        .then(data => {})
}

function decrease(name) {
    fetch("http://localhost:8080/api/entry/decrease/" + name)
        .then(data => {})
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