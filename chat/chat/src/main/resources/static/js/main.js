"use strict";

var usernamePage = document.querySelector("#username-page");
var chatPage = document.querySelector("#chat-page");
var messageForm = document.querySelector("#messageForm");
var messageInput = document.querySelector("#message");
var messageArea = document.querySelector("#messageArea");
var connectingElement = document.querySelector(".connecting");

var stompClient = null;
var username = null;

var colors = [
  "#2196F3", "#32c787", "#00BCD4", "#ff5652",
  "#ffc107", "#ff85af", "#FF9800", "#39bbb0",
];

var id = sessionStorage.getItem("userId");

function fetchLoggedUserAndConnect() {
  fetch(`/user/buscarPorId/${id}`)
    .then((response) => {
      if (!response.ok) throw new Error("Usuário não autenticado");
      return response.json();
    })
    .then((data) => {
      username = data.username;
      usernamePage.classList.add("hidden");
      chatPage.classList.remove("hidden");
      connectToWebSocket();
    })
    .catch((error) => {
      console.error("Erro ao obter usuário logado:", error);
      connectingElement.textContent = "Erro ao autenticar usuário.";
      connectingElement.style.color = "red";
    });
}

function connectToWebSocket() {
  var socket = new SockJS("/ws");
  stompClient = Stomp.over(socket);
  stompClient.connect({}, onConnected, onError);
}

function onConnected() {
  console.log("✅ Conectado ao WebSocket!");
  stompClient.subscribe("/topic/public", onMessageReceived);

  stompClient.send("/app/chat.addUser", {}, JSON.stringify({
    sender: username,
    type: "JOIN"
  }));

  connectingElement.classList.add("hidden");
}

function onError(error) {
  console.error("Erro na conexão WebSocket:", error);
  connectingElement.textContent =
    "Não foi possível conectar ao servidor WebSocket. Recarregue a página para tentar novamente!";
  connectingElement.style.color = "red";
}

function sendMessage(event) {
  event.preventDefault(); // Evita reload da página

  var id = sessionStorage.getItem("userId");
  var messageContent = messageInput.value.trim();

  if (messageContent && stompClient) {
    var chatMessage = {
      sender: username,
      senderId: id,
      content: messageContent,
      type: "CHAT",
    };

    console.log("📤 Enviando mensagem:", chatMessage);
    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    messageInput.value = "";
  }
}

function onMessageReceived(payload) {
  var message = JSON.parse(payload.body);

  var messageElement = document.createElement("li");
  messageElement.classList.add("chat-message");
    console.log(message.senderId)
  fetch(`/user/buscarPorId/${message.senderId}`)
    .then(response => {
      if (!response.ok) throw new Error("Erro ao buscar dados do usuário");
      return response.json();
    })
    .then(data => {
      let avatarElement;

      console.log(data.foto)

      if (data.foto && data.foto.trim() !== "") {
        avatarElement = document.createElement("img");
        avatarElement.src = `data:image/jpeg;base64,${data.foto}`;
        avatarElement.alt = message.sender;
        avatarElement.classList.add("profile-avatar");
      } else {
        avatarElement = document.createElement("i");
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style["background-color"] = getAvatarColor(message.sender);
        avatarElement.style.color = "white";
        avatarElement.style.display = "flex";
        avatarElement.style.justifyContent = "center";
        avatarElement.style.alignItems = "center";
        avatarElement.style.width = "40px";
        avatarElement.style.height = "40px";
        avatarElement.style.borderRadius = "50%";
        avatarElement.style.textAlign = "center";
      }

      messageElement.appendChild(avatarElement);

      var usernameElement = document.createElement("a");
      usernameElement.href = `/perfil.html?id=${message.senderId}`;
      usernameElement.textContent = message.sender;
      usernameElement.style.color = "black";
      usernameElement.style.textDecoration = "none";
      usernameElement.style.fontWeight = "bold";
      usernameElement.style.marginLeft = "10px";
      messageElement.appendChild(usernameElement);

      var textElement = document.createElement("p");
      var messageText = document.createTextNode(message.content);
      textElement.appendChild(messageText);
      messageElement.appendChild(textElement);

      messageArea.appendChild(messageElement);
      messageArea.scrollTop = messageArea.scrollHeight;
    })
    .catch(error => {
      console.error("Erro ao buscar dados do usuário:", error);
    });
}

function getAvatarColor(messageSender) {
  var hash = 0;
  for (var i = 0; i < messageSender.length; i++) {
    hash = 31 * hash + messageSender.charCodeAt(i);
  }
  var index = Math.abs(hash % colors.length);
  return colors[index];
}

messageForm.addEventListener("submit", sendMessage, true);
window.addEventListener("load", fetchLoggedUserAndConnect);
