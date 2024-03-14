let API_URL = "http://localhost:8080"
let SOCKET_URL = "ws://localhost:8080"

if(window.location.hostname !== "localhost"){
    API_URL = "http://138.2.152.216"
    SOCKET_URL = "ws://138.2.152.216"
}

let logInStatus = "out";
if(localStorage.getItem("punktfuerdich_loginstatus")) {
    logInStatus = localStorage.getItem("punktfuerdich_loginstatus")
}

document.addEventListener('DOMContentLoaded', () => {
    showOrHideLoginSmile()

    document.querySelector('#newEntry').addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            post('increase', event.currentTarget.value)
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
    let password = document.querySelector('#password').value

    hashString(password).then(passwordHash => {
        if(passwordHash === "") return ""

        let data = {"password": passwordHash}

        fetch(API_URL + "/api/entry/isvalidpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)})
            .then(response => {return response.json()})
            .then(data => {
                if(data === true){
                    setLogInStatus("in")
                    localStorage.setItem("punktfuerdich-passwordhash", passwordHash)
                } else{
                    setLogInStatus("out")
                }
            })
    });
}

function showOrHideLoginSmile(){
    localStorage.setItem("punktfuerdich_loginstatus", logInStatus)

    if(logInStatus === "in" || logInStatus === "guest"){
        document.querySelector('main').style.display = 'block'
        document.querySelector('.login').style.display = 'none'
    } else{
        document.querySelector('main').style.display = 'none'
        document.querySelector('.login').style.display = 'grid'
    }
}

async function hashString(input) {
    if(input === "") return ""

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
    let socket = new WebSocket(SOCKET_URL + "/socket/entry");

    socket.onopen = (m) => {
        updateHTML()
    }
    socket.onmessage = (m) => {
        updateHTML(JSON.parse(m.data))
    }
}

function updateHTML() {
    fetch(API_URL + "/api/entry/getall")
        .then(response => {return response.json()})
        .then(data => {
            document.querySelector('.leaderboard tbody').innerHTML = ""
            document.querySelector('.michi p').innerHTML = 0
            document.querySelector('.yanik p').innerHTML = 0
            for (const key in data) {
                if(data[key].name === "MICHI"){
                    document.querySelector('.michi p').innerHTML = data[key].points
                }
                if(data[key].name === "YANIK"){
                    document.querySelector('.yanik p').innerHTML = data[key].points
                }

            document.querySelector('.leaderboard tbody').innerHTML += `
                <tr class="entry">
                    <td class="left">
                        <button onclick="post('remove', '${data[key].name}')"><i class="fa-solid fa-trash"></i></button>
                        ${data[key].displayName}
                    </td>
                    <td class="right">
                        <button onclick="post('decrease', '${data[key].displayName}')">-</button>
                        <p class="points">${data[key].points}</p>
                        <button onclick="post('increase', '${data[key].displayName}')">+</button>
                    </td>
                </tr>`
            }
        })
}

function post(functionType, name){
    let data = {name: name}
    fetch(API_URL + "/api/entry/" + functionType, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)})
        .then(response => {updateHTML()})
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
        {scale: '.4', opacity: '1', borderRadius: '20%'},
        {scale: '1', opacity: '0.2', borderRadius: '50%'},
    ],{
        duration: 500,
        iterations: 1,
        easing: 'ease-out',
        fill: "forwards"
    })
}

document.addEventListener("keydown", (event) => {
    if(event.key === "Enter" || event.key === "Space"){
        document.querySelector('#newEntry').focus()
    }
})