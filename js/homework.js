const hw_input = document.getElementById("hw_input");
const hw_type_select = document.getElementById("hw_type");
const hw_class_select = document.getElementById("hw_class");
const hw_duedate_input = document.getElementById("hw_duedate");
const hw_adder = document.getElementById("hw_adder");
const hw_container = document.getElementById("hw_container");
const delete_all = document.getElementById("delete_all");
const open_calendar = document.getElementById("open-calendar");

function formatDate(dateString) {
  if (!dateString) return "N/A";

  if (dateString.includes('-')) {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('ro-RO');
    }
  }

  return dateString;
}

function setDefaultDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  if (hw_duedate_input) {
    hw_duedate_input.value = `${year}-${month}-${day}`;
  }
}

function createCalendarDialog() {
  const calendarDialog = document.createElement('div');
  calendarDialog.classList.add('calendar-dialog');
  calendarDialog.id = 'calendar-dialog';

  const calendarContent = document.createElement('div');
  calendarContent.classList.add('calendar-content');

  const header = document.createElement('div');
  header.classList.add('calendar-header');

  const title = document.createElement('h3');
  title.textContent = 'Selectează data';

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('calendar-close');
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', () => {
    calendarDialog.style.display = 'none';
  });

  header.appendChild(title);
  header.appendChild(closeBtn);

  const today = new Date();
  const calendarContainer = createCalendar(today, (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    hw_duedate_input.value = `${year}-${month}-${day}`;
    calendarDialog.style.display = 'none';
  });

  const actions = document.createElement('div');
  actions.classList.add('calendar-actions');

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Anulează';
  cancelBtn.classList.add('danger-btn');
  cancelBtn.addEventListener('click', () => {
    calendarDialog.style.display = 'none';
  });

  actions.appendChild(cancelBtn);

  calendarContent.appendChild(header);
  calendarContent.appendChild(calendarContainer);
  calendarContent.appendChild(actions);
  calendarDialog.appendChild(calendarContent);

  document.body.appendChild(calendarDialog);

  return calendarDialog;
}

function createCalendar(currentDate, onSelectDate) {
  const calendarContainer = document.createElement('div');

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();

  const weekdays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const weekdaysRow = document.createElement('div');
  weekdaysRow.classList.add('calendar-grid');

  weekdays.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.classList.add('calendar-weekday');
    dayElement.textContent = day;
    weekdaysRow.appendChild(dayElement);
  });

  calendarContainer.appendChild(weekdaysRow);


  const daysGrid = document.createElement('div');
  daysGrid.classList.add('calendar-grid');

  let firstDayOfWeek = firstDay.getDay();
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  for (let i = 0; i < firstDayOfWeek; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.classList.add('calendar-day', 'empty');
    daysGrid.appendChild(emptyDay);
  }

  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('calendar-day');
    dayElement.textContent = i;

    if (currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      i === today.getDate()) {
      dayElement.classList.add('today');
    }

    dayElement.addEventListener('click', () => {
      const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      onSelectDate(selectedDate);
    });

    daysGrid.appendChild(dayElement);
  }

  calendarContainer.appendChild(daysGrid);

  return calendarContainer;
}


hw_adder.addEventListener("click", () => {
  const userInput = hw_input.value.trim();
  const hw_type = hw_type_select.value;
  const hw_class = hw_class_select.value;
  const hw_duedate = hw_duedate_input.value.trim();
  const hw_added_date = new Date().toLocaleString('ro-RO');

  if (!userInput) {
    alert("Introdu un mesaj!");
    return;
  }

  if (hw_type === "default") {
    alert("Selectează un tip de temă!");
    return;
  }

  if (hw_class === "default") {
    alert("Selectează o materie!");
    return;
  }

  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  const dates = JSON.parse(localStorage.getItem("dates")) || [];
  const duedates = JSON.parse(localStorage.getItem("duedates")) || [];
  const types = JSON.parse(localStorage.getItem("types")) || [];
  const classes = JSON.parse(localStorage.getItem("classes")) || [];

  messages.push(userInput);
  dates.push(hw_added_date);
  duedates.push(hw_duedate);
  types.push(hw_type);
  classes.push(hw_class);

  localStorage.setItem("messages", JSON.stringify(messages));
  localStorage.setItem("dates", JSON.stringify(dates));
  localStorage.setItem("duedates", JSON.stringify(duedates));
  localStorage.setItem("types", JSON.stringify(types));
  localStorage.setItem("classes", JSON.stringify(classes));

  hw_input.value = "";
  hw_type_select.value = "default";
  hw_class_select.value = "default";
  hw_duedate_input.value = "";
  setDefaultDate(); 
  load_hw();


  const dropdown = document.querySelector('.dropdown-content');
  if (dropdown && dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
  }
});


