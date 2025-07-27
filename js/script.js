// Dark mode toggle & simpan preferensi & update icon
function setDarkMode(enabled) {
  if (enabled) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
    updateDarkModeIcon(true);
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
    updateDarkModeIcon(false);
  }
}

function toggleDarkMode() {
  setDarkMode(!document.documentElement.classList.contains('dark'));
}

function updateDarkModeIcon(isDark) {
  const iconMoon = document.getElementById('icon-moon');
  const iconSun = document.getElementById('icon-sun');
  if (isDark) {
    iconMoon.classList.add('hidden');
    iconSun.classList.remove('hidden');
  } else {
    iconMoon.classList.remove('hidden');
    iconSun.classList.add('hidden');
  }
}

// Format date helper
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Fungsi untuk mengecek apakah suatu tanggal adalah hari ini
function isToday(dateToCheck) {
  const today = new Date();
  return today.getFullYear() === dateToCheck.getFullYear() &&
         today.getMonth() === dateToCheck.getMonth() &&
         today.getDate() === dateToCheck.getDate();
}

function getMonthName(date) {
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return monthNames[date.getMonth()];
}

// Calendar variables
let currentDate = new Date();
let laporanDate = new Date();
let absensiDate = new Date();

// ===== Calendar Functions =====
function renderCalendar() {
  const calendar = document.getElementById("calendar");
  const monthYear = document.getElementById("monthYear");
  const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let offset = (firstDay.getDay() + 6) % 7;

  monthYear.textContent = `${getMonthName(currentDate)} ${year}`;
  calendar.innerHTML = "";

  // Header hari
  weekdays.forEach(day => {
    calendar.innerHTML += `<div class='font-semibold text-center text-gray-700 dark:text-gray-300 select-none'>${day}</div>`;
  });

  // Blank cells sebelum tanggal 1
  for(let i=0; i<offset; i++){
    calendar.innerHTML += `<div></div>`;
  }

  // Tanggal
  for(let i=1; i<=lastDay.getDate(); i++){
    const day = new Date(year, month, i);
    const key = formatDate(day);
    const dayTasks = tasks[key] || [];
    const isSunday = day.getDay() === 0;
    const today = isToday(day);

    // Batasi tampilkan maksimal 6 tugas di kalender, sisanya +n tugas
    const maxVisibleTasks = 4;
    const visibleTasks = dayTasks.slice(0, maxVisibleTasks);
    const remainingCount = dayTasks.length - maxVisibleTasks;

    calendar.innerHTML += `
      <div
        class="
          calendar-day
          border rounded-lg p-2 shadow-md
          cursor-pointer flex flex-col overflow-hidden
          h-28 relative
          ${isSunday
            ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'
            : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100'}
          hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all
          ${today ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
        "
        onclick='showPopup("${key}")'
        title="Klik untuk lihat tugas"
        tabindex="0"
        onkeydown="if(event.key==='Enter' || event.key===' ') { showPopup('${key}'); }"
      >
        <div class="font-bold ${today ? 'text-blue-600 dark:text-blue-400' : 'text-blue-700 dark:text-blue-400'} mb-1 select-none flex justify-between">
          <span>${i}</span>
          ${today ? '<span class="text-xs bg-blue-600 dark:bg-blue-700 text-white px-1 rounded">Hari Ini</span>' : ''}
        </div>
        <div class="task-list-scroll flex flex-col items-start text-xs text-green-600 dark:text-green-400 overflow-y-auto max-h-16 pr-1 space-y-0.5">
          ${visibleTasks.map(task => `<div class="truncate w-full" title="${task}">• ${task}</div>`).join('')}
          ${remainingCount > 0 ? `<div class="text-green-700 dark:text-green-300 font-semibold select-none">+${remainingCount} tugas</div>` : ''}
        </div>
        ${dayTasks.length > 0 ? `<div class="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-green-500"></div>` : ''}
      </div>
    `;
  }
}

