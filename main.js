import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

// Neural Network Animation with improved visuals
const createNeuralNetwork = (networkSize = 800) => {
  const svg = d3.select('.neural-network');
  const width = networkSize;
  const height = 600;

  // More complex network structure
  const layers = [5, 8, 10, 8, 5];
  const nodes = [];
  let nodeId = 0;

  // Create nodes with staggered positioning
  layers.forEach((layer, i) => {
    const layerWidth = width / (layers.length - 1);
    for (let j = 0; j < layer; j++) {
      nodes.push({
        id: nodeId++,
        x: i * layerWidth + 50,
        y: (height / (layer + 1)) * (j + 1),
        layer: i
      });
    }
  });

  // Enhanced connection pattern
  const links = [];
  nodes.forEach(source => {
    nodes.forEach(target => {
      if (source.layer === target.layer - 1) {
        links.push({
          source,
          target,
          value: Math.random()
        });
      }
    });
  });

  // Enhanced visual styling
  svg.selectAll('*').remove();

  // Add gradient definitions
  const gradient = svg.append('defs')
    .append('linearGradient')
    .attr('id', 'link-gradient')
    .attr('gradientUnits', 'userSpaceOnUse');

  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', 'var(--primary-color)');

  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', 'var(--accent-color)');

  // Create groups for links and nodes
  const linksGroup = svg.append('g').attr('class', 'links');
  const nodesGroup = svg.append('g').attr('class', 'nodes');

  // Draw links with gradient
  const linkElements = linksGroup.selectAll('line')
    .data(links)
    .join('line')
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
    .style('stroke', 'url(#link-gradient)')
    .style('stroke-width', d => d.value * 2)
    .style('opacity', 0.2);

  // Draw nodes with glow effect
  const nodeElements = nodesGroup.selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 4)
    .attr('fill', 'var(--primary-color)')
    .style('filter', 'url(#glow)');

  // Add glow filter
  const defs = svg.append('defs');
  const filter = defs.append('filter')
    .attr('id', 'glow');

  filter.append('feGaussianBlur')
    .attr('stdDeviation', '2')
    .attr('result', 'coloredBlur');

  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode')
    .attr('in', 'coloredBlur');
  feMerge.append('feMergeNode')
    .attr('in', 'SourceGraphic');

  // Enhanced animation
  function animate() {
    nodeElements
      .transition()
      .duration(2000)
      .attr('r', 6)
      .transition()
      .duration(2000)
      .attr('r', 4)
      .on('end', animate);

    linkElements
      .transition()
      .duration(2000)
      .style('opacity', 0.4)
      .transition()
      .duration(2000)
      .style('opacity', 0.2);
  }

  animate();
};

// Enhanced mobile navigation
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

const toggleNav = () => {
  navLinks.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', 
    navLinks.classList.contains('active'));
  
  // Add body scroll lock when menu is open
  document.body.style.overflow = 
    navLinks.classList.contains('active') ? 'hidden' : '';
};

navToggle.addEventListener('click', toggleNav);

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Adjust neural network size for mobile
const updateNeuralNetwork = () => {
  const width = window.innerWidth;
  const networkSize = width < 768 ? 350 : 800;
  createNeuralNetwork(networkSize);
};

// Add touch events for mobile interactions
document.querySelectorAll('.service-card, .proceso-card, .contact-card').forEach(card => {
  card.addEventListener('touchstart', () => {
    card.style.transform = 'scale(0.98)';
  });
  
  card.addEventListener('touchend', () => {
    card.style.transform = '';
  });
});

// Enhanced scroll handling for mobile
let lastScroll = 0;
let scrollTimeout;

window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  
  scrollTimeout = setTimeout(() => {
    const currentScroll = window.pageYOffset;
    const navbar = document.getElementById('navbar');
    
    if (currentScroll > lastScroll && currentScroll > 100) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  }, 50);
}, { passive: true });

// Add resize listener with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(updateNeuralNetwork, 250);
});

// Improved smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      navLinks.classList.remove('active');
    }
  });
});

// Enhanced intersection observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      entry.target.style.opacity = '1';
    }
  });
}, observerOptions);

// Observe hero content with smoother animation
document.querySelectorAll('.hero-content').forEach(element => {
  element.style.opacity = '0';
  observer.observe(element);
});

// Observe other elements with the same observer
document.querySelectorAll('.service-card, .section-header').forEach(element => {
  element.style.opacity = '0';
  observer.observe(element);
});

// Initialize
window.addEventListener('load', () => {
  createNeuralNetwork();
});