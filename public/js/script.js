// show alert
const showAlert = document.querySelector("[show-alert]");

if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time")) || 3000;
  const closeAlert = showAlert.querySelector("[close-alert]");

  const hideAlert = () => {
    showAlert.classList.add("alert-hidden");
  };

  setTimeout(hideAlert, time);

  if (closeAlert) {
    closeAlert.addEventListener("click", hideAlert);
  }
}