function renderCalendarLaporan() {
  const calendar = document.getElementById("calendarLaporan");
  const monthYearLaporan = document.getElementById("monthYearLaporan");
  const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const year = laporanDate.getFullYear();
  const month = laporanDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let offset = (firstDay.getDay() + 6) % 7;

  monthYearLaporan.textContent = `${getMonthName(laporanDate)} ${year}`;
  calendar.innerHTML = "";

  // Header hari
  weekdays.forEach(day => {
    calendar.innerHTML += `<div class='font-semibold text-center text-gray-700 dark:text-gray-300 select-none'>${day}</div>`;
  });

  // Blank cells sebelum tanggal 1
  for(let i=0; i<offset; i++){
    calendar.innerHTML += `<div></div>`;
  }

  // Tanggal
  for(let i=1; i<=lastDay.getDate(); i++){
    const day = new Date(year, month, i);
    const key = formatDate(day);
    const dayTasks = tasks[key] || [];
    const isSunday = day.getDay() === 0;
    const today = isToday(day);

    calendar.innerHTML += `
      <div
        class="
          calendar-day
          border rounded-lg p-2 shadow-md
          cursor-pointer flex flex-col overflow-hidden
          h-28 relative
          ${isSunday
            ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'
            : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100'}
          hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all
          ${today ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
        "
        onclick='showPopup("${key}")'
        title="Klik untuk lihat tugas"
        tabindex="0"
        onkeydown="if(event.key==='Enter' || event.key===' ') { showPopup('${key}'); }"
      >
        <div class="font-bold ${today ? 'text-blue-600 dark:text-blue-400' : 'text-blue-700 dark:text-blue-400'} mb-1 select-none flex justify-between">
          <span>${i}</span>
          ${today ? '<span class="text-xs bg-blue-600 dark:bg-blue-700 text-white px-1 rounded">Hari Ini</span>' : ''}
        </div>
        <div class="task-list-scroll flex flex-col items-start text-xs text-green-600 dark:text-green-400 overflow-y-auto max-h-16 pr-1 space-y-0.5">
          ${dayTasks.length > 0 ? 
            `<div class="text-green-700 dark:text-green-300 font-semibold select-none">${dayTasks.length} tugas</div>` : 
            `<div class="text-gray-500 dark:text-gray-400 text-xs">Tidak ada tugas</div>`}
        </div>
        ${dayTasks.length > 0 ? `<div class="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-green-500"></div>` : ''}
      </div>
    `;
  }
  
  // Update statistics
  updateLaporanStatistics();
}

function updateLaporanStatistics() {
  const year = laporanDate.getFullYear();
  const month = laporanDate.getMonth();
  const lastDay = new Date(year, month + 1, 0);
  
  let totalTasks = 0;
  let serverTasks = 0;
  let packingTasks = 0;
  let otherTasks = 0;
  
  for(let i=1; i<=lastDay.getDate(); i++){
    const day = new Date(year, month, i);
    const key = formatDate(day);
    const dayTasks = tasks[key] || [];
    
    totalTasks += dayTasks.length;
    
    dayTasks.forEach(task => {
      if(task.toLowerCase().includes('server') || task.toLowerCase().includes('install') || task.toLowerCase().includes('maintenance')) {
        serverTasks++;
      } else if(task.toLowerCase().includes('packing') || task.toLowerCase().includes('orderan')) {
        packingTasks++;
      } else {
        otherTasks++;
      }
    });
  }
  
  document.getElementById('totalTasksStat').textContent = totalTasks;
  document.getElementById('serverTasksStat').textContent = serverTasks;
  document.getElementById('packingTasksStat').textContent = packingTasks;
  document.getElementById('otherTasksStat').textContent = otherTasks;
  
  // Update chart
  renderLaporanChart();
}

function changeMonth(direction){
  currentDate.setMonth(currentDate.getMonth()+direction);
  renderCalendar();
  renderTaskTable(); // Update task table when month changes
}

function changeLaporanMonth(direction){
  laporanDate.setMonth(laporanDate.getMonth()+direction);
  renderCalendarLaporan();
}

// ===== Task Table Functions =====
function renderTaskTable() {
  const tableBody = document.getElementById("taskTableBody");
  tableBody.innerHTML = "";
  
  // Get current month dates
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  // Create array of all dates in month with tasks
  const monthTasks = [];
  for(let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day);
    const dateStr = formatDate(date);
    if(tasks[dateStr]) {
      monthTasks.push({
        date: dateStr,
        tasks: tasks[dateStr]
      });
    }
  }
  
  // Sort by date (newest first)
  monthTasks.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Populate table
  monthTasks.forEach(day => {
    const row = document.createElement("tr");
    row.className = "border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors";
    
    const dateCell = document.createElement("td");
    dateCell.className = "p-3 whitespace-nowrap";
    dateCell.textContent = new Date(day.date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const taskCell = document.createElement("td");
    taskCell.className = "p-3";
    
    const taskList = document.createElement("ul");
    taskList.className = "list-disc list-inside space-y-1";
    
    day.tasks.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task;
      taskList.appendChild(li);
    });
    
    taskCell.appendChild(taskList);
    row.appendChild(dateCell);
    row.appendChild(taskCell);
    tableBody.appendChild(row);
  });
  
  // Show message if no tasks
  if(monthTasks.length === 0) {
    const row = document.createElement("tr");
    row.className = "border-t border-gray-200 dark:border-slate-700";
    row.innerHTML = `
      <td colspan="2" class="p-4 text-center text-gray-500 dark:text-gray-400">
        Tidak ada tugas yang tercatat bulan ini
      </td>
    `;
    tableBody.appendChild(row);
  }
}

