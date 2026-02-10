// Smooth scroll to section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // If section doesn't exist (like 'download'), scroll to CTA section
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Modal functions
function openContactModal() {
  const modal = document.getElementById('contactModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeContactModal() {
  const modal = document.getElementById('contactModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('contactModal');
  if (event.target === modal) {
    closeContactModal();
  }
});

// Close modal on escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeContactModal();
  }
});

// Add scroll animation for elements
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all feature cards and testimonials
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .step');

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Handle download button clicks
document.querySelectorAll('.download-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    alert('App coming soon! We\'ll notify you when it\'s available on the App Store and Google Play.');
  });
});

// Fetch and render available tasks
const SUPABASE_URL = 'https://kwwfpvvjldwmweshrvtn.supabase.co';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return diffDays + 'd ago';
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

function formatFee(fee) {
  if (!fee) return '-';
  return '$' + Number(fee).toLocaleString('en-AU');
}

async function loadAvailableTasks() {
  var tbody = document.getElementById('tasksTableBody');
  var emptyEl = document.getElementById('tasksEmpty');
  var tableWrapper = document.querySelector('.tasks-table-wrapper');

  try {
    var response = await fetch(SUPABASE_URL + '/functions/v1/available-tasks', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3d2ZwdnZqbGR3bXdlc2hydnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MTY0NjgsImV4cCI6MjA4NTQ5MjQ2OH0.W-qoz7KGCax1WSnpaI8BzHTN9Hha6d4nEnf9fdvZ0eQ'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch');

    var result = await response.json();
    var tasks = result.tasks || [];

    if (tasks.length === 0) {
      tableWrapper.style.display = 'none';
      emptyEl.style.display = 'block';
      return;
    }

    tbody.innerHTML = tasks.map(function(task) {
      return '<tr>' +
        '<td class="task-type">' + escapeHtml(task.installation_type) + '</td>' +
        '<td><span class="task-location">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>' +
          escapeHtml((task.suburb || '') + (task.state ? ', ' + task.state : '')) +
        '</span></td>' +
        '<td>' + (task.estimated_hours || '-') + 'h</td>' +
        '<td class="task-fee">' + formatFee(task.installation_fee) + '</td>' +
        '<td class="task-date">' + formatDate(task.created_at) + '</td>' +
        '<td><button class="btn-apply" onclick="scrollToSection(\'download\')">Apply Now</button></td>' +
      '</tr>';
    }).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="tasks-loading">Unable to load jobs. Please try again later.</td></tr>';
  }
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', loadAvailableTasks);
