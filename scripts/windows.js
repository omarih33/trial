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