// ===== Popup Functions =====
function showPopup(date){
  const popup = document.getElementById("taskPopup");
  const taskList = document.getElementById("popupTaskList");
  const popupDate = document.getElementById("popupDate");
  taskList.innerHTML = "";
  popupDate.textContent = new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  (tasks[date]||["Tidak ada tugas"]).forEach(task => {
    taskList.innerHTML += `<li class='list-disc ml-5 text-gray-700 dark:text-gray-300'>${task}</li>`;
  });

  popup.classList.remove("hidden");
  document.body.style.overflow = 'hidden'; // disable scroll background
}

function closePopup(){
  document.getElementById("taskPopup").classList.add("hidden");
  document.body.style.overflow = ''; // enable scroll background
}

// ===== Chart Functions =====
function renderChart(){
  const ctx = document.getElementById('chartKinerja').getContext('2d');
  if(window.chartInstance) window.chartInstance.destroy();
  window.chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Server Disetting', 'Packing', 'Lainnya'],
      datasets: [{
        label: 'Jumlah',
        data: [36,20,38,],
        backgroundColor: ['#3b82f6','#10b981','#f59e0b','#8b5cf6'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { 
          position: 'bottom',
          labels: {
            color: '#6b7280',
            font: {
              family: "'Inter', sans-serif"
            }
          }
        }
      },
      cutout: '65%'
    }
  });
  
  // Line chart for performance trend

  // grafik performa
  const trendCtx = document.getElementById('trendChart').getContext('2d');
  if(window.trendChartInstance) window.trendChartInstance.destroy();
  window.trendChartInstance = new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: ['Mei', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Server Disetting',
          data: [10, 31, 36],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Packing',
          data: [10, 20, 20],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#6b7280',
            font: {
              family: "'Inter', sans-serif"
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(209, 213, 219, 0.3)'
          },
          ticks: {
            color: '#6b7280'
          }
        },
        x: {
          grid: {
            color: 'rgba(209, 213, 219, 0.3)'
          },
          ticks: {
            color: '#6b7280'
          }
        }
      }
    }
  });
}

