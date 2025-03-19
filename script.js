document.addEventListener("DOMContentLoaded", function() {
  // Инициализация Telegram Web Apps, если используется внутри бота
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.expand();
  }

  let menuData = [];
  // Обход кэширования
  fetch('guides.json?v=' + new Date().getTime())
    .then(response => response.json())
    .then(data => {
      menuData = data;
      populateMainMenu(data);
      gsap.from("#mainMenu", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power2.out"
      });
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));

  // Заполнение главного меню
  function populateMainMenu(data) {
    const mainMenuContainer = document.getElementById('mainMenuItems');
    mainMenuContainer.innerHTML = "";
    data.forEach((item, index) => {
      const menuItem = document.createElement('div');
      menuItem.className = 'menu-item';
      const title = document.createElement('h2');
      title.textContent = item.title;
      menuItem.appendChild(title);
      menuItem.addEventListener('click', () => openSubMenu(index));
      mainMenuContainer.appendChild(menuItem);

      gsap.from(menuItem, {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        delay: index * 0.2,
        ease: "back.out(1.7)"
      });
    });
  }

  // Переход к подменю
  function openSubMenu(mainIndex) {
    const selectedCategory = menuData[mainIndex];
    const subMenuContainer = document.getElementById('subMenuItems');
    const subMenuTitle = document.getElementById('subMenuTitle');
    subMenuTitle.textContent = selectedCategory.title;
    subMenuContainer.innerHTML = "";

    selectedCategory.submenus.forEach((submenu, index) => {
      const submenuItem = document.createElement('div');
      submenuItem.className = 'submenu-item';
      submenuItem.textContent = submenu.title;
      submenuItem.addEventListener('click', () => {
        if (submenu.guide) {
          openGuide(submenu.guide, submenu.title);
        } else {
          alert(`Открывается "${submenu.title}". Функционал пока не реализован.`);
        }
      });
      subMenuContainer.appendChild(submenuItem);

      gsap.from(submenuItem, {
        opacity: 0,
        x: 100,
        duration: 0.5,
        delay: index * 0.15,
        ease: "power2.out"
      });
    });

    gsap.to("#mainMenu", {
      opacity: 0,
      y: -50,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        document.getElementById('mainMenu').style.display = "none";
        document.getElementById('subMenu').style.display = "block";
        gsap.from("#subMenu", {
          opacity: 0,
          y: 50,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    });
  }

  // Переход к содержимому гайда
  function openGuide(guideObj, guideTitle) {
    const guideDetails = document.getElementById('guideDetails');
    guideDetails.innerHTML = "";

    const titleEl = document.createElement('h2');
    titleEl.textContent = guideTitle;
    guideDetails.appendChild(titleEl);

    guideObj.sections.forEach((section, index) => {
      let sectionEl;

      if (section.type === 'text') {
        sectionEl = document.createElement('p');
        sectionEl.innerHTML = section.content;
      } else if (section.type === 'image') {
        sectionEl = document.createElement('img');
        sectionEl.src = section.src;
        sectionEl.alt = section.alt || '';
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

      guideDetails.appendChild(sectionEl);

      gsap.from(sectionEl, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: index * 0.2,
        ease: "power2.out"
      });
    });

    gsap.to("#subMenu", {
      opacity: 0,
      y: -50,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        document.getElementById('subMenu').style.display = "none";
        document.getElementById('guideContent').style.display = "block";
        gsap.from("#guideContent", {
          opacity: 0,
          y: 50,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    });
  }

  // Кнопка "Назад" для возврата к главному меню (оставляем рабочий код)
  document.getElementById('backToMain').addEventListener('click', () => {
    const subMenuEl = document.getElementById('subMenu');
    const mainMenuEl = document.getElementById('mainMenu');

    gsap.to(subMenuEl, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        subMenuEl.style.display = "none";
        subMenuEl.style.opacity = "";
        subMenuEl.style.transform = "";

        mainMenuEl.style.display = "block";
        mainMenuEl.style.opacity = 0;
        mainMenuEl.style.transform = "translateY(-50px)";

        gsap.to(mainMenuEl, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            mainMenuEl.style.opacity = "";
            mainMenuEl.style.transform = "";
          }
        });
      }
    });
  });

  // Кнопка "Назад" для возврата к подменю из гайда
  document.getElementById('backToSubMenu').addEventListener('click', () => {
    const guideContentEl = document.getElementById('guideContent');
    const subMenuEl = document.getElementById('subMenu');

    gsap.to(guideContentEl, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        guideContentEl.style.display = "none";
        guideContentEl.style.opacity = "";
        guideContentEl.style.transform = "";

        subMenuEl.style.display = "block";
        subMenuEl.style.opacity = 0;
        subMenuEl.style.transform = "translateY(-50px)";

        gsap.to(subMenuEl, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            subMenuEl.style.opacity = "";
            subMenuEl.style.transform = "";
          }
        });
      }
    });
  });
});
