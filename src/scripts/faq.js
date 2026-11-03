// src/scripts/faq.js

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    // Принудительно задаем стартовое закрытое состояние для JS
    if (answer) answer.style.maxHeight = '0px';

    item.addEventListener('click', () => {
      if (!answer || !icon) return;

      // Проверяем, открыт ли текущий элемент
      const isOpen = answer.style.maxHeight !== '0px';

      // Закрываем все остальные открытые вопросы (эффект аккордеона)
      faqItems.forEach(otherItem => {
        const otherAnswer = otherItem.querySelector('.faq-answer');
        const otherIcon = otherItem.querySelector('.faq-icon');
        if (otherAnswer && otherIcon) {
          otherAnswer.style.maxHeight = '0px';
          otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      // Если элемент был закрыт — плавно открываем его на его реальную высоту
      if (!isOpen) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        icon.style.transform = 'rotate(45deg)'; // Превращаем плюс в крестик
      }
    });
  });
}


// Запускаем инициализацию при полной загрузке DOM и при переходах страниц в Astro
document.addEventListener('DOMContentLoaded', initFaqAccordion);
document.addEventListener('astro:page-load', initFaqAccordion);