function renderLaporanChart() {
  const ctx = document.getElementById('laporanChart').getContext('2d');
  if(window.laporanChartInstance) window.laporanChartInstance.destroy();
  
  const year = laporanDate.getFullYear();
  const month = laporanDate.getMonth();
  const monthName = getMonthName(laporanDate);
  
  window.laporanChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4',],
      datasets: [
        {
          label: 'Server',
          data: [4, 3, 5, 2],
          backgroundColor: '#3b82f6'
        },
        {
          label: 'Packing',
          data: [2, 1, 3, 2, 0],
          backgroundColor: '#10b981'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Distribusi Tugas per Minggu - ${monthName} ${year}`,
          color: '#6b7280',
          font: {
            size: 16,
            family: "'Inter', sans-serif"
          }
        },
        legend: {
          position: 'bottom',
          labels: {
            color: '#6b7280',
            font: {
              family: "'Inter', sans-serif"
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(209, 213, 219, 0.3)'
          },
          ticks: {
            color: '#6b7280'
          }
        },
        x: {
          grid: {
            color: 'rgba(209, 213, 219, 0.3)'
          },
          ticks: {
            color: '#6b7280'
          }
        }
      }
    }
  });
}

// ===== Absensi Functions =====
function formatAbsensiMonthYear(date){
  return `${getMonthName(date)} ${date.getFullYear()}`;
}

function renderAbsensi(){
  const tbody = document.getElementById("absensiBody");
  tbody.innerHTML = "";
  const key = `${absensiDate.getFullYear()}-${String(absensiDate.getMonth()+1).padStart(2,'0')}`;
  const data = absensiData[key]||[];
  
  if(data.length === 0) {
    tbody.innerHTML = `
      <tr class="border-t border-gray-300 dark:border-slate-700">
        <td colspan="4" class="p-4 text-center text-gray-500 dark:text-gray-400">Tidak ada data absensi untuk bulan ini</td>
      </tr>
    `;
    return;
  }
  
  data.forEach(row=>{
    const tr = document.createElement("tr");
    tr.classList.add("border-t","border-gray-300","dark:border-slate-700","hover:bg-gray-100","dark:hover:bg-slate-700","transition-colors");
    tr.innerHTML = `
      <td class="p-3">${row.tanggal}</td>
      <td class="p-3">${row.masuk}</td>
      <td class="p-3">${row.pulang}</td>
      <td class="p-3 ${row.lembur !== '-' ? 'text-yellow-600 dark:text-yellow-400 font-medium' : ''}">${row.lembur}</td>
    `;
    tbody.appendChild(tr);
  });
  document.getElementById("absensiMonthYear").textContent = formatAbsensiMonthYear(absensiDate);
  
 // Calculate statistics
let totalDays = data.length;
let onTimeDays = data.filter(d => {
  // Split time string into hours and minutes
  const [hours, minutes] = d.masuk.split(':').map(Number);
  
  // Check if time is before or equal to 08:10
  return (hours < 8) || (hours === 8 && minutes <= 10);
}).length;
let lateDays = totalDays - onTimeDays;
let overtimeDays = data.filter(d => d.lembur !== '-').length;

document.getElementById('totalDaysStat').textContent = totalDays;
document.getElementById('onTimeStat').textContent = onTimeDays;
document.getElementById('lateStat').textContent = lateDays;
document.getElementById('overtimeStat').textContent = overtimeDays;
}

function changeAbsensiMonth(direction){
  absensiDate.setMonth(absensiDate.getMonth()+direction);
  renderAbsensi();
}

// ===== Produk Knowledge Functions =====
function renderProdukKnowledge(filter = '') {
  const container = document.getElementById("produkKnowledgeContent");
  container.innerHTML = "";
  const filterLower = filter.toLowerCase();

  for (const kategori in produkKnowledge) {
    const filteredItems = produkKnowledge[kategori].filter(item =>
      item.nama.toLowerCase().includes(filterLower) || 
      item.deskripsi.toLowerCase().includes(filterLower)
    );
    if (filteredItems.length === 0) continue;

    container.innerHTML += `
      <h3 class="text-xl sm:text-2xl font-bold mb-4 mt-8 text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600 pb-2">${kategori}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        ${filteredItems.map(item => `
          <div class="product-card bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 sm:p-5 flex flex-col transition-all hover:shadow-lg">
            <img src="${item.gambar}" alt="${item.nama}" class="w-full h-40 sm:h-48 object-contain mb-3 sm:mb-4 rounded bg-gray-100 dark:bg-slate-700 p-2" loading="lazy" />
            <h4 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">${item.nama}</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300 flex-grow">${item.deskripsi}</p>
            <button class="mt-3 sm:mt-4 px-2 sm:px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs sm:text-sm transition-colors self-start">
              Detail
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  if(container.innerHTML.trim() === ""){
    container.innerHTML = `
      <div class="text-center py-10">
        <div class="mx-auto w-24 h-24 text-gray-400 dark:text-gray-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-lg">Produk tidak ditemukan.</p>
        <p class="text-gray-500 dark:text-gray-500 mt-2">Coba kata kunci lain</p>
      </div>
    `;
  }
}

// ===== Navigation Functions =====
function navigate(page){
  document.querySelectorAll(".page").forEach(el => el.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");
  document.getElementById(page).classList.add("fade-in");

  // Highlight navbar active link
  document.querySelectorAll("nav a").forEach(a => a.classList.remove("text-blue-600", "dark:text-blue-400", "font-semibold"));
  document.querySelector(`nav a[data-page="${page}"]`).classList.add("text-blue-600", "dark:text-blue-400", "font-semibold");
  
  // Close mobile menu if open
  closeMobileMenu();

  // Render chart saat masuk dashboard
  if(page === "dashboard") {
    renderChart();
    renderTaskTable();
  }
  if(page === "produkKnowledge") {
    renderProdukKnowledge();
  }
  if(page === "laporan") {
    renderCalendarLaporan();
  }
}

// Search produk knowledge
function searchProdukKnowledge(event){
  const value = event.target.value;
  renderProdukKnowledge(value);
}

// Mobile view functions
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.remove('open');
}

function checkMobileView() {
  if (window.innerWidth < 768) {
    document.getElementById('desktopNav').classList.add('hidden');
    document.getElementById('mobileNavButton').classList.remove('hidden');
  } else {
    document.getElementById('desktopNav').classList.remove('hidden');
    document.getElementById('mobileNavButton').classList.add('hidden');
    closeMobileMenu();
  }
}

// Initialize on load
window.onload = () => {
  // Load dark mode preference
  if(localStorage.getItem('darkMode') === 'true'){
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }

  renderCalendar();
  renderCalendarLaporan();
  renderAbsensi();
  navigate('dashboard');
  lucide.createIcons();
  
  // Check mobile view
  checkMobileView();
};

window.addEventListener('resize', checkMobileView);
