let API_URL = "http://localhost:8080"
let SOCKET_URL = "ws://localhost:8080"

if(window.location.hostname !== "localhost"){
    API_URL = "https://punktfuerdich.at"
    SOCKET_URL = "wss://punktfuerdich.at"
}

let logInStatus = "out"
let passwordHash = ""
let isPasswordValid = false

let hoveredElem = ""

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem("punktfuerdich_loginstate")) {
        setLogInStatus(localStorage.getItem("punktfuerdich_loginstate"))
    }
    if(localStorage.getItem("punktfuerdich_passwordhash")) {
        passwordHash = localStorage.getItem("punktfuerdich_passwordhash")
    }

    showOrHideLogin()

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

    isPasswordValid = false
    if(logInStatus === "out" || logInStatus === "guest") {
        passwordHash = ""
        localStorage.setItem("punktfuerdich_passwordhash", passwordHash)
    } else if(logInStatus === "in"){
        passwordHash = localStorage.getItem("punktfuerdich_passwordhash")
        isPasswordValid = true
    }

    document.querySelector('#password').value = ""
    showOrHideLogin()
    updateHTML()
}

function validatePassword(){
    let passwordInput = document.querySelector('#password')

    hashString(passwordInput.value).then(hash => {
        if(hash === "") return ""

        let data = {"password": hash}

        fetch(API_URL + "/api/entry/isvalidpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)})
            .then(response => {return response.json()})
            .then(data => {
                if(data === true){
                    localStorage.setItem("punktfuerdich_passwordhash", hash)
                    setLogInStatus("in")
                } else{
                    setLogInStatus("out")
                    passwordInput.style.backgroundColor = "rgba(255, 0, 0, 0.2)"
                    setTimeout(() => {
                        passwordInput.style.backgroundColor = "rgba(255, 0, 0, 0)"
                    },300)
                }
            })
    });
}

function showOrHideLogin(){
    localStorage.setItem("punktfuerdich_loginstate", logInStatus)

    if(logInStatus === "in" || logInStatus === "guest"){
        document.querySelector('main').style.display = 'block'
        document.querySelector('.login').style.display = 'none'
    } else{
        document.querySelector('main').style.display = 'none'
        document.querySelector('.login').style.display = 'grid'
        document.querySelector('#password').focus()
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
        return "";
    }
}

createSocketConnection()
function createSocketConnection() {
    let socket = new WebSocket(SOCKET_URL + "/socket/entry");

    socket.onopen = (m) => {
        fetch(API_URL + "/api/entry/getall")
            .then(response => {return response.json()})
            .then(data => {
                updateHTML(data)
            })
    }
    socket.onmessage = (m) => {
        updateHTML(JSON.parse(m.data))
    }
}

function updateHTML(data) {
    if(hoveredElem) {
        updateSingleElement(data, hoveredElem)
    } else {
        document.querySelector('.michi p').innerHTML = 0
        document.querySelector('.yanik p').innerHTML = 0

        let tbody = ""
        for (const key in data) {
            if(data[key].name === "MICHI"){
                document.querySelector('.michi p').innerHTML = data[key].points
            }
            if(data[key].name === "YANIK"){
                document.querySelector('.yanik p').innerHTML = data[key].points
            }

            tbody += `
            <tr class="entry">
                <td class="left">
                    ${isPasswordValid ? `<button onclick="post('remove', '${data[key].name}')" class="remove"><i class="fa-solid fa-trash"></i></button>` : ""}
                    <span>${data[key].displayName}</span>
                </td>
                <td class="right">
                    ${isPasswordValid ? `<button onclick="post('decrease', '${data[key].displayName}');">-</button>` : ""}
                    <p class="points">${data[key].points}</p>
                    ${isPasswordValid ? `<button onclick="post('increase', '${data[key].displayName}');">+</button>` : ""}
                </td>
            </tr>`
        }

        document.querySelector('.leaderboard tbody').innerHTML = tbody

        document.querySelectorAll('.entry .right button').forEach(elem => {
            elem.addEventListener("mouseover", (event) => {
                hoveredElem = event.currentTarget
            })
            elem.addEventListener("mouseleave", (event) => {
                hoveredElem = ""
                fetch(API_URL + "/api/entry/getall")
                    .then(response => {return response.json()})
                    .then(data => {
                        updateHTML(data)
                    })
            })
        })
    }
}

function updateSingleElement(data, elem){
    elem = elem.closest(".entry")

    document.querySelector('.michi p').innerHTML = 0
    document.querySelector('.yanik p').innerHTML = 0

    const michiObject = data.find(item => item.name === "MICHI");
    if(michiObject) document.querySelector('.michi p').innerHTML = michiObject.points

    const yanikObject = data.find(item => item.name === "YANIK");
    if(yanikObject) document.querySelector('.yanik p').innerHTML = yanikObject.points

    const singleObject = data.find(item => item.displayName === elem.querySelector('.left span').innerHTML)
    if(singleObject) elem.querySelector('.points').innerHTML = singleObject.points
}

function post(functionType, name){
    let data = {name: name, password: passwordHash}
    fetch(API_URL + "/api/entry/" + functionType, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)})
        .then(response => {})
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
        {scale: '1', opacity: '0', borderRadius: '50%'},
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