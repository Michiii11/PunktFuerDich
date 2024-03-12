let isLoggedIn = false;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#newEntry').addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            increase(event.currentTarget.value)
            event.currentTarget.value = ""
        }
    });

    document.querySelector('#password').addEventListener("keydown", (event) => {
        if (event.key === "Enter"){
            fetch("http://localhost:8080/api/entry/isvalidpassword/" + event.currentTarget.value)
                .then(response => {return response.json()})
                .then(data => {
                    console.log(data)
                    if(data){
                        isLoggedIn = true;
                    } else{
                        isLoggedIn = false;
                    }
                    document.querySelector('.feedback').innerHTML = isLoggedIn
                })
        }
    })
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