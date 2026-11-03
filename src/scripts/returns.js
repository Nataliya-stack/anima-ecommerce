// src/scripts/returns.js

function initReturnsForm() {
  const formStep1 = document.getElementById('returns-form-step-1');
  const formStep2 = document.getElementById('returns-form-step-2');
  const successMsg = document.getElementById('returns-success-msg');
  const finalForm = document.getElementById('final-returns-form');
  const stepperWrapper = document.getElementById('stepper-wrapper');
  
  const step1Indicator = document.getElementById('step-1-indicator');
  const step2Indicator = document.getElementById('step-2-indicator');
  const backBtn = document.getElementById('back-to-step-1');

  // Если элементов нет на текущей странице, выходим
  if (!formStep1 || !formStep2) return;

  // Шаг 1 -> Шаг 2
  formStep1.onsubmit = (e) => {
    e.preventDefault();
    formStep1.classList.add('hidden');
    formStep2.classList.remove('hidden');

    step1Indicator?.classList.remove('border-white', 'text-white');
    step1Indicator?.classList.add('border-neutral-700', 'text-neutral-500');
    
    step2Indicator?.classList.remove('border-neutral-700', 'text-neutral-500');
    step2Indicator?.classList.add('border-white', 'text-white');
  };

  // Шаг 2 -> Шаг 1
  if (backBtn) {
    backBtn.onclick = () => {
      formStep2.classList.add('hidden');
      formStep1.classList.remove('hidden');

      step2Indicator?.classList.remove('border-white', 'text-white');
      step2Indicator?.classList.add('border-neutral-700', 'text-neutral-500');

      step1Indicator?.classList.remove('border-neutral-700', 'text-neutral-500');
      step1Indicator?.classList.add('border-white', 'text-white');
    };
  }

  // Отправка -> Финальный экран
  if (finalForm) {
    finalForm.onsubmit = (e) => {
      e.preventDefault();
      formStep2.classList.add('hidden');
      stepperWrapper?.classList.add('hidden'); // Скрываем степпер
      successMsg?.classList.remove('hidden');
    };
  }
}

// Слушаем события для корректной работы с View Transitions в Astro
document.addEventListener('DOMContentLoaded', initReturnsForm);
document.addEventListener('astro:page-load', initReturnsForm);