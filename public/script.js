
function submitForm() {
    function logSubmit(event) {
    log.textContent = `Form Submitted!`;
    event.preventDefault();
  }
  const form = document.getElementById('training-form');
  const log = document.getElementById('log');
  form.addEventListener('submit', logSubmit);

  function submitForm() {
    // Get the first form with the name
    const frm = document.getElementsByName('trainingForm')[0];
    frm.submit(); // Submit
    frm.reset();  // Reset
    return false; // Prevent page refresh
 }
}
