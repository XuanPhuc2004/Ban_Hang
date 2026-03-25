import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// 🔥 INIT SOCKET
const socket = io({
  auth: {
    userId: document.querySelector(".chat").getAttribute("my-id"),
    fullName: document.querySelector(".chat").getAttribute("my-name"),
    roomChatId: document.querySelector(".chat").getAttribute("room-chat-id")
  }
});

// 🔥 SCROLL FUNCTION (dùng lại cho gọn)
const scrollToBottom = () => {
  const body = document.querySelector(".chat .inner-body");
  if (body) {
    setTimeout(() => {
      body.scrollTop = body.scrollHeight;
    }, 50);
  }
};

// 🔥 SCROLL KHI LOAD TRANG
window.onload = () => {
  scrollToBottom();
};

// =======================
// CLIENT SEND MESSAGE
// =======================
const formSendData = document.querySelector(".chat .inner-form");

if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();

    const content = e.target.elements.content.value;

    if (content.trim() !== "") {
      socket.emit("CLIENT_SEND_MESSAGE", content);

      e.target.elements.content.value = "";
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}

// =======================
// SERVER RETURN MESSAGE
// =======================
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector(".chat").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const boxTyping = document.querySelector(".chat .inner-list-typing");

  const div = document.createElement("div");
  let htmlFullName = "";
  let htmlContent = "";

  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    div.classList.add("inner-incoming");
  }

  if (data.content) {
    htmlContent = `<div class="inner-content">${data.content}</div>`;
  }

  div.innerHTML = `${htmlFullName} ${htmlContent}`;

  body.insertBefore(div, boxTyping);

  // 🔥 scroll sau khi render
  scrollToBottom();
});

// =======================
// TYPING (CLIENT)
// =======================
const inputChat = document.querySelector(
  ".chat .inner-form input[name='content']"
);

let timeoutTyping;

if (inputChat) {
  inputChat.addEventListener("keyup", () => {
    if (inputChat.value.trim() !== "") {
      socket.emit("CLIENT_SEND_TYPING", "show");

      clearTimeout(timeoutTyping);

      timeoutTyping = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
      }, 2000);
    } else {
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}

// =======================
// SERVER RETURN TYPING
// =======================
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if (elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    const bodyChat = document.querySelector(".chat .inner-body");

    if (data.type == "show") {
      const existTyping = elementListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );

      if (!existTyping) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);

        boxTyping.innerHTML = `
          <div class="inner-name">${data.fullName}</div>
          <div class="inner-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        `;

        elementListTyping.appendChild(boxTyping);

        // 🔥 scroll khi có typing
        scrollToBottom();
      }
    } else {
      const boxTypingRemove = elementListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );

      if (boxTypingRemove) {
        elementListTyping.removeChild(boxTypingRemove);
      }
    }
  });
}

// =======================
// EMOJI + TOOLTIP
// =======================
const buttonIcon = document.querySelector(".button-icon");

if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");

  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}

const emojiPicker = document.querySelector("emoji-picker");

if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  );

  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;

    inputChat.value += icon;

    const end = inputChat.value.length;
    inputChat.setSelectionRange(end, end);
    inputChat.focus();

    // 🔥 trigger typing khi chọn emoji
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeoutTyping);
    timeoutTyping = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 2000);
  });
}
