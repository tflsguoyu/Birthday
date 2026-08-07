const recipient = "tflsguoyu@gmail.com";
const endpoint = `https://formsubmit.co/ajax/${recipient}`;

const backdrop = document.querySelector("#modal-backdrop");
const openButton = document.querySelector("#open-rsvp");
const mobileOpenButton = document.querySelector("#open-rsvp-mobile");
const closeButton = document.querySelector("#close-rsvp");
const doneButton = document.querySelector("#done-rsvp");
const form = document.querySelector("#rsvp-form");
const formState = document.querySelector("#form-state");
const successState = document.querySelector("#success-state");
const errorMessage = document.querySelector("#form-error");
const submitButton = document.querySelector("#submit-rsvp");
const nameInput = document.querySelector("#guest-name");

function setModal(open) {
  backdrop.hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
  if (open) window.setTimeout(() => nameInput.focus(), 50);
}

openButton.addEventListener("click", () => setModal(true));
mobileOpenButton.addEventListener("click", () => setModal(true));
closeButton.addEventListener("click", () => setModal(false));
doneButton.addEventListener("click", () => setModal(false));
backdrop.addEventListener("mousedown", (event) => {
  if (event.target === backdrop) setModal(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !backdrop.hidden) setModal(false);
});

document.querySelectorAll("[data-counter]").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.counter;
    const input = document.querySelector(`#${id}`);
    const output = document.querySelector(`#${id}-output`);
    const next = Math.max(0, Math.min(12, Number(input.value) + Number(button.dataset.change)));
    input.value = String(next);
    output.textContent = String(next);
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const adults = Number(document.querySelector("#adults").value);
  const children = Number(document.querySelector("#children").value);
  if (adults + children < 1) {
    errorMessage.textContent = "Please include at least one guest.";
    return;
  }

  errorMessage.textContent = "";
  submitButton.disabled = true;
  submitButton.textContent = "Sending…";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });
    const result = await response.json();
    if (!response.ok || result.success === false) throw new Error();

    const name = nameInput.value.trim();
    document.querySelector("#confirmation-copy").textContent = `Thanks, ${name}. Your RSVP for ${adults} ${adults === 1 ? "adult" : "adults"} and ${children} ${children === 1 ? "child" : "children"} has been sent.`;
    formState.hidden = true;
    successState.hidden = false;
  } catch {
    errorMessage.textContent = "We couldn’t send your RSVP. Please check your connection and try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send RSVP";
  }
});
