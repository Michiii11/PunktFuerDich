let logInStatus = "out";
if(localStorage.getItem("punktfuerdich_loginstatus")) {
    logInStatus = localStorage.getItem("punktfuerdich_loginstatus")
}

document.addEventListener('DOMContentLoaded', () => {
    showOrHideLoginSmile()

    document.querySelector('#newEntry').addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            increase(event.currentTarget.value)
            event.currentTarget.value = ""
        }
    });

    document.querySelector('#password').addEventListener("keydown", (event) => {
        if (event.key === "Enter"){
            validatePassword()
        }
    })
});

function setLogInStatus(status){
    logInStatus = status
    
    document.querySelector('#password').value = ""
    showOrHideLoginSmile()
}

function validatePassword(){
    let value = document.querySelector('#password').value
    hashString(value).then(result => {
        let data = {"password": result}
        fetch("http://localhost:8080/api/entry/isvalidpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)})
            .then(response => {return response.json()})
            .then(data => {
                if(data){
                    setLogInStatus(result)
                } else{
                    setLogInStatus("out")
                }
            })
    });
}

function showOrHideLoginSmile(){
    localStorage.setItem("punktfuerdich_loginstatus", logInStatus)

    if(logInStatus === "k4WG5VMu0VTZwFNwGL++Ya5ezg6Z+cbl/hHjEt4EuYc=" || logInStatus === "guest"){
        document.querySelector('main').style.display = 'block'
        document.querySelector('.login').style.display = 'none'
    } else{
        document.querySelector('.login').style.display = 'block'
        document.querySelector('main').style.display = 'none'
    }
}

async function hashString(input) {
    try {
        // Convert the string to an array buffer
        const encoder = new TextEncoder();
        const data = encoder.encode(input);

        // Hash the array buffer using SHA-256
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);

        // Convert the hash buffer to a Base64 encoded string
        const base64Hash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));

        return base64Hash;
    } catch (error) {
        console.error(error);
        return null;
    }
}

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
    document.querySelector('.leaderboard tbody').innerHTML = ""
    for (const key in m) {
        if(m[key].name === "MICHI"){
            document.querySelector('.michi p').innerHTML = m[key].points
        }
        if(m[key].name === "YANIK"){
            document.querySelector('.yanik p').innerHTML = m[key].points
        }

        document.querySelector('.leaderboard tbody').innerHTML += `
        <tr class="entry">
            <td class="left">${m[key].displayName}</td>
            <td class="right">
                <button onclick="decrease('${m[key].displayName}')">-</button>
                <p class="points">${m[key].points}</p>
                <button onclick="increase('${m[key].displayName}')">+</button>
            </td>
        </tr>`
    }
}

function increase(name){
    fetch("http://localhost:8080/api/entry/increase/" + name)
        .then(data => {})
}

function decrease(name) {
    fetch("http://localhost:8080/api/entry/decrease/" + name)
        .then(data => {})
}

function buttonAnimation(button){
    button.animate([
        {scale: '1'},
        {scale: '0.98'},
        {scale: '1'}
    ],{
        duration: 300,
        iterations: 1,
        easing: 'ease-in'
    })
    button.querySelector("p").animate([
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
    let buttonBounds = button.getBoundingClientRect()
    clickCircle.style.top = buttonBounds.top + window.scrollY + buttonBounds.height/2 + "px"
    clickCircle.style.left = buttonBounds.left + buttonBounds.width/2 + "px"

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

document.addEventListener("keydown", (event) => {
    if(event.key === "Enter" || event.key === "Space"){
        document.querySelector('#newEntry').focus()
    }
})