export function initQuiz() {
  const quiz = document.getElementById("quiz");
  if (!quiz) return;

  const form = document.getElementById("quiz-form");
  const steps = quiz.querySelectorAll(".quiz__step");
  let isTransitioning = false;
  const currentEl = document.getElementById("quiz-current");
  const totalEl = document.getElementById("quiz-total");

  let currentStep = 0;
  const totalSteps = steps.length;

  totalEl.textContent = totalSteps;

  const fieldsConfig = {
    firstName: /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s'-]{2,}$/,
    email: /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  };

  const savedData = localStorage.getItem("quizData");

  if (savedData) {
    const parsed = JSON.parse(savedData);

    Object.entries(parsed).forEach(([key, value]) => {
      const field = form.elements[key];
      if (!field) return;

      if (field.type === "radio") {
        const radio = form.querySelector(
          `input[name="${key}"][value="${value}"]`
        );
        if (radio) radio.checked = true;
      } else {
        field.value = value;
      }
    });
  }

  function showError(field) {
    field
      .closest(".quiz__answer-input")
      ?.classList.add("input-error");
  }

  function clearError(field) {
    field
      .closest(".quiz__answer-input")
      ?.classList.remove("input-error");
  }

  function validateField(field) {
    const value = field.value.trim();
    const regex = fieldsConfig[field.name];

    if (!value || (regex && !regex.test(value))) {
      showError(field);
      return false;
    }

    clearError(field);
    return true;
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

    let valid = true;

    inputs.forEach(input => {
      if (fieldsConfig[input.name]) {
        if (!validateField(input)) valid = false;
      } else if (input.type === "radio") {
        const group = steps[index].querySelectorAll(
          `input[name="${input.name}"]`
        );
        const checked = [...group].some(r => r.checked);

        if (!checked) {
          group[0].reportValidity();
          valid = false;
        }
      }
    });

    return valid;
  }

  function nextStep() {
    if (isTransitioning) return;
    if (!validateStep(currentStep)) return;

    isTransitioning = true;
    
    if (currentStep < totalSteps - 1) {
      showStep(currentStep + 1);
    }

    setTimeout(() => {
      isTransitioning = false;
    }, 200);
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
      const button =
        input.closest(".quiz__answer-input")?.querySelector(
          ".quiz-next"
        );

      if (!button) return;

      button.disabled = true;

      input.addEventListener("input", () => {
        const valid = validateField(input);
        button.disabled = !valid;
      });
    });

  form.addEventListener("submit", e => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    const data = Object.fromEntries(
      new FormData(form).entries()
    );

    localStorage.setItem("quizData", JSON.stringify(data));

    console.log("Quiz result:", data);

    window.location.href = "./personal-pack.html";
  });
}