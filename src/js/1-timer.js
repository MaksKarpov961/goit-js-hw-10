// Імпортуємо бібліотеку flatpickr
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";


// Імпортуємо бібліотеку iziToast
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Отримуємо елемент кнопки старт
const buttonEl = document.querySelector('[data-start]');

// Отримуємо елемент інпуту
const inputEl = document.querySelector('#datetime-picker')

// Функція для вимкнення кнопки
function disableButtonStart() {
  buttonEl.disabled = true; 
}
disableButtonStart(); // Вимикаємо кнопку на початку

// Функція для ввімкнення кнопки
function enableButtonStart() {
  buttonEl.disabled = false; 
}

// Функція для вимкнення Інпуту
function disableInput() {
  inputEl.disabled = true; 
}

// Функція для ввімкнення Інпуту
function enableInput() {
  inputEl.disabled = false; 
}

// Оголошення змінної для обраної дати
let userSelectedDate = null;

// Параметри бібліотеки flatpickr
const options = {
  enableTime: true, // Дозволяє вибір часу
  time_24hr: true, // Використовує 24-годинний формат часу
  defaultDate: new Date(), // Встановлює поточну дату як значення за замовчуванням
  minuteIncrement: 1, // Крок вибору хвилин в інтерфейсі
  onClose(selectedDates) { // Обробник події закриття календаря
    userSelectedDate = selectedDates[0]; // Зберігає вибрану дату

    // Виклик функції для перевірки обраної дати
    checkingCorrectDate(userSelectedDate);
  },
};

// Функція для перевірки коректності дати
function checkingCorrectDate(selectedDate) {
  const currentDate = new Date(); // Отримуємо поточну дату
  
  if (selectedDate < currentDate) { // Якщо вибрана дата менша за поточну

    iziToast.error({ // Показуємо повідомлення про помилку
      message: 'Please choose a date in the future', // Текст повідомлення
      position: 'topRight', // Позиція повідомлення: у верхньому правому куті
      timeout: false // Час, протягом якого повідомлення буде відображатися
    });

    disableButtonStart(); // Вимикаємо кнопку
  } else {
    enableButtonStart(); // Дата в майбутньому, включаємо кнопку
  }
}

// Ініціалізація flatpickr з параметрами
flatpickr('#datetime-picker', options);

// Функція для перетворення мілісекунд у дні, години, хвилини та секунди
function convertMs(ms) {
  const second = 1000; 
  const minute = second * 60; 
  const hour = minute * 60; 
  const day = hour * 24; 

  // Розрахунок залишкових днів, годин, хвилин та секунд
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds }; // Повертає об'єкт з розрахованими значеннями
}

let timerInterval; // Змінна для зберігання ідентифікатора інтервалу таймера

// Функція для оновлення таймера
function updateTimer() {
  const currentDate = new Date(); // Отримуємо поточну дату
  const timeDifference = userSelectedDate - currentDate; // Розрахунок різниці між вибраною датою і поточною датою

  if (timeDifference <= 0) { // Якщо різниця менша або дорівнює нулю
    clearInterval(timerInterval); // Очищаємо інтервал таймера
    enableInput(); // Дозволяємо редагування інпуту
    return;
  }

  const time = convertMs(timeDifference); // Конвертуємо мілісекунди в дні, години, хвилини та секунди
  // Оновлюємо текст в елементах для відображення таймера
  document.querySelector('[data-days]').textContent = String(time.days).padStart(2, '0');
  document.querySelector('[data-hours]').textContent = String(time.hours).padStart(2, '0');
  document.querySelector('[data-minutes]').textContent = String(time.minutes).padStart(2, '0');
  document.querySelector('[data-seconds]').textContent = String(time.seconds).padStart(2, '0');
}

// Функція для старту таймера
const timerStart = () => {
  disableButtonStart(); // Вимикаємо кнопку
  disableInput(); // Вимикаємо інпут
  timerInterval = setInterval(updateTimer, 1000); // Запускаємо таймер, який оновлюється кожну секунду
  updateTimer(); // Оновлюємо таймер одразу після старту
};

// Додаємо обробник подій для кнопки старту
buttonEl.addEventListener('click', timerStart);

