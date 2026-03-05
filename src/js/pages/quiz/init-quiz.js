export function initQuiz() {
  const quiz = document.getElementById("quiz");
  if (!quiz) return;

  const form = document.getElementById("quiz-form");
  const steps = quiz.querySelectorAll(".quiz__step");

  const currentEl = document.getElementById("quiz-current");
  const totalEl = document.getElementById("quiz-total");

  let currentStep = 0;
  const totalSteps = steps.length;

  totalEl.textContent = totalSteps;


    const savedData = localStorage.getItem("quizData");
    if (savedData) {
    const parsed = JSON.parse(savedData);

    Object.entries(parsed).forEach(([key, value]) => {
        const field = form.elements[key];
        if (!field) return;

        if (field.type === "radio") {
        const radio = form.querySelector(`input[name="${key}"][value="${value}"]`);
        if (radio) radio.checked = true;
        } else {
        field.value = value;
        }
    });
    }

  function showStep(index) {
    steps.forEach(step => step.classList.remove("active"));
    steps[index].classList.add("active");

    currentStep = index;
    currentEl.textContent = index + 1;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateStep(index) {
    const inputs = steps[index].querySelectorAll("input");

    for (let input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        return false;
      }
    }

    return true;
  }

  function nextStep() {
    if (!validateStep(currentStep)) return;

    if (currentStep < totalSteps - 1) {
      showStep(currentStep + 1);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      showStep(currentStep - 1);
    }
  }


  quiz.querySelectorAll(".quiz-next").forEach(btn => {
    btn.addEventListener("click", nextStep);
  });

  quiz.querySelectorAll(".quiz-back").forEach(btn => {
    btn.addEventListener("click", prevStep);
  });

  quiz.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener("click", () => {
      setTimeout(() => {
        nextStep();
      }, 200);
    });
  });
  
  quiz.querySelectorAll('input[type="text"], input[type="email"]').forEach(input => {
  const button = input.closest('.quiz__answer-input')?.querySelector('.quiz-next');
  
  if (!button) return; 

  button.disabled = true;

  input.addEventListener('input', () => {
    button.disabled = input.value.trim().length === 0;
  });
});

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    const data = Object.fromEntries(new FormData(form).entries());

    localStorage.setItem("quizData", JSON.stringify(data));

    console.log("Quiz result:", data);

    window.location.href = "./personal-pack.html";
  });
}