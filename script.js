/**
 * Rahul Chauhan - Portfolio JavaScript Logic
 * Handles interactive elements, theme toggling, scroll animations, 
 * interactive SVG charts, modals, and SQL terminal submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initTypingEffect();
  initScrollAnimations();
  initCounters();
  initInteractiveDashboard();
  initProjectModals();
});

// --- Theme Management ---
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Get saved theme or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  });
}

// --- Navigation Scroll Effects & Mobile Menu ---
function initNavigation() {
  const header = document.getElementById('header');
  const navMenu = document.getElementById('nav-menu');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  
  // Sticky header class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
    
    // Active navigation item based on scroll position
    let currentSectionId = 'home';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
  
  // Mobile Nav Toggle
  mobileNavToggle.addEventListener('click', () => {
    const isVisible = navMenu.style.display === 'flex';
    if (isVisible) {
      navMenu.style.display = 'none';
    } else {
      navMenu.style.display = 'flex';
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '70px';
      navMenu.style.left = '20px';
      navMenu.style.width = 'calc(100% - 40px)';
      navMenu.style.background = 'var(--bg-secondary)';
      navMenu.style.border = '1px solid var(--border-color)';
      navMenu.style.borderRadius = 'var(--radius-md)';
      navMenu.style.padding = '20px';
      navMenu.style.boxShadow = 'var(--shadow-lg)';
    }
  });

  // Close mobile nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navMenu.style.display = 'none';
      }
    });
  });
  
  // Reset navigation display on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navMenu.removeAttribute('style');
    }
  });
}

// --- Hero Typing Effect ---
function initTypingEffect() {
  const textElement = document.getElementById('typed-text');
  const words = ['Data Analyst.', 'Business Intelligence Developer.', 'Python Coder.', 'Problem Solver.'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Deleting text
      textElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      // Writing text
      textElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }
    
    // Handle word cycles
    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // brief pause before next word
    }
    
    setTimeout(type, typingSpeed);
  }
  
  type();
}

// --- Scroll Entrance Animations (Intersection Observer) ---
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
  
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => observer.observe(el));
}

// --- Hero Counters ---
function initCounters() {
  const counters = [
    { elementId: 'stat-projects', target: 3, suffix: '+' },
    { elementId: 'stat-hours', target: 120, suffix: '+' }
  ];
  
  const observerOptions = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect(); // Only run once
      }
    });
  }, observerOptions);
  
  const targetSection = document.getElementById('home');
  if (targetSection) {
    observer.observe(targetSection);
  }
  
  function animateCounters() {
    counters.forEach(c => {
      const el = document.getElementById(c.elementId);
      if (!el) return;
      
      let count = 0;
      const speed = Math.max(1, Math.floor(c.target / 30)); // Animate in ~30 steps
      const intervalTime = 30; // ms
      
      const interval = setInterval(() => {
        count += speed;
        if (count >= c.target) {
          count = c.target;
          clearInterval(interval);
        }
        el.innerHTML = `${count}<span>${c.suffix}</span>`;
      }, intervalTime);
    });
  }
}

// --- Interactive Data Skills Dashboard ---
function initInteractiveDashboard() {
  const tabs = document.querySelectorAll('.dashboard-tab');
  const charts = {
    overview: document.getElementById('chart-overview'),
    python: document.getElementById('chart-python'),
    databases: document.getElementById('chart-databases')
  };
  
  // Dashboard Text Info Content
  const dashboardDetails = {
    overview: {
      title: "Core Skill Distribution",
      desc: "An analytical index tracking my core operational capacities. High efficiency in querying datasets and engineering data visualization templates, supported by structured Python workflows.",
      hl1Val: "90%",
      hl1Lbl: "SQL proficiency",
      hl2Val: "88%",
      hl2Lbl: "Power BI design"
    },
    python: {
      title: "Python Data Libraries",
      desc: "I utilize Python primarily for scripting and analytics. Standard usage involves structural data parsing with Pandas, matrix computing via NumPy, and scripting visual statistics with Matplotlib and Seaborn.",
      hl1Val: "10K+",
      hl1Lbl: "Rows Parsed / Sec",
      hl2Val: "EDA",
      hl2Lbl: "Exploratory Focus"
    },
    databases: {
      title: "Database Engineering",
      desc: "Database proficiency covers querying models, constructing CTE blocks for execution logic, joining tables in relational database management systems (MySQL, Postgres), and loading schemas.",
      hl1Val: "100%",
      hl1Lbl: "ACID compliance",
      hl2Val: "CTEs",
      hl2Lbl: "Analytical Joins"
    }
  };

  // Tab switching logic
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active states
      tabs.forEach(t => t.classList.remove('active'));
      Object.values(charts).forEach(c => c.style.display = 'none');
      
      // Add active state to clicked tab
      tab.classList.add('active');
      const target = tab.getAttribute('data-target');
      
      // Show corresponding chart
      if (charts[target]) {
        charts[target].style.display = 'block';
        
        // Trigger path draw reset / bar growth animations
        if (target === 'python' || target === 'databases') {
          animateBarCharts(charts[target]);
        }
      }
      
      // Update sidebar texts
      const content = dashboardDetails[target];
      if (content) {
        document.getElementById('db-title').textContent = content.title;
        document.getElementById('db-desc').textContent = content.desc;
        document.getElementById('hl-val-1').textContent = content.hl1Val;
        document.getElementById('hl-lbl-1').textContent = content.hl1Lbl;
        document.getElementById('hl-val-2').textContent = content.hl2Val;
        document.getElementById('hl-lbl-2').textContent = content.hl2Lbl;
      }
    });
  });

  // Hover Tooltips for charts
  const tooltip = document.getElementById('chart-tooltip');
  const hoverElements = document.querySelectorAll('.radar-dot, .chart-bar');
  
  hoverElements.forEach(el => {
    el.addEventListener('mouseover', (e) => {
      const skillName = el.getAttribute('data-skill');
      const skillVal = el.getAttribute('data-val');
      
      tooltip.innerHTML = `<strong>${skillName}</strong>: <span style="color:var(--accent-color);">${skillVal}</span>`;
      tooltip.style.opacity = 1;
    });
    
    el.addEventListener('mousemove', (e) => {
      const rect = e.currentTarget.ownerSVGElement.parentElement.getBoundingClientRect();
      const x = e.clientX - rect.left + 15;
      const y = e.clientY - rect.top - 40;
      
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    });
    
    el.addEventListener('mouseleave', () => {
      tooltip.style.opacity = 0;
    });
  });

  function animateBarCharts(svgChart) {
    const bars = svgChart.querySelectorAll('.chart-bar');
    bars.forEach(bar => {
      const originalHeight = bar.getAttribute('height');
      const originalY = bar.getAttribute('y');
      
      // Reset height to 0 starting from bottom axis (250)
      bar.setAttribute('height', '0');
      bar.setAttribute('y', '250');
      
      // Force trigger reflow
      bar.getBoundingClientRect();
      
      // Animate back to original
      bar.setAttribute('height', originalHeight);
      bar.setAttribute('y', originalY);
    });
  }
}

// --- Project Modals Dialog Control ---
function initProjectModals() {
  const detailButtons = document.querySelectorAll('.project-btn-detail');
  const closeButtons = document.querySelectorAll('.modal-close');
  const modals = document.querySelectorAll('.project-modal');
  
  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectType = btn.getAttribute('data-project');
      const modal = document.getElementById(`modal-${projectType}`);
      if (modal) {
        modal.showModal();
        document.body.style.overflow = 'hidden'; // Lock page scroll
      }
    });
  });
  
  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.currentTarget.closest('.project-modal');
      if (modal) {
        modal.close();
        document.body.style.overflow = ''; // Release scroll
      }
    });
  });
  
  // Close modal when clicking on backdrop shadow
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInModal = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!isInModal) {
        modal.close();
        document.body.style.overflow = '';
      }
    });
    
    // Reset page scroll if ESC key pressed
    modal.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
  });
}


