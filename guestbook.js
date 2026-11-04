document.querySelectorAll(".guestbook-form").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector(".guestbook-submit");
    const status = form.querySelector(".guestbook-status");
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = form.dataset.sending || "Sending …";
    status.textContent = "";
    status.dataset.state = "";
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(form)
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Submission failed");
      form.reset();
      status.textContent = form.dataset.success || "Thank you! Your message has been received.";
      status.dataset.state = "success";
    } catch (error) {
      status.textContent = form.dataset.error || "Could not send your message. Please try again.";
      status.dataset.state = "error";
    } finally {
      button.disabled = false;
      button.innerHTML = original;
    }
  });
});
