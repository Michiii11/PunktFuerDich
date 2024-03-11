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
    console.log(m)
    for (const key in m) {
        if(m[key].name === "MICHI"){
            document.querySelector('.michi p').innerHTML = m[key].points
        }
        if(m[key].name === "YANIK"){
            document.querySelector('.yanik p').innerHTML = m[key].points
        }
    }
}

function increase(name){
    fetch("http://localhost:8080/api/entry/addpoints/" + name)
        .then(data => {
        })
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