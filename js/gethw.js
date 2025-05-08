const recentHwContainer = document.getElementById("mostrecenthw");


function parseDate(dateStr) {
  if (!dateStr) return Infinity;
  

  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(dateStr).getTime();
  }
  

  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return new Date(parts[1] + '/' + parts[0] + '/' + parts[2]).getTime();
    }
  }
  
  const timestamp = new Date(dateStr).getTime();
  return isNaN(timestamp) ? Infinity : timestamp;
}

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

function loadRecentHomework() {
  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  const duedates = JSON.parse(localStorage.getItem("duedates")) || [];
  const types = JSON.parse(localStorage.getItem("types")) || [];
  const classes = JSON.parse(localStorage.getItem("classes")) || [];

  recentHwContainer.innerHTML = "";

  if (messages.length === 0) {
    recentHwContainer.textContent = "Nu există teme recente.";
    return;
  }


  const homeworkList = messages.map((msg, index) => ({
    message: msg,
    due: duedates[index],
    parsedDue: parseDate(duedates[index]),
    type: types[index] || "Temă", 
    className: classes[index] || "General" 
  }));

  const sortedHomework = homeworkList
    .filter(hw => hw.parsedDue !== Infinity)
    .sort((a, b) => a.parsedDue - b.parsedDue)
    .slice(0, 3);

  if (sortedHomework.length === 0) {
    recentHwContainer.textContent = "Nu există teme cu termen apropiat.";
    return;
  }

  sortedHomework.forEach(hw => {
    const div = document.createElement("div");
    div.classList.add("hw-card");
    
    switch(hw.type) {
      case "Proiect":
        div.style.borderLeftColor = "#e74c3c"; 
        break;
      case "Temă":
        div.style.borderLeftColor = "#3498db"; 
        break;
      case "Prezentare":
        div.style.borderLeftColor = "#2ecc71"; 
        break;
      case "Altele":
        div.style.borderLeftColor = "#9b59b6"; 
        break;
      default:
        div.style.borderLeftColor = "#3498db"; 
    }

    const typeClassHeader = document.createElement("div");
    typeClassHeader.classList.add("type-class-header");

    const typeSpan = document.createElement("span");
    typeSpan.classList.add("hw-type");
    typeSpan.textContent = hw.type;

    const classSpan = document.createElement("span");
    classSpan.classList.add("hw-class");
    classSpan.textContent = hw.className;

    typeClassHeader.appendChild(typeSpan);
    typeClassHeader.appendChild(classSpan);

    const title = document.createElement("h2");
    title.textContent = hw.message;

    const due = document.createElement("p");
    due.textContent = `Deadline: ${formatDate(hw.due)}`;

    div.appendChild(typeClassHeader);
    div.appendChild(title);
    div.appendChild(due);
    recentHwContainer.appendChild(div);
  });
}

window.addEventListener("DOMContentLoaded", loadRecentHomework);