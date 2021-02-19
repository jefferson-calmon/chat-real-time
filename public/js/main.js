var socket = io('/');
var info = {
    numberMessages: 0,
    connected: 0
}
var author = ''


socket.on('receivedMessage', function(message){
    renderMessage(message)
});

socket.on('previousMessages', function(messages){
    for (message of messages){
        renderMessage(message)
    };

    renderConnectionsInfo()

});

socket.on('ConnectionsInfo', function(connectionsInfo){
    info.connected = connectionsInfo.connections._connections;
    renderConnectionsInfo();
})

getAuthor()
        
function getAuthor(){
    let user = localStorage.getItem('user')

    if(user){
        author = user
    }
    else if(!user){
        toggleBoxForNewUser('tog')
    }
}

function renderMessage(message) {
    $('.messages').append(`<div class="message"><div class="user-image"><i class="fal fa-user-circle"></i></div><div><h2>${message.author}<span>${message.time}</span></h2> <p aria-expanded="true">${message.message}</p></div></div>`)

    info.numberMessages += 1;
    moveScroll()
    renderConnectionsInfo()
};

function renderConnectionsInfo(){
    $('#online').html(`<h3><i class="fas fa-circle"></i> ${info.connected} Online</h3>`)

    $('#messages-received').html(`<h3 id="messages-received"><i class="fad fa-inbox-in"></i> ${info.numberMessages} Mensagens</h3>`)
}

function toggleBoxForNewUser(met){
    if(met === 'tog'){
        let input = document.getElementById('enter-user');
        input.classList.toggle('active');
        input.focus()
    }
    if(met === 'get'){
        let newUser = document.getElementById('input-user').value;

        if (newUser.length < 4 ){
            alert('Erro ao cadastrar usuário, tente um nome mais longo.')
            return null
        }
        
        localStorage.setItem('user', newUser)
        author = newUser
        toggleBoxForNewUser('tog')
    }
}

function moveScroll(){
    var objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
}

function Submit(event){
    event.preventDefault();

    getAuthor()

    var message = document.querySelector('input[name=message]').value;
    $('#input-message').val('')

    if(message.length){
        let now = new Date
        let time = now.getHours() + ':' + now.getMinutes()
        if (now.getHours() > 12){
            time += 'pm';
        }
        else{
            time += 'am';
        };

        var messageObject = {
            author,
            message,
            time,
        }

        renderMessage(messageObject)
        moveScroll()

        socket.emit('sendMessage', messageObject);
    } 
};

function handleToggleLeftBar(){
    const bar = document.querySelector('#left-bar');
    const chat = document.querySelector('#chat-area');
    const icon = document.querySelector('#toggleInfo');

    bar.classList.toggle('active');
    chat.classList.toggle('active');

    icon.className = icon.className === 'fal fa-info-circle' ? 'fal fa-times' : 'fal fa-info-circle';
}