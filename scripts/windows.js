document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("start-button");
  const startMenu = document.getElementById("start-menu");

  // Toggle Start Menu
  startButton.addEventListener("click", function (event) {
    event.stopPropagation();
    startMenu.style.display = startMenu.style.display === "block" ? "none" : "block";
  });

  // Close Start Menu when clicking elsewhere
  document.addEventListener("click", function () {
    startMenu.style.display = "none";
  });

  // Open Windows from Desktop Icons
  document.querySelectorAll(".desktop-icon").forEach(icon => {
    icon.addEventListener("dblclick", function () {
      const windowId = this.dataset.window;
      const windowElement = document.getElementById(windowId);
      if (windowElement) {
        windowElement.style.display = "block";
        bringToFront(windowElement);
      }
    });
  });

  // Close Windows
  document.querySelectorAll(".close-button").forEach(button => {
    button.addEventListener("click", function () {
      this.closest(".window").style.display = "none";
    });
  });

  // Dragging Windows
  let draggedWindow = null;
  let offsetX, offsetY;

  document.querySelectorAll(".title-bar").forEach(titleBar => {
    titleBar.addEventListener("mousedown", function (event) {
      draggedWindow = this.closest(".window");
      offsetX = event.clientX - draggedWindow.offsetLeft;
      offsetY = event.clientY - draggedWindow.offsetTop;
      bringToFront(draggedWindow);
    });
  });

  document.addEventListener("mousemove", function (event) {
    if (draggedWindow) {
      draggedWindow.style.left = event.clientX - offsetX + "px";
      draggedWindow.style.top = event.clientY - offsetY + "px";
    }
  });

  document.addEventListener("mouseup", function () {
    draggedWindow = null;
  });

  function bringToFront(windowElement) {
    document.querySelectorAll(".window").forEach(win => win.style.zIndex = "1");
    windowElement.style.zIndex = "100";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Make internal links open in a window instead of navigating away
  document.querySelectorAll("a").forEach(link => {
    if (link.hostname === window.location.hostname) { // Ensure it's an internal link
      link.addEventListener("click", function (event) {
        event.preventDefault();
        openPageInWindow(this.href, this.innerText);
      });
    }
  });
});

// Function to open a new window with the page content
function openPageInWindow(url, title) {
  fetch(url)
    .then(response => response.text())
    .then(html => {
      let parser = new DOMParser();
      let doc = parser.parseFromString(html, "text/html");
      let content = doc.querySelector("[data-content-field='main-content']").innerHTML;

      let windowId = "window-" + Date.now();
      createNewWindow(windowId, title, content);
    })
    .catch(error => console.error("Error loading page:", error));
}

// Function to create a new draggable window
function createNewWindow(id, title, content) {
  let newWindow = document.createElement("div");
  newWindow.classList.add("window");
  newWindow.id = id;
  newWindow.innerHTML = `
    <div class="title-bar">
      <div class="title-bar-text">${title}</div>
      <div class="title-bar-controls">
        <button aria-label="Close" onclick="document.getElementById('${id}').remove()"></button>
      </div>
    </div>
    <div class="window-body">
      ${content}
    </div>
  `;
  
  document.getElementById("desktop").appendChild(newWindow);
  newWindow.style.display = "block";
  newWindow.style.top = "50px";
  newWindow.style.left = "100px";
  bringToFront(newWindow);
}

