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
// 🔄 Восстановление данных
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

  // NEXT buttons (текстовые шаги)
  quiz.querySelectorAll(".quiz-next").forEach(btn => {
    btn.addEventListener("click", nextStep);
  });

  // BACK buttons
  quiz.querySelectorAll(".quiz-back").forEach(btn => {
    btn.addEventListener("click", prevStep);
  });

  // 🔥 Авто-переход для radio
  quiz.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener("click", () => {
      // Небольшая задержка чтобы пользователь увидел выбор
      setTimeout(() => {
        nextStep();
      }, 200);
    });
  });
  
  quiz.querySelectorAll('input[type="text"], input[type="email"]').forEach(input => {
  // Ищем кнопку внутри того же .quiz__answer-input
  const button = input.closest('.quiz__answer-input')?.querySelector('.quiz-next');
  
  if (!button) return; // если кнопка не найдена - выходим

  // изначально выключаем кнопку
  button.disabled = true;

  input.addEventListener('input', () => {
    button.disabled = input.value.trim().length === 0;
  });
});

  // Submit (если добавишь финальную кнопку)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    const data = Object.fromEntries(new FormData(form).entries());

    localStorage.setItem("quizData", JSON.stringify(data));

    console.log("Quiz result:", data);
  });
}