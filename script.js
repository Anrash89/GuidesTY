document.addEventListener("DOMContentLoaded", function() {
  // Инициализация Telegram Web Apps, если используется внутри бота
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.expand();
  }

  let menuData = [];
  
  // Загружаем JSON с гайдами
  fetch('guides.json?v=' + new Date().getTime())
    .then(response => response.json())
    .then(data => {
      menuData = data;
      populateSideMenu(data);
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));

  // Функция формирования выдвижного меню
  function populateSideMenu(data) {
    const menuList = document.getElementById('menuList');
    menuList.innerHTML = "";
    
    data.forEach(category => {
      // Создаем элемент для большой категории
      const categoryItem = document.createElement('li');
      categoryItem.className = 'category-item';
      categoryItem.textContent = category.title;
      
      // Создаем вложенный список для подкатегорий
      const subList = document.createElement('ul');
      subList.className = 'subcategory-list';
      
      category.submenus.forEach(submenu => {
        const subItem = document.createElement('li');
        subItem.className = 'subcategory-item';
        subItem.textContent = submenu.title;
        subItem.addEventListener('click', () => {
          // Закрываем меню при выборе
          closeSideMenu();
          if (submenu.guide) {
            openGuide(submenu.guide, submenu.title);
          } else {
            alert(`Открывается "${submenu.title}". Функционал пока не реализован.`);
          }
        });
        subList.appendChild(subItem);
      });
      
      categoryItem.appendChild(subList);
      menuList.appendChild(categoryItem);
    });
  }

  // Открытие гайда в основном контенте
  function openGuide(guideObj, guideTitle) {
    const guideContentEl = document.getElementById('guideContent');
    const welcomeEl = document.getElementById('welcome');
    guideContentEl.innerHTML = "";

    const titleEl = document.createElement('h2');
    titleEl.textContent = guideTitle;
    guideContentEl.appendChild(titleEl);

    guideObj.sections.forEach((section, index) => {
      let sectionEl;
      if (section.type === 'text') {
        sectionEl = document.createElement('p');
        sectionEl.innerHTML = section.content;
      } else if (section.type === 'image') {
        const linkEl = document.createElement('a');
        linkEl.href = section.src;
        linkEl.target = "_blank";
        linkEl.className = "image-link";
        const imgEl = document.createElement('img');
        imgEl.src = section.src;
        imgEl.alt = section.alt || '';
        linkEl.appendChild(imgEl);
        sectionEl = linkEl;
      } else if (section.type === 'interactive-image') {
        const containerEl = document.createElement('div');
        containerEl.className = 'interactive-image-container';
        const imgEl = document.createElement('img');
        imgEl.src = section.src;
        imgEl.alt = section.alt || 'Interactive image';
        containerEl.appendChild(imgEl);
        if (section.hotspots && Array.isArray(section.hotspots)) {
          section.hotspots.forEach(hs => {
            const hotspotEl = document.createElement('div');
            hotspotEl.className = 'hotspot';
            hotspotEl.style.top = hs.top;
            hotspotEl.style.left = hs.left;
            const tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip';
            tooltipEl.innerHTML = hs.tooltip || '';
            hotspotEl.appendChild(tooltipEl);
            containerEl.appendChild(hotspotEl);
          });
        }
        sectionEl = containerEl;
      }
      guideContentEl.appendChild(sectionEl);
      gsap.from(sectionEl, { opacity: 0, y: 20, duration: 0.6, delay: index * 0.2, ease: "power2.out" });
    });
    
    // Показываем блок с гайдом и скрываем приветствие
    welcomeEl.style.display = "none";
    guideContentEl.style.display = "block";
  }

  // Функция открытия бокового меню
  function openSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    gsap.to(sideMenu, { x: 0, duration: 0.3, ease: "power2.out" });
  }

  // Функция закрытия бокового меню
  function closeSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    gsap.to(sideMenu, { x: "-100%", duration: 0.3, ease: "power2.in" });
  }

  // Обработчик кнопки гамбургера
  document.getElementById('menuToggle').addEventListener('click', openSideMenu);
  // Обработчик кнопки закрытия меню
  document.getElementById('closeMenu').addEventListener('click', closeSideMenu);
});
