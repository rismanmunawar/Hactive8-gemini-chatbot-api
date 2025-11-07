document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();

    if (userMessage === "") {
      return;
    }

    // Add user's message to chat box
    appendMessage("user", userMessage);
    userInput.value = "";

    // Show "Thinking..." message
    const thinkingMessage = appendMessage("bot", "Thinking...");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", text: userMessage }],
        }),
      });

      if (!response.ok) {
        thinkingMessage.textContent = "Failed to get response from server.";
        return;
      }

      const data = await response.json();

      if (data.result) {
        thinkingMessage.textContent = data.result;
      } else {
        thinkingMessage.textContent = "Sorry, no response received.";
      }
    } catch (error) {
      console.error("Error:", error);
      thinkingMessage.textContent = "Failed to get response from server.";
    }
  });

  function appendMessage(role, content) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", `${role}-message`);
    messageElement.textContent = content;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageElement;
  }
});
