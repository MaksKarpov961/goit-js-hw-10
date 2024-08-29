// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";


// Отримуємо посилання на форму і елемент інпуту
const inputValueEl = document.querySelector('[name="delay"]');
const registerForm = document.querySelector(".form");


  // Додаємо обробник події на сабміт форми
  registerForm.addEventListener("submit", handleSubmit);

  // Функція для створення промісу
  function createPromise(delay, state) {
    // Створюємо новий проміс
    return new Promise((resolve, reject) => {
      // Використовуємо setTimeout для затримки
      setTimeout(() => {
        if (state === 'fulfilled') {
          // Якщо стан "fulfilled", проміс виконується через delay мілісекунд
          resolve(delay);
        } else if (state === 'rejected') {
          // Якщо стан "rejected", проміс відхиляється через delay мілісекунд
          reject(delay);
        }
      }, delay); // Затримка у мілісекундах
    });
  }

  // Функція для обробки сабміту форми
  function handleSubmit(event) {
    event.preventDefault(); // Запобігаємо стандартному перезавантаженню сторінки

    // Отримуємо значення затримки з поля введення та конвертуємо його в число
    const delay = Number(inputValueEl.value);
    // Отримуємо вибраний стан з радіокнопок
    const state = document.querySelector('[name="state"]:checked').value;

    // console.log(state);
    
    // Створюємо проміс
    createPromise(delay, state)
      .then(delay => {
        // Якщо проміс успішно виконується, показуємо сповіщення про успіх
        iziToast.success({
          message: `Fulfilled promise in ${delay}ms`, // Повідомлення про успіх
          position: 'topRight' // Розташування сповіщення на екрані
        });
      })
      .catch(delay => {
        // Якщо проміс відхиляється, показуємо сповіщення про помилку
        iziToast.error({
          message: `Rejected promise in ${delay}ms`, // Повідомлення про помилку
          position: 'topRight' // Розташування сповіщення на екрані
        });
      });
    
    // Очищення інпуту
    inputValueEl.value = '';

        // Скидання вибору радіокнопок
    const radioButtons = document.querySelectorAll('[name="state"]');
    radioButtons.forEach(button => {
      button.checked = false;
    });
  }