function createHomeworkCard(message, date, duedate, type, className, index) {
  const card = document.createElement("div");
  card.classList.add("hw-card");


  switch (type) {
    case "Proiect":
      card.style.borderLeftColor = "#e74c3c"; 
      break;
    case "Temă":
      card.style.borderLeftColor = "#3498db"; 
      break;
    case "Prezentare":
      card.style.borderLeftColor = "#2ecc71"; 
      break;
    case "Altele":
      card.style.borderLeftColor = "#9b59b6"; 
      break;
    default:
      card.style.borderLeftColor = "#3498db"; 
  }

  const typeClassHeader = document.createElement("div");
  typeClassHeader.classList.add("type-class-header");

  const typeSpan = document.createElement("span");
  typeSpan.classList.add("hw-type");
  typeSpan.textContent = type;

  const classSpan = document.createElement("span");
  classSpan.classList.add("hw-class");
  classSpan.textContent = className;

  typeClassHeader.appendChild(typeSpan);
  typeClassHeader.appendChild(classSpan);

  const header = document.createElement("h3");
  header.textContent = message;

  const createdDate = document.createElement("p");
  createdDate.textContent = `Creat la: ${date}`;

  const dueDate = document.createElement("p");
  dueDate.textContent = `Până pe: ${formatDate(duedate)}`;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Șterge";
  removeBtn.className = "remove-btn";
  removeBtn.addEventListener("click", () => removeHomework(index));

  card.appendChild(typeClassHeader);
  card.appendChild(header);
  card.appendChild(createdDate);
  card.appendChild(dueDate);
  card.appendChild(removeBtn);

  return card;
}


function removeHomework(index) {
  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  const dates = JSON.parse(localStorage.getItem("dates")) || [];
  const duedates = JSON.parse(localStorage.getItem("duedates")) || [];
  const types = JSON.parse(localStorage.getItem("types")) || [];
  const classes = JSON.parse(localStorage.getItem("classes")) || [];

  messages.splice(index, 1);
  dates.splice(index, 1);
  duedates.splice(index, 1);
  types.splice(index, 1);
  classes.splice(index, 1);

  localStorage.setItem("messages", JSON.stringify(messages));
  localStorage.setItem("dates", JSON.stringify(dates));
  localStorage.setItem("duedates", JSON.stringify(duedates));
  localStorage.setItem("types", JSON.stringify(types));
  localStorage.setItem("classes", JSON.stringify(classes));

  load_hw();
}


function load_hw() {
  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  const dates = JSON.parse(localStorage.getItem("dates")) || [];
  const duedates = JSON.parse(localStorage.getItem("duedates")) || [];
  const types = JSON.parse(localStorage.getItem("types")) || [];
  const classes = JSON.parse(localStorage.getItem("classes")) || [];

  hw_container.innerHTML = "";

  if (messages.length === 0) {
    hw_container.textContent = "Nu există teme salvate!";
    return;
  }

  messages.forEach((message, index) => {
    const type = types[index] || "Temă"; 
    const className = classes[index] || "General"; 
    const card = createHomeworkCard(
      message,
      dates[index],
      duedates[index],
      type,
      className,
      index
    );
    hw_container.appendChild(card);
  });
}


if (delete_all) {
  delete_all.addEventListener("click", () => {
    if (confirm("Ești sigur că vrei să ștergi toate temele?")) {
      localStorage.removeItem("messages");
      localStorage.removeItem("dates");
      localStorage.removeItem("duedates");
      localStorage.removeItem("types");
      localStorage.removeItem("classes");
      load_hw();
    }
  });
}


if (open_calendar) {
  open_calendar.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    let calendarDialog = document.getElementById('calendar-dialog');
    if (!calendarDialog) {
      calendarDialog = createCalendarDialog();
    }

    calendarDialog.style.display = 'flex';
  });
}


window.addEventListener("DOMContentLoaded", () => {
  setDefaultDate();
  load_hw();
});