const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const convertBtn = document.getElementById("convertBtn");
const downloadBtn = document.getElementById("downloadBtn");
const progressBar = document.getElementById("progressBar");
const progressFill = document.querySelector(".progress-fill");
const uploadZone = document.getElementById("uploadZone");
const formatSection = document.getElementById("formatSection");
const formatSelect = document.getElementById("format");

let files = [];

/* Drag & Drop */
uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadZone.style.background = "rgba(255,255,255,0.9)";
});
uploadZone.addEventListener("dragleave", () => {
  uploadZone.style.background = "rgba(255,255,255,0.6)";
});
uploadZone.addEventListener("drop", (e) => {
  e.preventDefault();
  files = Array.from(e.dataTransfer.files);
  showFiles();
});

/* Обычный выбор файлов */
fileInput.addEventListener("change", (event) => {
  files = Array.from(event.target.files);
  showFiles();
});

/* Отображение списка */
function showFiles() {
  fileList.innerHTML = "";
  files.forEach((file, i) => {
    const li = document.createElement("li");
    li.style.animationDelay = `${i * 0.05}s`;

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.onload = () => URL.revokeObjectURL(img.src);

    li.appendChild(img);
    li.appendChild(document.createTextNode(file.name));
    fileList.appendChild(li);
  });

  if (files.length > 0) {
    convertBtn.classList.remove("hidden");
    formatSection.classList.remove("hidden");
  }
}

/* Конвертация */
convertBtn.addEventListener("click", () => {
  convertBtn.classList.add("hidden");
  progressBar.classList.remove("hidden");
  progressFill.style.width = "0";

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    progressFill.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);
      progressBar.classList.add("hidden");
      downloadBtn.classList.remove("hidden");
      const chosenFormat = formatSelect.value;
      downloadBtn.textContent = `Скачать (${chosenFormat.toUpperCase()})`;
      downloadBtn.href = "#"; 
      downloadBtn.download = `converted.${chosenFormat}`;
    }
  }, 300);
});