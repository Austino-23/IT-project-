/**
 * ==========================================================================
 * ResolveHub — Digital Complaint Management & Case Resolution System
 * Tagline: "Your Concern. Our Responsibility."
 * File: js/script.js (Vanilla JavaScript Frontend Logic)
 * Tech Stack: Pure Vanilla JS (ES6+, No external libraries or frameworks)
 * ==========================================================================
 */

(function () {
  'use strict';

  /**
   * 1. Mobile Navigation Bar Toggle (Public Pages)
   */
  function initNavbar() {
    var toggleBtn = document.querySelector('[data-navbar-toggle]');
    var navMenu = document.querySelector('[data-navbar-menu]');

    if (!toggleBtn || !navMenu) return;

    function closeNavbar() {
      navMenu.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      var isOpen = navMenu.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when clicking a link inside it
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNavbar);
    });

    // Close mobile menu when clicking outside or pressing Escape
    document.addEventListener('click', function (event) {
      if (navMenu.classList.contains('is-open') && !navMenu.contains(event.target) && !toggleBtn.contains(event.target)) {
        closeNavbar();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeNavbar();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && navMenu.classList.contains('is-open')) {
        closeNavbar();
      }
    });
  }

  /**
   * 2. Dashboard Sidebar Drawer Toggle (Tablet & Mobile <= 992px)
   */
  function initSidebar() {
    var toggleBtns = document.querySelectorAll('[data-sidebar-toggle]');
    var sidebar = document.querySelector('[data-sidebar]');
    var backdrop = document.querySelector('[data-sidebar-backdrop]');

    if (!sidebar) return;

    function closeSidebar() {
      sidebar.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-open');
    }

    function toggleSidebar() {
      var isOpen = sidebar.classList.toggle('is-open');
      if (backdrop) {
        backdrop.classList.toggle('is-open', isOpen);
      }
    }

    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', toggleSidebar);
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeSidebar);
    }

    // Close sidebar when pressing Escape or resizing back to desktop
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && sidebar.classList.contains('is-open')) {
        closeSidebar();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 992 && sidebar.classList.contains('is-open')) {
        closeSidebar();
      }
    });
  }

  /**
   * 3. Accessible Modal System
   */
  function initModals() {
    var openTriggers = document.querySelectorAll('[data-modal-open]');
    var closeTriggers = document.querySelectorAll('[data-modal-close]');
    var backdrops = document.querySelectorAll('.modal-backdrop');

    function openModal(modalId) {
      var modal = document.getElementById(modalId);
      if (!modal) return;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal(modalElement) {
      if (!modalElement) return;
      modalElement.classList.remove('is-open');
      modalElement.setAttribute('aria-hidden', 'true');
    }

    openTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var targetId = trigger.getAttribute('data-modal-open');
        openModal(targetId);
      });
    });

    closeTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var modal = trigger.closest('.modal-backdrop');
        closeModal(modal);
      });
    });

    backdrops.forEach(function (backdrop) {
      backdrop.addEventListener('click', function (event) {
        if (event.target === backdrop) {
          closeModal(backdrop);
        }
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        var activeModal = document.querySelector('.modal-backdrop.is-open');
        if (activeModal) closeModal(activeModal);
      }
    });
  }

  /**
   * 4. Dismissible Alerts
   */
  function initAlerts() {
    document.addEventListener('click', function (event) {
      var closeBtn = event.target.closest('[data-alert-close]');
      if (!closeBtn) return;

      var alertBox = closeBtn.closest('.alert');
      if (alertBox) {
        alertBox.remove();
      }
    });
  }

  /**
   * 5. Interactive Case Lookup on Landing Page (index.html)
   */
  function initCaseTracker() {
    var trackerForm = document.querySelector('[data-case-tracker-form]');
    var trackerInput = document.querySelector('[data-case-tracker-input]');
    var resultContainer = document.querySelector('[data-case-tracker-result]');
    var sampleBtns = document.querySelectorAll('[data-sample-case]');

    var sampleCases = {
      'RH-2026-8492': {
        id: 'RH-2026-8492',
        subject: 'Campus Wi-Fi Authentication Failure in Engineering Block B',
        category: 'ICT',
        department: 'Network Infrastructure Unit',
        officer: 'Engr. Tunde Bakare',
        statusText: 'In Progress — Field Technician Dispatched',
        statusClass: 'status-in-progress',
        statusSymbol: '●',
        updated: '14 minutes ago · SLA Target: 12h remaining'
      },
      'RH-2026-1042': {
        id: 'RH-2026-1042',
        subject: 'Duplicate Tuition Fee Deduction on Semester Portal Receipt',
        category: 'Finance/Bursary',
        department: 'Student Accounts & Bursary Reconciliation',
        officer: 'Adaeze Okafor, ACA',
        statusText: 'Resolution Proposed — Awaiting User Confirmation',
        statusClass: 'status-resolved',
        statusSymbol: '✓',
        updated: '2 hours ago · Reversal reference #BNK-99201 issued'
      },
      'RH-2026-1035': {
        id: 'RH-2026-1035',
        subject: 'Water Pump Pressure Outage in Postgraduate Hall C',
        category: 'Accommodation',
        department: 'Hostel Maintenance & Facilities',
        officer: 'Musa Ibrahim',
        statusText: 'Escalated — Priority Engineering Review',
        statusClass: 'status-escalated',
        statusSymbol: '!',
        updated: '45 minutes ago · Backup water tanker deployed'
      }
    };

    function renderCaseResult(caseIdRaw) {
      if (!resultContainer) return;
      var normalized = (caseIdRaw || '').trim().toUpperCase();

      if (!normalized) {
        showToast('Enter a Case ID', 'Please enter a valid ResolveHub Case ID such as RH-2026-8492.', 'warning');
        return;
      }

      var record = sampleCases[normalized] || {
        id: normalized,
        subject: 'Registered Institutional Complaint Record',
        category: 'Administration',
        department: 'Central Case Resolution Desk',
        officer: 'Assigned Resolution Officer',
        statusText: 'In Progress — Under Departmental Review',
        statusClass: 'status-in-progress',
        statusSymbol: '●',
        updated: 'Updated today · Within 24h SLA window'
      };

      resultContainer.innerHTML =
        '<div class="flex-between" style="margin-bottom: 8px; flex-wrap: wrap;">' +
          '<span class="font-mono" style="font-size: 12px; font-weight: 600; color: var(--color-primary);">' + record.id + '</span>' +
          '<span class="status-badge ' + record.statusClass + '">' +
            '<span class="status-indicator-symbol" aria-hidden="true">' + record.statusSymbol + '</span> ' + record.statusText +
          '</span>' +
        '</div>' +
        '<div style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">' +
          record.subject +
        '</div>' +
        '<div class="metadata-inline" style="margin-bottom: 8px;">' +
          '<span>' + record.category + '</span>' +
          '<span class="metadata-sep">·</span>' +
          '<span>' + record.department + '</span>' +
          '<span class="metadata-sep">·</span>' +
          '<span>Officer: ' + record.officer + '</span>' +
        '</div>' +
        '<div class="flex-between" style="padding-top: 8px; border-top: 1px solid var(--border-color); font-size: 12px;">' +
          '<span class="font-mono text-muted">' + record.updated + '</span>' +
          '<a href="user/case.html" style="font-weight: 600;">Open Full Case Log →</a>' +
        '</div>';
    }

    if (trackerForm && trackerInput) {
      trackerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        renderCaseResult(trackerInput.value);
      });
    }

    sampleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sampleId = btn.getAttribute('data-sample-case');
        if (trackerInput) {
          trackerInput.value = sampleId;
        }
        renderCaseResult(sampleId);
      });
    });
  }

  /**
   * 6. Category Search & Filter on categories.html
   */
  function initCategoryFilter() {
    var searchInput = document.querySelector('[data-category-search]');
    var filterBtns = document.querySelectorAll('[data-category-group-btn]');
    var cards = document.querySelectorAll('[data-category-card]');
    var countEl = document.querySelector('[data-category-count]');

    if (!cards.length) return;

    var activeGroup = 'all';
    var searchQuery = '';

    function filterCategories() {
      var visible = 0;

      cards.forEach(function (card) {
        var group = (card.getAttribute('data-category-group') || '').toLowerCase();
        var text = (card.textContent || '').toLowerCase();

        var matchesGroup = activeGroup === 'all' || group === activeGroup;
        var matchesSearch = !searchQuery || text.indexOf(searchQuery) !== -1;

        if (matchesGroup && matchesSearch) {
          card.style.display = '';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countEl) {
        countEl.textContent = String(visible);
      }
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeGroup = (btn.getAttribute('data-category-group-btn') || 'all').toLowerCase();
        filterCategories();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQuery = searchInput.value.trim().toLowerCase();
        filterCategories();
      });
    }
  }

  /**
   * 7. FAQ Accordion on contact.html
   */
  function initFaqAccordion() {
    var triggers = document.querySelectorAll('[data-faq-trigger]');
    if (!triggers.length) return;

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('.faq-item');
        if (!item) return;

        var isOpen = item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  }

  /**
   * 8. Contact Form Validation (contact.html)
   */
  function initContactForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var nameInput = form.querySelector('[name="fullName"]');
      var emailInput = form.querySelector('[name="email"]');
      var subjectInput = form.querySelector('[name="subject"]');
      var messageInput = form.querySelector('[name="message"]');
      var feedbackBox = document.getElementById('contact-form-feedback');

      var isValid = true;
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      function setFieldState(input, valid, errorId) {
        if (!input) return;
        var errEl = errorId ? document.getElementById(errorId) : null;
        if (!valid) {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
          if (errEl) errEl.style.display = 'block';
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
          if (errEl) errEl.style.display = 'none';
        }
      }

      setFieldState(nameInput, nameInput && nameInput.value.trim().length >= 2, 'err-contact-name');
      setFieldState(emailInput, emailInput && emailRegex.test(emailInput.value.trim()), 'err-contact-email');
      setFieldState(subjectInput, subjectInput && subjectInput.value.trim().length >= 4, 'err-contact-subject');
      setFieldState(messageInput, messageInput && messageInput.value.trim().length >= 10, 'err-contact-message');

      if (!isValid) {
        showToast('Check Highlighted Fields', 'Please complete all required contact fields accurately.', 'danger');
        return;
      }

      if (feedbackBox) {
        feedbackBox.style.display = 'flex';
      }

      showToast(
        'Inquiry Received',
        'Thank you, ' + nameInput.value.trim() + '. Our Helpdesk team will respond within 4 business hours.',
        'success'
      );

      form.reset();
      form.querySelectorAll('.is-valid').forEach(function (el) {
        el.classList.remove('is-valid');
      });
    });
  }

  /**
   * 9. Authentication Page: Login / Register Tabs & Frontend Validation (auth.html)
   */
  function initAuthPage() {
    var tabButtons = document.querySelectorAll('[data-auth-switch]');
    var loginPanel = document.getElementById('auth-panel-login');
    var registerPanel = document.getElementById('auth-panel-register');
    var authTitle = document.getElementById('auth-dynamic-title');
    var authSubtitle = document.getElementById('auth-dynamic-subtitle');

    function switchAuthMode(mode) {
      if (!loginPanel || !registerPanel) return;

      tabButtons.forEach(function (btn) {
        var target = btn.getAttribute('data-auth-switch');
        btn.classList.toggle('active', target === mode);
        btn.setAttribute('aria-selected', target === mode ? 'true' : 'false');
      });

      if (mode === 'register') {
        loginPanel.style.display = 'none';
        registerPanel.style.display = 'block';
        if (authTitle) authTitle.textContent = 'Create Your ResolveHub Account';
        if (authSubtitle) authSubtitle.textContent = 'Register with your institutional credentials to lodge and track formal complaints.';
      } else {
        loginPanel.style.display = 'block';
        registerPanel.style.display = 'none';
        if (authTitle) authTitle.textContent = 'Sign In to ResolveHub';
        if (authSubtitle) authSubtitle.textContent = 'Access your complaint dashboard, case updates, and resolution logs.';
      }
    }

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-auth-switch');
        switchAuthMode(mode);
      });
    });

    // Support direct links like auth.html#register and hash changes
    if (window.location.hash === '#register') {
      switchAuthMode('register');
    }
    window.addEventListener('hashchange', function () {
      if (window.location.hash === '#register') {
        switchAuthMode('register');
      } else if (window.location.hash === '#login') {
        switchAuthMode('login');
      }
    });

    // Role selector highlight
    var roleOptions = document.querySelectorAll('[data-role-option]');
    roleOptions.forEach(function (option) {
      option.addEventListener('click', function () {
        var container = option.closest('.role-selector');
        if (container) {
          container.querySelectorAll('.role-option').forEach(function (el) {
            el.classList.remove('active');
          });
        }
        option.classList.add('active');
      });
    });

    // Login Form Validation
    var loginForm = document.querySelector('[data-login-form]');
    if (loginForm) {
      loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var emailInput = loginForm.querySelector('[name="loginEmail"]');
        var passInput = loginForm.querySelector('[name="loginPassword"]');
        var emailErr = document.getElementById('err-login-email');
        var passErr = document.getElementById('err-login-password');
        var successBanner = document.getElementById('login-success-banner');

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var valid = true;

        if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
          if (emailInput) emailInput.classList.add('is-invalid');
          if (emailErr) emailErr.style.display = 'block';
          valid = false;
        } else {
          emailInput.classList.remove('is-invalid');
          emailInput.classList.add('is-valid');
          if (emailErr) emailErr.style.display = 'none';
        }

        if (!passInput || passInput.value.length < 6) {
          if (passInput) passInput.classList.add('is-invalid');
          if (passErr) passErr.style.display = 'block';
          valid = false;
        } else {
          passInput.classList.remove('is-invalid');
          passInput.classList.add('is-valid');
          if (passErr) passErr.style.display = 'none';
        }

        if (!valid) {
          showToast('Sign-In Validation Error', 'Please enter a valid email address and password (min 6 characters).', 'danger');
          return;
        }

        if (successBanner) {
          successBanner.style.display = 'flex';
        }
        showToast('Credentials Verified', 'Frontend validation passed. Select a workspace portal to continue.', 'success');
      });
    }

    // Register Form Validation
    var registerForm = document.querySelector('[data-register-form]');
    if (registerForm) {
      registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var fullName = registerForm.querySelector('[name="fullName"]');
        var email = registerForm.querySelector('[name="email"]');
        var phone = registerForm.querySelector('[name="phone"]');
        var memberId = registerForm.querySelector('[name="memberId"]');
        var department = registerForm.querySelector('[name="department"]');
        var password = registerForm.querySelector('[name="password"]');
        var confirmPassword = registerForm.querySelector('[name="confirmPassword"]');
        var terms = registerForm.querySelector('[name="terms"]');
        var registerSuccess = document.getElementById('register-success-banner');

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var phoneRegex = /^[0-9+\-\s()]{7,20}$/;
        var valid = true;

        function checkField(el, condition, errId) {
          var errEl = document.getElementById(errId);
          if (!condition) {
            if (el) {
              el.classList.add('is-invalid');
              el.classList.remove('is-valid');
            }
            if (errEl) errEl.style.display = 'block';
            valid = false;
          } else {
            if (el) {
              el.classList.remove('is-invalid');
              el.classList.add('is-valid');
            }
            if (errEl) errEl.style.display = 'none';
          }
        }

        checkField(fullName, fullName && fullName.value.trim().length >= 3, 'err-reg-name');
        checkField(email, email && emailRegex.test(email.value.trim()), 'err-reg-email');
        checkField(phone, phone && phoneRegex.test(phone.value.trim()), 'err-reg-phone');
        checkField(memberId, memberId && memberId.value.trim().length >= 4, 'err-reg-id');
        checkField(department, department && department.value !== '', 'err-reg-dept');
        checkField(password, password && password.value.length >= 8, 'err-reg-pass');
        checkField(
          confirmPassword,
          confirmPassword && password && confirmPassword.value === password.value && confirmPassword.value.length >= 8,
          'err-reg-confirm'
        );

        var termsErr = document.getElementById('err-reg-terms');
        if (!terms || !terms.checked) {
          if (termsErr) termsErr.style.display = 'block';
          valid = false;
        } else if (termsErr) {
          termsErr.style.display = 'none';
        }

        if (!valid) {
          showToast('Registration Incomplete', 'Please fix the highlighted validation errors to create your account.', 'danger');
          return;
        }

        if (registerSuccess) {
          registerSuccess.style.display = 'flex';
        }
        showToast('Account Created', 'Welcome to ResolveHub, ' + fullName.value.trim() + '!', 'success');
      });
    }

    // Forgot Password Modal Form
    var forgotForm = document.querySelector('[data-forgot-form]');
    if (forgotForm) {
      forgotForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var resetEmail = forgotForm.querySelector('[name="resetEmail"]');
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!resetEmail || !emailRegex.test(resetEmail.value.trim())) {
          if (resetEmail) resetEmail.classList.add('is-invalid');
          showToast('Invalid Email', 'Please enter your registered institutional email address.', 'danger');
          return;
        }

        resetEmail.classList.remove('is-invalid');
        var modal = forgotForm.closest('.modal-backdrop');
        if (modal) modal.classList.remove('is-open');
        showToast('Password Reset Link Sent', 'Instructions have been sent to ' + resetEmail.value.trim() + '.', 'success');
        forgotForm.reset();
      });
    }
  }

  /**
   * 10. Staff Cases Table Multi-Filter & Tab Controller (staff/cases.html)
   */
  function initStaffCasesFilter() {
    var rows = document.querySelectorAll('[data-staff-case-row]');
    if (!rows.length) return;

    var searchInput = document.querySelector('[data-staff-search]');
    var categorySelect = document.querySelector('[data-staff-category]');
    var prioritySelect = document.querySelector('[data-staff-priority]');
    var statusSelect = document.querySelector('[data-staff-status]');
    var dateInput = document.querySelector('[data-staff-date]');
    var resetBtn = document.querySelector('[data-staff-reset]');
    var tabButtons = document.querySelectorAll('[data-staff-tab]');
    var countEl = document.querySelector('[data-staff-visible-count]');
    var emptyRow = document.getElementById('staff-cases-empty-row');

    function applyStaffFilters() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var category = categorySelect ? categorySelect.value.toLowerCase() : 'all';
      var priority = prioritySelect ? prioritySelect.value.toLowerCase() : 'all';
      var status = statusSelect ? statusSelect.value.toLowerCase() : 'all';
      var dateVal = dateInput ? dateInput.value.trim() : '';

      var visibleCount = 0;

      rows.forEach(function (row) {
        var rText = (row.textContent || '').toLowerCase();
        var rCategory = (row.getAttribute('data-category') || '').toLowerCase();
        var rPriority = (row.getAttribute('data-priority') || '').toLowerCase();
        var rStatus = (row.getAttribute('data-status') || '').toLowerCase();
        var rDate = row.getAttribute('data-date') || '';

        var matchSearch = !query || rText.indexOf(query) !== -1;
        var matchCat = category === 'all' || rCategory === category;
        var matchPrio = priority === 'all' || rPriority === priority;
        var matchStat = status === 'all' || rStatus === status;
        var matchDate = !dateVal || rDate === dateVal;

        if (matchSearch && matchCat && matchPrio && matchStat && matchDate) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (countEl) {
        countEl.textContent = String(visibleCount);
      }

      if (emptyRow) {
        emptyRow.style.display = visibleCount === 0 ? '' : 'none';
      }
    }

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tabStatus = (btn.getAttribute('data-staff-tab') || 'all').toLowerCase();
        tabButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        if (statusSelect) {
          statusSelect.value = tabStatus;
        }
        applyStaffFilters();
      });
    });

    if (statusSelect) {
      statusSelect.addEventListener('change', function () {
        var val = statusSelect.value.toLowerCase();
        tabButtons.forEach(function (b) {
          b.classList.toggle('active', (b.getAttribute('data-staff-tab') || '').toLowerCase() === val);
        });
        applyStaffFilters();
      });
    }

    if (searchInput) searchInput.addEventListener('input', applyStaffFilters);
    if (categorySelect) categorySelect.addEventListener('change', applyStaffFilters);
    if (prioritySelect) prioritySelect.addEventListener('change', applyStaffFilters);
    if (dateInput) dateInput.addEventListener('change', applyStaffFilters);

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = 'all';
        if (prioritySelect) prioritySelect.value = 'all';
        if (statusSelect) statusSelect.value = 'all';
        if (dateInput) dateInput.value = '';
        tabButtons.forEach(function (b) {
          b.classList.toggle('active', b.getAttribute('data-staff-tab') === 'all');
        });
        applyStaffFilters();
        showToast('Filters Cleared', 'Displaying all 10 assigned department cases.', 'info');
      });
    }
  }

  /**
   * 11. Staff Case Details Interactive Actions & Modals (staff/case.html)
   */
  function initStaffCaseDetails() {
    var caseDetailRoot = document.getElementById('staff-case-detail-page');
    if (!caseDetailRoot) return;

    var statusBadgeEl = document.getElementById('live-case-status-badge');
    var priorityLabelEl = document.getElementById('live-case-priority-label');
    var assignedOfficerEl = document.getElementById('live-case-assigned-officer');
    var timelineList = document.getElementById('case-timeline-list');
    var messageThread = document.getElementById('case-message-thread');

    function getCurrentTimestamp() {
      return 'Oct 03, 2026 · Just now';
    }

    function prependTimelineEntry(title, description, markerType) {
      if (!timelineList) return;
      var item = document.createElement('div');
      item.className = 'timeline-item';

      var markerClass = 'timeline-marker';
      if (markerType === 'resolved') markerClass += ' resolved';
      if (markerType === 'warning') markerClass += ' warning';

      item.innerHTML =
        '<div class="' + markerClass + '"></div>' +
        '<div class="timeline-header">' +
          '<span class="timeline-title">' + title + '</span>' +
          '<span class="timeline-time">' + getCurrentTimestamp() + '</span>' +
        '</div>' +
        '<p class="timeline-body">' + description + '</p>';

      timelineList.insertBefore(item, timelineList.firstChild);
    }

    function appendMessageCard(author, roleLabel, bodyText, cardVariant) {
      if (!messageThread) return;
      var card = document.createElement('article');
      card.className = 'message-card ' + (cardVariant || 'message-staff');
      card.innerHTML =
        '<div class="message-header">' +
          '<div>' +
            '<span class="message-author">' + author + '</span>' +
            '<span class="message-role">' + roleLabel + '</span>' +
          '</div>' +
          '<span class="message-time">' + getCurrentTimestamp() + '</span>' +
        '</div>' +
        '<p class="message-body"></p>';
      card.querySelector('.message-body').textContent = bodyText;
      messageThread.appendChild(card);
    }

    function updateStatusDisplay(statusKey) {
      if (!statusBadgeEl) return;
      var map = {
        'pending': { cls: 'status-pending', sym: '▲', label: 'Pending' },
        'in-progress': { cls: 'status-in-progress', sym: '●', label: 'In Progress' },
        'resolved': { cls: 'status-resolved', sym: '✓', label: 'Resolved' },
        'escalated': { cls: 'status-escalated', sym: '!', label: 'Escalated' }
      };
      var info = map[statusKey] || map['in-progress'];
      statusBadgeEl.className = 'status-badge ' + info.cls;
      statusBadgeEl.innerHTML =
        '<span class="status-indicator-symbol" aria-hidden="true">' + info.sym + '</span> ' + info.label;
    }

    function updatePriorityDisplay(prioKey) {
      if (!priorityLabelEl) return;
      var map = {
        'high': { cls: 'priority-high', label: 'High Priority' },
        'medium': { cls: 'priority-medium', label: 'Medium Priority' },
        'low': { cls: 'priority-low', label: 'Low Priority' }
      };
      var info = map[prioKey] || map['medium'];
      priorityLabelEl.className = 'priority-label ' + info.cls;
      priorityLabelEl.textContent = info.label;
    }

    // 1. Change Status Action
    var statusBtn = document.querySelector('[data-action-status-btn]');
    var statusSelect = document.getElementById('staff-action-status-select');
    if (statusBtn && statusSelect) {
      statusBtn.addEventListener('click', function () {
        var val = statusSelect.value;
        var text = statusSelect.options[statusSelect.selectedIndex].text;
        updateStatusDisplay(val);
        prependTimelineEntry(
          'Status Updated to ' + text,
          'Case status manually updated by Engr. Tunde Bakare.',
          val === 'resolved' ? 'resolved' : (val === 'escalated' ? 'warning' : '')
        );
        showToast('Status Updated', 'Case status changed to ' + text + '.', 'success');
      });
    }

    // 2. Change Priority Action
    var prioBtn = document.querySelector('[data-action-priority-btn]');
    var prioSelect = document.getElementById('staff-action-priority-select');
    if (prioBtn && prioSelect) {
      prioBtn.addEventListener('click', function () {
        var val = prioSelect.value;
        var text = prioSelect.options[prioSelect.selectedIndex].text;
        updatePriorityDisplay(val);
        prependTimelineEntry(
          'Priority Changed to ' + text,
          'SLA priority level adjusted by assigned officer.',
          val === 'high' ? 'warning' : ''
        );
        showToast('Priority Updated', 'Case priority set to ' + text + '.', 'info');
      });
    }

    // 3. Assign Case Action
    var assignBtn = document.querySelector('[data-action-assign-btn]');
    var assignSelect = document.getElementById('staff-action-assign-select');
    if (assignBtn && assignSelect) {
      assignBtn.addEventListener('click', function () {
        var officerName = assignSelect.options[assignSelect.selectedIndex].text;
        if (assignedOfficerEl) {
          assignedOfficerEl.textContent = officerName;
        }
        prependTimelineEntry(
          'Case Assigned to ' + officerName,
          'Ownership routed within ICT & Network Infrastructure Department.',
          ''
        );
        showToast('Case Assigned', 'Assigned to ' + officerName + '.', 'success');
      });
    }

    // 4. Request More Information Action
    var reqInfoBtn = document.querySelector('[data-action-request-info]');
    var reqInfoInput = document.getElementById('staff-request-info-input');
    if (reqInfoBtn) {
      reqInfoBtn.addEventListener('click', function () {
        var questionText = (reqInfoInput && reqInfoInput.value.trim())
          ? reqInfoInput.value.trim()
          : 'Could you please confirm the exact floor and room number in Engineering Block B where the authentication drop occurred, and share your device MAC address if available?';

        appendMessageCard(
          'Engr. Tunde Bakare',
          'Assigned Case Officer · Request for Information',
          questionText,
          'message-staff'
        );
        updateStatusDisplay('pending');
        prependTimelineEntry(
          'Additional Information Requested from Complainant',
          questionText,
          'warning'
        );
        if (reqInfoInput) reqInfoInput.value = '';
        showToast('Information Requested', 'Clarification request sent to Oluwaseun Adeyemi.', 'warning');
      });
    }

    // 5. Add Internal Note Action
    var noteBtn = document.querySelector('[data-action-internal-note]');
    var noteInput = document.getElementById('staff-internal-note-input');
    if (noteBtn) {
      noteBtn.addEventListener('click', function () {
        var noteText = (noteInput && noteInput.value.trim())
          ? noteInput.value.trim()
          : 'Internal Technical Note: Inspected Cisco RADIUS controller logs for Block B Access Point AP-ENG-04. DHCP lease pool exhausted; expanding subnet mask and rebooting controller.';

        appendMessageCard(
          'Engr. Tunde Bakare',
          'Internal Staff Audit Note (Visible to Staff & Admin Only)',
          noteText,
          'message-internal'
        );
        prependTimelineEntry(
          'Internal Investigation Note Recorded',
          noteText,
          ''
        );
        if (noteInput) noteInput.value = '';
        showToast('Internal Note Saved', 'Audit note added to internal case record.', 'success');
      });
    }

    // Public Conversation Reply Form
    var replyForm = document.querySelector('[data-staff-reply-form]');
    if (replyForm) {
      replyForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var textarea = replyForm.querySelector('textarea');
        if (!textarea || !textarea.value.trim()) {
          showToast('Message Empty', 'Please type a message before sending.', 'warning');
          return;
        }
        var msg = textarea.value.trim();
        appendMessageCard(
          'Engr. Tunde Bakare',
          'Senior Resolution Officer · ICT Unit',
          msg,
          'message-staff'
        );
        prependTimelineEntry('Official Staff Response Sent', msg, '');
        textarea.value = '';
        showToast('Reply Sent', 'Your message has been posted to the case thread.', 'success');
      });
    }

    // 6. Confirm Resolve Case Modal Handler
    var resolveForm = document.querySelector('[data-confirm-resolve-form]');
    if (resolveForm) {
      resolveForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var summaryInput = resolveForm.querySelector('[name="resolutionSummary"]');
        var summary = (summaryInput && summaryInput.value.trim())
          ? summaryInput.value.trim()
          : 'Replaced faulty PoE switch port on AP-ENG-04 and expanded DHCP pool. Verified stable 802.1X Wi-Fi authentication across all floors of Engineering Block B.';

        updateStatusDisplay('resolved');
        appendMessageCard(
          'Engr. Tunde Bakare',
          'Official Resolution Notice · Awaiting User Confirmation',
          'CASE RESOLVED: ' + summary,
          'message-staff'
        );
        prependTimelineEntry(
          'Case Marked as Resolved',
          summary,
          'resolved'
        );

        var modal = resolveForm.closest('.modal-backdrop');
        if (modal) modal.classList.remove('is-open');
        showToast('Case Resolved', 'Case #RH-2026-8492 marked as Resolved and sent for user confirmation.', 'success');
      });
    }

    // 7. Confirm Escalate Case Modal Handler
    var escalateForm = document.querySelector('[data-confirm-escalate-form]');
    if (escalateForm) {
      escalateForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var reasonInput = escalateForm.querySelector('[name="escalationReason"]');
        var targetSelect = escalateForm.querySelector('[name="escalationTarget"]');
        var reason = (reasonInput && reasonInput.value.trim())
          ? reasonInput.value.trim()
          : 'Core fiber uplink hardware replacement required; needs emergency capital approval from Central ICT Director.';
        var target = targetSelect
          ? targetSelect.options[targetSelect.selectedIndex].text
          : 'Chief ICT Director & System Administrator';

        updateStatusDisplay('escalated');
        updatePriorityDisplay('high');
        appendMessageCard(
          'Engr. Tunde Bakare',
          'Escalation Alert · Routed to ' + target,
          'CASE ESCALATED: ' + reason,
          'message-internal'
        );
        prependTimelineEntry(
          'Case Escalated to ' + target,
          reason,
          'warning'
        );

        var modal = escalateForm.closest('.modal-backdrop');
        if (modal) modal.classList.remove('is-open');
        showToast('Case Escalated', 'Case #RH-2026-8492 escalated to ' + target + '.', 'danger');
      });
    }
  }

  /**
   * 12. Toast Notification Generator
   */
  function showToast(title, message, type) {
    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    var variantClass = type ? 'toast-' + type : '';
    toast.className = 'toast ' + variantClass;

    var contentDiv = document.createElement('div');
    var titleEl = document.createElement('div');
    titleEl.className = 'alert-title';
    titleEl.textContent = title;

    var msgEl = document.createElement('div');
    msgEl.className = 'alert-text';
    msgEl.textContent = message;

    contentDiv.appendChild(titleEl);
    contentDiv.appendChild(msgEl);

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'alert-close';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', function () {
      toast.remove();
    });

    toast.appendChild(contentDiv);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    setTimeout(function () {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 4500);
  }

  /**
   * 13. Generic Workspace Tabs ([Users]/[Staff], [Departments]/[Categories], [Analytics]/[Feedback]/[System Settings])
   */
  function initWorkspaceTabs() {
    var tabButtons = document.querySelectorAll('[data-workspace-tab]');
    if (!tabButtons.length) return;

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-workspace-tab');
        var scope = btn.closest('[data-tab-scope]') || document;

        scope.querySelectorAll('[data-workspace-tab]').forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        scope.querySelectorAll('.tab-panel').forEach(function (panel) {
          panel.classList.toggle('is-active', panel.id === targetId);
        });
      });
    });
  }

  /**
   * 14. Admin Master Cases Filter, Tabs & Row Actions (admin/cases.html)
   */
  function initAdminCases() {
    var table = document.getElementById('admin-cases-table');
    if (!table) return;

    var searchInput = document.querySelector('[data-admin-filter-search]');
    var statusSelect = document.querySelector('[data-admin-filter-status]');
    var categorySelect = document.querySelector('[data-admin-filter-category]');
    var deptSelect = document.querySelector('[data-admin-filter-department]');
    var prioritySelect = document.querySelector('[data-admin-filter-priority]');
    var dateInput = document.querySelector('[data-admin-filter-date]');
    var resetButtons = document.querySelectorAll('[data-admin-filter-reset]');
    var tabButtons = document.querySelectorAll('[data-admin-case-tab]');
    var countBadge = document.querySelector('[data-admin-cases-count]');
    var emptyState = document.getElementById('admin-cases-empty');

    var activeRow = null;

    var statusConfig = {
      'pending': { label: 'Pending', badgeClass: 'badge-pending' },
      'in-progress': { label: 'In Progress', badgeClass: 'badge-progress' },
      'escalated': { label: 'Escalated', badgeClass: 'badge-escalated' },
      'resolved': { label: 'Resolved', badgeClass: 'badge-resolved' },
      'closed': { label: 'Closed', badgeClass: 'badge-closed' }
    };

    var priorityConfig = {
      'high': { label: 'High', prioClass: 'priority-high' },
      'medium': { label: 'Medium', prioClass: 'priority-medium' },
      'low': { label: 'Low', prioClass: 'priority-low' }
    };

    function applyAdminFilters() {
      var rows = table.querySelectorAll('tbody tr[data-admin-case-row]');
      var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      var statusVal = statusSelect ? statusSelect.value : 'all';
      var catVal = categorySelect ? categorySelect.value : 'all';
      var deptVal = deptSelect ? deptSelect.value : 'all';
      var prioVal = prioritySelect ? prioritySelect.value : 'all';
      var dateVal = dateInput ? dateInput.value : '';

      var visible = 0;

      rows.forEach(function (row) {
        var rText = row.textContent.toLowerCase();
        var rStatus = row.getAttribute('data-status') || '';
        var rCat = row.getAttribute('data-category') || '';
        var rDept = row.getAttribute('data-department') || '';
        var rPrio = row.getAttribute('data-priority') || '';
        var rDate = row.getAttribute('data-date') || '';

        var matchSearch = !query || rText.indexOf(query) !== -1;
        var matchStatus = statusVal === 'all' || rStatus === statusVal;
        var matchCat = catVal === 'all' || rCat === catVal;
        var matchDept = deptVal === 'all' || rDept === deptVal;
        var matchPrio = prioVal === 'all' || rPrio === prioVal;
        var matchDate = !dateVal || rDate === dateVal;

        var show = matchSearch && matchStatus && matchCat && matchDept && matchPrio && matchDate;
        row.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      if (countBadge) {
        countBadge.textContent = 'Showing ' + visible + ' of ' + rows.length + ' cases';
      }
      if (emptyState) {
        emptyState.style.display = visible === 0 ? 'block' : 'none';
      }
    }

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tabStatus = btn.getAttribute('data-admin-case-tab') || 'all';
        tabButtons.forEach(function (b) {
          var isAct = b === btn;
          b.classList.toggle('active', isAct);
          b.setAttribute('aria-selected', isAct ? 'true' : 'false');
        });
        if (statusSelect) {
          statusSelect.value = tabStatus;
        }
        applyAdminFilters();
      });
    });

    if (statusSelect) {
      statusSelect.addEventListener('change', function () {
        var val = statusSelect.value;
        tabButtons.forEach(function (b) {
          var isAct = b.getAttribute('data-admin-case-tab') === val;
          b.classList.toggle('active', isAct);
          b.setAttribute('aria-selected', isAct ? 'true' : 'false');
        });
        applyAdminFilters();
      });
    }

    if (searchInput) searchInput.addEventListener('input', applyAdminFilters);
    if (categorySelect) categorySelect.addEventListener('change', applyAdminFilters);
    if (deptSelect) deptSelect.addEventListener('change', applyAdminFilters);
    if (prioritySelect) prioritySelect.addEventListener('change', applyAdminFilters);
    if (dateInput) dateInput.addEventListener('change', applyAdminFilters);

    resetButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        if (statusSelect) statusSelect.value = 'all';
        if (categorySelect) categorySelect.value = 'all';
        if (deptSelect) deptSelect.value = 'all';
        if (prioritySelect) prioritySelect.value = 'all';
        if (dateInput) dateInput.value = '';

        tabButtons.forEach(function (b) {
          var isAll = b.getAttribute('data-admin-case-tab') === 'all';
          b.classList.toggle('active', isAll);
          b.setAttribute('aria-selected', isAll ? 'true' : 'false');
        });
        applyAdminFilters();
      });
    });

    // Row Action Buttons (View, Assign, Status, Priority, Escalate)
    table.addEventListener('click', function (event) {
      var btn = event.target.closest('[data-admin-case-action]');
      if (!btn) return;

      var row = btn.closest('tr[data-admin-case-row]');
      if (!row) return;
      activeRow = row;

      var action = btn.getAttribute('data-admin-case-action');
      var caseId = row.getAttribute('data-case-id') || '#RH-2026-0000';

      document.querySelectorAll('[data-modal-case-id]').forEach(function (el) {
        el.textContent = caseId;
      });

      if (action === 'view') {
        var viewModal = document.getElementById('modal-admin-view-case');
        if (viewModal) {
          var subjEl = viewModal.querySelector('[data-modal-case-subject]');
          var userEl = viewModal.querySelector('[data-modal-case-user]');
          var catEl = viewModal.querySelector('[data-modal-case-category]');
          var deptEl = viewModal.querySelector('[data-modal-case-dept]');
          var offEl = viewModal.querySelector('[data-modal-case-officer]');
          var dateEl = viewModal.querySelector('[data-modal-case-date]');

          if (subjEl) subjEl.textContent = row.getAttribute('data-subject') || '';
          if (userEl) userEl.textContent = row.getAttribute('data-user') || '';
          if (catEl) catEl.textContent = row.getAttribute('data-category') || '';
          if (deptEl) deptEl.textContent = row.getAttribute('data-department') || '';
          if (offEl) offEl.textContent = row.getAttribute('data-officer') || '';
          if (dateEl) dateEl.textContent = row.getAttribute('data-date') || '';

          viewModal.classList.add('is-open');
        }
      } else if (action === 'assign') {
        var assignModal = document.getElementById('modal-admin-assign-case');
        if (assignModal) assignModal.classList.add('is-open');
      } else if (action === 'status') {
        var statusModal = document.getElementById('modal-admin-status-case');
        var sel = document.getElementById('admin-new-status');
        if (sel) sel.value = row.getAttribute('data-status') || 'in-progress';
        if (statusModal) statusModal.classList.add('is-open');
      } else if (action === 'priority') {
        var prioModal = document.getElementById('modal-admin-priority-case');
        var prioSel = document.getElementById('admin-new-priority');
        if (prioSel) prioSel.value = row.getAttribute('data-priority') || 'medium';
        if (prioModal) prioModal.classList.add('is-open');
      } else if (action === 'escalate') {
        var escModal = document.getElementById('modal-admin-escalate-case');
        if (escModal) escModal.classList.add('is-open');
      }
    });

    // Assign Form Submit
    var assignForm = document.querySelector('[data-admin-assign-form]');
    if (assignForm) {
      assignForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!activeRow) return;
        var dept = assignForm.querySelector('[name="department"]').value;
        var officer = assignForm.querySelector('[name="officer"]').value;
        var caseId = activeRow.getAttribute('data-case-id');

        activeRow.setAttribute('data-department', dept);
        activeRow.setAttribute('data-officer', officer);
        var deptCell = activeRow.querySelector('[data-cell-dept]');
        var officerCell = activeRow.querySelector('[data-cell-officer]');
        if (deptCell) deptCell.textContent = dept;
        if (officerCell) officerCell.textContent = officer;

        assignForm.closest('.modal-backdrop').classList.remove('is-open');
        showToast('Case Assigned', caseId + ' assigned to ' + officer + ' (' + dept + ').', 'success');
      });
    }

    // Status Form Submit
    var statusForm = document.querySelector('[data-admin-status-form]');
    if (statusForm) {
      statusForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!activeRow) return;
        var newStatus = statusForm.querySelector('[name="status"]').value;
        var cfg = statusConfig[newStatus] || statusConfig['in-progress'];
        var caseId = activeRow.getAttribute('data-case-id');

        activeRow.setAttribute('data-status', newStatus);
        var statusCell = activeRow.querySelector('[data-cell-status]');
        if (statusCell) {
          statusCell.innerHTML = '<span class="badge ' + cfg.badgeClass + '"><span class="badge-dot"></span>' + cfg.label + '</span>';
        }

        statusForm.closest('.modal-backdrop').classList.remove('is-open');
        applyAdminFilters();
        showToast('Status Updated', caseId + ' status changed to ' + cfg.label + '.', 'info');
      });
    }

    // Priority Form Submit
    var prioForm = document.querySelector('[data-admin-priority-form]');
    if (prioForm) {
      prioForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!activeRow) return;
        var newPrio = prioForm.querySelector('[name="priority"]').value;
        var cfg = priorityConfig[newPrio] || priorityConfig['medium'];
        var caseId = activeRow.getAttribute('data-case-id');

        activeRow.setAttribute('data-priority', newPrio);
        var prioCell = activeRow.querySelector('[data-cell-priority]');
        if (prioCell) {
          prioCell.innerHTML = '<span class="priority-indicator ' + cfg.prioClass + '"><span class="priority-dot"></span>' + cfg.label + '</span>';
        }

        prioForm.closest('.modal-backdrop').classList.remove('is-open');
        applyAdminFilters();
        showToast('Priority Updated', caseId + ' urgency set to ' + cfg.label + '.', 'warning');
      });
    }

    // Escalate Form Submit
    var escForm = document.querySelector('[data-admin-escalate-form]');
    if (escForm) {
      escForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!activeRow) return;
        var caseId = activeRow.getAttribute('data-case-id');

        activeRow.setAttribute('data-status', 'escalated');
        activeRow.setAttribute('data-priority', 'high');

        var statusCell = activeRow.querySelector('[data-cell-status]');
        var prioCell = activeRow.querySelector('[data-cell-priority]');
        if (statusCell) {
          statusCell.innerHTML = '<span class="badge badge-escalated"><span class="badge-dot"></span>Escalated</span>';
        }
        if (prioCell) {
          prioCell.innerHTML = '<span class="priority-indicator priority-high"><span class="priority-dot"></span>High</span>';
        }

        escForm.closest('.modal-backdrop').classList.remove('is-open');
        applyAdminFilters();
        showToast('Case Escalated', caseId + ' escalated to High Priority with Department Head notification.', 'danger');
      });
    }
  }

  /**
   * 15. Admin Users & Staff Directory (admin/users.html)
   */
  function initAdminUsers() {
    var usersTable = document.getElementById('admin-users-table');
    var staffTable = document.getElementById('admin-staff-table');
    if (!usersTable && !staffTable) return;

    var searchInput = document.querySelector('[data-directory-search]');
    var addForm = document.querySelector('[data-admin-add-account-form]');
    var editForm = document.querySelector('[data-admin-edit-account-form]');
    var editingRow = null;

    // Live Directory Search
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        var q = searchInput.value.toLowerCase().trim();
        document.querySelectorAll('tr[data-directory-row]').forEach(function (row) {
          var match = !q || row.textContent.toLowerCase().indexOf(q) !== -1;
          row.style.display = match ? '' : 'none';
        });
      });
    }

    // Quick Add Role Buttons
    document.querySelectorAll('[data-open-add-role]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var role = btn.getAttribute('data-open-add-role');
        var roleSelect = document.getElementById('add-account-role');
        if (roleSelect && role) roleSelect.value = role;
        var modal = document.getElementById('modal-admin-add-account');
        if (modal) modal.classList.add('is-open');
      });
    });

    // Row Edit & Activate/Deactivate Actions
    document.addEventListener('click', function (event) {
      var toggleBtn = event.target.closest('[data-toggle-account-status]');
      if (toggleBtn) {
        var row = toggleBtn.closest('tr[data-directory-row]');
        if (!row) return;
        var current = row.getAttribute('data-status') || 'active';
        var next = current === 'active' ? 'inactive' : 'active';
        var name = row.getAttribute('data-name') || 'Account';

        row.setAttribute('data-status', next);
        var statusCell = row.querySelector('[data-col-status]');
        if (statusCell) {
          statusCell.innerHTML = next === 'active'
            ? '<span class="badge badge-resolved"><span class="badge-dot"></span>Active</span>'
            : '<span class="badge badge-closed"><span class="badge-dot"></span>Inactive</span>';
        }
        toggleBtn.textContent = next === 'active' ? 'Deactivate' : 'Activate';
        toggleBtn.className = next === 'active' ? 'btn btn-secondary btn-xs' : 'btn btn-accent btn-xs';

        showToast(
          next === 'active' ? 'Account Activated' : 'Account Deactivated',
          name + ' is now ' + next + '.',
          next === 'active' ? 'success' : 'warning'
        );
        return;
      }

      var editBtn = event.target.closest('[data-edit-account]');
      if (editBtn) {
        var editRow = editBtn.closest('tr[data-directory-row]');
        if (!editRow) return;
        editingRow = editRow;

        var nameInput = document.getElementById('edit-account-name');
        var emailInput = document.getElementById('edit-account-email');
        var deptInput = document.getElementById('edit-account-dept');
        var statusSelect = document.getElementById('edit-account-status');

        if (nameInput) nameInput.value = editRow.getAttribute('data-name') || '';
        if (emailInput) emailInput.value = editRow.getAttribute('data-email') || '';
        if (deptInput) deptInput.value = editRow.getAttribute('data-department') || '';
        if (statusSelect) statusSelect.value = editRow.getAttribute('data-status') || 'active';

        var modal = document.getElementById('modal-admin-edit-account');
        if (modal) modal.classList.add('is-open');
      }
    });

    // Add Account Form Submit
    if (addForm) {
      addForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var role = addForm.querySelector('[name="accountRole"]').value;
        var idNum = addForm.querySelector('[name="accountId"]').value.trim() || 'ID/2026/9012';
        var name = addForm.querySelector('[name="fullName"]').value.trim();
        var email = addForm.querySelector('[name="email"]').value.trim();
        var dept = addForm.querySelector('[name="department"]').value;
        var status = addForm.querySelector('[name="status"]').value;

        if (!name || !email) {
          showToast('Validation Error', 'Please provide both Full Name and Institutional Email.', 'danger');
          return;
        }

        var badgeHtml = status === 'active'
          ? '<span class="badge badge-resolved"><span class="badge-dot"></span>Active</span>'
          : '<span class="badge badge-closed"><span class="badge-dot"></span>Inactive</span>';
        var toggleText = status === 'active' ? 'Deactivate' : 'Activate';
        var toggleClass = status === 'active' ? 'btn btn-secondary btn-xs' : 'btn btn-accent btn-xs';

        var tr = document.createElement('tr');
        tr.setAttribute('data-directory-row', '');
        tr.setAttribute('data-account-type', role);
        tr.setAttribute('data-name', name);
        tr.setAttribute('data-email', email);
        tr.setAttribute('data-id-num', idNum);
        tr.setAttribute('data-department', dept);
        tr.setAttribute('data-status', status);

        if (role === 'staff' && staffTable) {
          tr.innerHTML =
            '<td class="cell-primary" data-col-name>' + name + '</td>' +
            '<td data-col-email>' + email + '</td>' +
            '<td data-col-dept>' + dept + '</td>' +
            '<td class="text-mono">0 active cases</td>' +
            '<td data-col-status>' + badgeHtml + '</td>' +
            '<td class="text-right"><div class="table-actions">' +
              '<button type="button" class="btn btn-secondary btn-xs" data-edit-account>Edit</button>' +
              '<button type="button" class="' + toggleClass + '" data-toggle-account-status>' + toggleText + '</button>' +
            '</div></td>';
          staffTable.querySelector('tbody').prepend(tr);
        } else if (usersTable) {
          tr.innerHTML =
            '<td class="cell-primary" data-col-name>' + name + '</td>' +
            '<td data-col-email>' + email + '</td>' +
            '<td class="text-mono" data-col-id>' + idNum + '</td>' +
            '<td data-col-dept>' + dept + '</td>' +
            '<td data-col-status>' + badgeHtml + '</td>' +
            '<td class="text-mono">2026-10-03</td>' +
            '<td class="text-right"><div class="table-actions">' +
              '<button type="button" class="btn btn-secondary btn-xs" data-edit-account>Edit</button>' +
              '<button type="button" class="' + toggleClass + '" data-toggle-account-status>' + toggleText + '</button>' +
            '</div></td>';
          usersTable.querySelector('tbody').prepend(tr);
        }

        addForm.reset();
        addForm.closest('.modal-backdrop').classList.remove('is-open');
        showToast('Account Created', name + ' added to the ' + (role === 'staff' ? 'Staff' : 'Users') + ' directory.', 'success');
      });
    }

    // Edit Account Form Submit
    if (editForm) {
      editForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!editingRow) return;

        var name = editForm.querySelector('[name="fullName"]').value.trim();
        var email = editForm.querySelector('[name="email"]').value.trim();
        var dept = editForm.querySelector('[name="department"]').value.trim();
        var status = editForm.querySelector('[name="status"]').value;

        editingRow.setAttribute('data-name', name);
        editingRow.setAttribute('data-email', email);
        editingRow.setAttribute('data-department', dept);
        editingRow.setAttribute('data-status', status);

        var nameCol = editingRow.querySelector('[data-col-name]');
        var emailCol = editingRow.querySelector('[data-col-email]');
        var deptCol = editingRow.querySelector('[data-col-dept]');
        var statusCol = editingRow.querySelector('[data-col-status]');
        var toggleBtn = editingRow.querySelector('[data-toggle-account-status]');

        if (nameCol) nameCol.textContent = name;
        if (emailCol) emailCol.textContent = email;
        if (deptCol) deptCol.textContent = dept;
        if (statusCol) {
          statusCol.innerHTML = status === 'active'
            ? '<span class="badge badge-resolved"><span class="badge-dot"></span>Active</span>'
            : '<span class="badge badge-closed"><span class="badge-dot"></span>Inactive</span>';
        }
        if (toggleBtn) {
          toggleBtn.textContent = status === 'active' ? 'Deactivate' : 'Activate';
          toggleBtn.className = status === 'active' ? 'btn btn-secondary btn-xs' : 'btn btn-accent btn-xs';
        }

        editForm.closest('.modal-backdrop').classList.remove('is-open');
        showToast('Profile Updated', 'Changes saved for ' + name + '.', 'success');
      });
    }
  }

  /**
   * 16. Admin Department & Category Management (admin/management.html)
   */
  function initAdminManagement() {
    var deptsTable = document.getElementById('admin-departments-table');
    var catsTable = document.getElementById('admin-categories-table');
    if (!deptsTable && !catsTable) return;

    var activeMgmtRow = null;

    // Row Actions: Edit Dept, Edit Category, Assign Dept, Activate/Deactivate, Delete
    document.addEventListener('click', function (event) {
      var toggleBtn = event.target.closest('[data-toggle-mgmt-status]');
      if (toggleBtn) {
        var row = toggleBtn.closest('tr[data-mgmt-row]');
        if (!row) return;
        var current = row.getAttribute('data-status') || 'active';
        var next = current === 'active' ? 'inactive' : 'active';
        var name = row.getAttribute('data-name') || 'Item';

        row.setAttribute('data-status', next);
        var statusCell = row.querySelector('[data-col-status]');
        if (statusCell) {
          statusCell.innerHTML = next === 'active'
            ? '<span class="badge badge-resolved"><span class="badge-dot"></span>Active</span>'
            : '<span class="badge badge-closed"><span class="badge-dot"></span>Inactive</span>';
        }
        toggleBtn.textContent = next === 'active' ? 'Deactivate' : 'Activate';
        toggleBtn.className = next === 'active' ? 'btn btn-secondary btn-xs' : 'btn btn-accent btn-xs';

        showToast('Status Updated', name + ' marked as ' + next + '.', 'info');
        return;
      }

      var deleteBtn = event.target.closest('[data-delete-mgmt-row]');
      if (deleteBtn) {
        var delRow = deleteBtn.closest('tr[data-mgmt-row]');
        if (!delRow) return;
        activeMgmtRow = delRow;
        var delName = delRow.getAttribute('data-name') || 'Record';
        var confirmModal = document.getElementById('modal-confirm-delete');
        if (confirmModal) {
          var nameSpan = confirmModal.querySelector('[data-delete-item-name]');
          if (nameSpan) nameSpan.textContent = delName;
          confirmModal.classList.add('is-open');
        } else {
          delRow.remove();
          showToast('Record Deleted', delName + ' has been removed from system configuration.', 'danger');
        }
        return;
      }

      var confirmDelBtn = event.target.closest('[data-confirm-delete-btn]');
      if (confirmDelBtn && activeMgmtRow) {
        var removedName = activeMgmtRow.getAttribute('data-name') || 'Record';
        activeMgmtRow.remove();
        activeMgmtRow = null;
        var cModal = document.getElementById('modal-confirm-delete');
        if (cModal) cModal.classList.remove('is-open');
        showToast('Record Deleted', removedName + ' has been permanently removed.', 'danger');
        return;
      }

      var editDeptBtn = event.target.closest('[data-edit-department]');
      if (editDeptBtn) {
        var dRow = editDeptBtn.closest('tr[data-mgmt-row]');
        if (!dRow) return;
        activeMgmtRow = dRow;

        document.getElementById('dept-edit-code').value = dRow.getAttribute('data-code') || '';
        document.getElementById('dept-edit-name').value = dRow.getAttribute('data-name') || '';
        document.getElementById('dept-edit-head').value = dRow.getAttribute('data-head') || '';
        document.getElementById('dept-edit-email').value = dRow.getAttribute('data-email') || '';

        document.getElementById('modal-edit-department').classList.add('is-open');
        return;
      }

      var editCatBtn = event.target.closest('[data-edit-category]');
      if (editCatBtn) {
        var cRow = editCatBtn.closest('tr[data-mgmt-row]');
        if (!cRow) return;
        activeMgmtRow = cRow;

        document.getElementById('cat-edit-name').value = cRow.getAttribute('data-name') || '';
        document.getElementById('cat-edit-desc').value = cRow.getAttribute('data-desc') || '';
        document.getElementById('cat-edit-dept').value = cRow.getAttribute('data-dept') || 'ICT & Infrastructure';
        document.getElementById('cat-edit-sla').value = cRow.getAttribute('data-sla') || '24 Hours';

        document.getElementById('modal-edit-category').classList.add('is-open');
        return;
      }

      var assignCatBtn = event.target.closest('[data-assign-category-dept]');
      if (assignCatBtn) {
        var aRow = assignCatBtn.closest('tr[data-mgmt-row]');
        if (!aRow) return;
        activeMgmtRow = aRow;

        var labelEl = document.querySelector('[data-assign-cat-label]');
        if (labelEl) labelEl.textContent = aRow.getAttribute('data-name') || 'Category';
        document.getElementById('cat-route-dept').value = aRow.getAttribute('data-dept') || 'ICT & Infrastructure';

        document.getElementById('modal-assign-category-dept').classList.add('is-open');
      }
    });

    // Add Department Submit
    var addDeptForm = document.querySelector('[data-add-department-form]');
    if (addDeptForm && deptsTable) {
      addDeptForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var code = addDeptForm.querySelector('[name="code"]').value.trim() || 'DEPT-NEW';
        var name = addDeptForm.querySelector('[name="name"]').value.trim();
        var head = addDeptForm.querySelector('[name="head"]').value.trim();
        var email = addDeptForm.querySelector('[name="email"]').value.trim();

        if (!name) return;

        var tr = document.createElement('tr');
        tr.setAttribute('data-mgmt-row', '');
        tr.setAttribute('data-entity-type', 'department');
        tr.setAttribute('data-code', code);
        tr.setAttribute('data-name', name);
        tr.setAttribute('data-head', head);
        tr.setAttribute('data-email', email);
        tr.setAttribute('data-status', 'active');

        tr.innerHTML =
          '<td class="cell-id" data-col-code>' + code + '</td>' +
          '<td class="cell-primary" data-col-name>' + name + '</td>' +
          '<td data-col-head>' + head + '</td>' +
          '<td data-col-email>' + email + '</td>' +
          '<td class="text-mono">5 officers</td>' +
          '<td data-col-status><span class="badge badge-resolved"><span class="badge-dot"></span>Active</span></td>' +
          '<td class="text-right"><div class="table-actions">' +
            '<button type="button" class="btn btn-secondary btn-xs" data-edit-department>Edit</button>' +
            '<button type="button" class="btn btn-secondary btn-xs" data-toggle-mgmt-status>Deactivate</button>' +
            '<button type="button" class="btn btn-danger btn-xs" data-delete-mgmt-row>Delete</button>' +
          '</div></td>';

        deptsTable.querySelector('tbody').prepend(tr);
        addDeptForm.reset();
        addDeptForm.closest('.modal-backdrop').classList.remove('is-open');
        showToast('Department Added', name + ' (' + code + ') created.', 'success');
      });
    }

    // Edit Department Submit
    var editDeptForm = document.querySelector('[data-edit-department-form]');
    if (editDeptForm) {
      editDeptForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!activeMgmtRow) return;

        var code = editDeptForm.querySelector('[name="code"]').value.trim();
        var name = editDeptForm.querySelector('[name="name"]').value.trim();
        var head = editDeptForm.querySelector('[name="head"]').value.trim();
        var email = editDeptForm.querySelector('[name="email"]').value.trim();

        activeMgmtRow.setAttribute('data-code', code);
        activeMgmtRow.setAttribute('data-name', name);
        activeMgmtRow.setAttribute('data-head', head);
        activeMgmtRow.setAttribute('data-email', email);

        activeMgmtRow.querySelector('[data-col-code]').textContent = code;
        activeMgmtRow.querySelector('[data-col-name]').textContent = name;
        activeMgmtRow.querySelector('[data-col-head]').textContent = head;
        activeMgmtRow.querySelector('[data-col-email]').textContent = email;

        editDeptForm.closest('.modal-backdrop').classList.remove('is-open');
        showToast('Department Updated', name + ' details saved.', 'success');
      });
    }

    // Add Category Submit
    var addCatForm = document.querySelector('[data-add-category-form]');
    if (addCatForm && catsTable) {
      addCatForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var name = addCatForm.querySelector('[name="name"]').value.trim();
        var desc = addCatForm.querySelector('[name="description"]').value.trim();
        var dept = addCatForm.querySelector('[name="department"]').value;
        var sla = addCatForm.querySelector('[name="sla"]').value;

        if (!name) return;

        var tr = document.createElement('tr');
        tr.setAttribute('data-mgmt-row', '');
        tr.setAttribute('data-entity-type', 'category');
        tr.setAttribute('data-name', name);
        tr.setAttribute('data-desc', desc);
        tr.setAttribute('data-dept', dept);
        tr.setAttribute('data-sla', sla);
        tr.setAttribute('data-status', 'active');

        tr.innerHTML =
          '<td class="cell-primary" data-col-name>' + name + '</td>' +
          '<td data-col-desc>' + desc + '</td>' +
          '<td data-col-dept><span class="badge badge-neutral">' + dept + '</span></td>' +
          '<td class="text-mono" data-col-sla>' + sla + '</td>' +
          '<td data-col-status><span class="badge badge-resolved"><span class="badge-dot"></span>Active</span></td>' +
          '<td class="text-right"><div class="table-actions">' +
            '<button type="button" class="btn btn-secondary btn-xs" data-assign-category-dept>Assign Dept</button>' +
            '<button type="button" class="btn btn-secondary btn-xs" data-edit-category>Edit</button>' +
            '<button type="button" class="btn btn-secondary btn-xs" data-toggle-mgmt-status>Deactivate</button>' +
            '<button type="button" class="btn btn-danger btn-xs" data-delete-mgmt-row>Delete</button>' +
          '</div></td>';

        catsTable.querySelector('tbody').prepend(tr);
        addCatForm.reset();
        addCatForm.closest('.modal-backdrop').classList.remove('is-open');
        showToast('Category Added', name + ' mapped to ' + dept + '.', 'success');
      });
    }

    // Edit Category Submit
    var editCatForm = document.querySelector('[data-edit-category-form]');
    if (editCatForm) {
      editCatForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!activeMgmtRow) return;

        var name = editCatForm.querySelector('[name="name"]').value.trim();
        var desc = editCatForm.querySelector('[name="description"]').value.trim();
        var dept = editCatForm.querySelector('[name="department"]').value;
        var sla = editCatForm.querySelector('[name="sla"]').value;

        activeMgmtRow.setAttribute('data-name', name);
        activeMgmtRow.setAttribute('data-desc', desc);
        activeMgmtRow.setAttribute('data-dept', dept);
        activeMgmtRow.setAttribute('data-sla', sla);

        activeMgmtRow.querySelector('[data-col-name]').textContent = name;
        activeMgmtRow.querySelector('[data-col-desc]').textContent = desc;
        activeMgmtRow.querySelector('[data-col-dept]').innerHTML = '<span class="badge badge-neutral">' + dept + '</span>';
        activeMgmtRow.querySelector('[data-col-sla]').textContent = sla;

        editCatForm.closest('.modal-backdrop').classList.remove('is-open');
        showToast('Category Updated', name + ' configuration saved.', 'success');
      });
    }

    // Assign Category to Department Submit
    var assignCatForm = document.querySelector('[data-assign-category-dept-form]');
    if (assignCatForm) {
      assignCatForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!activeMgmtRow) return;

        var dept = assignCatForm.querySelector('[name="department"]').value;
        var catName = activeMgmtRow.getAttribute('data-name') || 'Category';

        activeMgmtRow.setAttribute('data-dept', dept);
        activeMgmtRow.querySelector('[data-col-dept]').innerHTML = '<span class="badge badge-neutral">' + dept + '</span>';

        assignCatForm.closest('.modal-backdrop').classList.remove('is-open');
        showToast('Routing Updated', catName + ' complaints now route to ' + dept + '.', 'success');
      });
    }
  }

  /**
   * 17. Admin System Settings Form (admin/settings.html)
   */
  function initAdminSettings() {
    var form = document.querySelector('[data-admin-system-settings-form]');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      showToast(
        'System Settings Saved',
        'SLA deadlines, notification triggers, and auto-escalation rules have been updated.',
        'success'
      );
    });
  }

  /**
   * ==========================================================================
   * 18. LOCAL FRONTEND DATA STORE (Simulates future Django ORM / Context Data)
   * ==========================================================================
   */
  var ResolveHubData = {
    nextSequenceNumber: 8501,
    categoryRouting: {
      'ICT': 'ICT & Infrastructure',
      'Academic': 'Academic Affairs & Exams',
      'Finance/Bursary': 'Bursary & Student Accounts',
      'Accommodation': 'Student Affairs & Hostels',
      'Security': 'Campus Security Unit',
      'Facilities': 'Facilities & Works',
      'Administration': 'Central Registry & Admin',
      'Other': 'Student Affairs & Hostels'
    },
    starRatingDescriptions: {
      1: '1 Star — Very Dissatisfied',
      2: '2 Stars — Subpar Resolution',
      3: '3 Stars — Satisfactory',
      4: '4 Stars — Good Resolution',
      5: '5 Stars — Excellent & Transparent'
    },
    userComplaints: [
      {
        caseId: '#RH-2026-8492',
        subject: 'Wi-Fi outage across Block C Postgraduate Hostel',
        category: 'ICT',
        department: 'ICT & Infrastructure',
        priority: 'high',
        status: 'in-progress',
        date: '2026-10-03'
      }
    ]
  };

  /**
   * Helper: Automatic Dummy Case ID Generator (#RH-2026-XXXX)
   */
  function generateDummyCaseId() {
    var id = '#RH-2026-' + ResolveHubData.nextSequenceNumber;
    ResolveHubData.nextSequenceNumber += 1;
    return id;
  }

  /**
   * 19. Dropdown Menus (Topbar & Action Dropdowns)
   */
  function initDropdowns() {
    var dropdowns = document.querySelectorAll('[data-dropdown]');
    if (!dropdowns.length) return;

    document.addEventListener('click', function (event) {
      var toggle = event.target.closest('[data-dropdown-toggle]');
      if (toggle) {
        event.stopPropagation();
        var parentDropdown = toggle.closest('[data-dropdown]');
        var willOpen = !parentDropdown.classList.contains('is-open');

        // Close any other open dropdowns first
        dropdowns.forEach(function (d) {
          d.classList.remove('is-open');
          var t = d.querySelector('[data-dropdown-toggle]');
          if (t) t.setAttribute('aria-expanded', 'false');
        });

        if (willOpen) {
          parentDropdown.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
        }
        return;
      }

      // Close dropdowns when clicking outside
      dropdowns.forEach(function (d) {
        d.classList.remove('is-open');
        var t = d.querySelector('[data-dropdown-toggle]');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        dropdowns.forEach(function (d) {
          d.classList.remove('is-open');
        });
      }
    });
  }

  /**
   * 20. Global Password Visibility Toggle (Works on auth.html & user/profile.html)
   */
  function initPasswordToggles() {
    var toggleButtons = document.querySelectorAll('[data-password-toggle]');
    toggleButtons.forEach(function (btn) {
      if (btn.getAttribute('data-bound-toggle') === 'true') return;
      btn.setAttribute('data-bound-toggle', 'true');

      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-password-toggle');
        var input = targetId ? document.getElementById(targetId) : null;
        if (!input) {
          var wrapper = btn.closest('.password-wrapper, .password-input-wrapper');
          if (wrapper) input = wrapper.querySelector('input');
        }
        if (!input) return;

        var isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.textContent = isPassword ? 'Hide' : 'Show';
      });
    });
  }

  /**
   * 21. Show / Hide Collapsible Dashboard Sections
   */
  function initCollapsibleSections() {
    var buttons = document.querySelectorAll('[data-toggle-section]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-toggle-section');
        var targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        var isHidden = targetEl.classList.toggle('is-hidden');
        showToast(
          isHidden ? 'Section Hidden' : 'Section Restored',
          isHidden ? 'Dashboard section collapsed.' : 'Dashboard section expanded.',
          'info'
        );
      });
    });
  }

  /**
   * 22. Complaint Submission & Automatic Case ID Generation (user/dashboard.html & user/submit.html)
   */
  function initComplaintSubmission() {
    // Auto-preview Assigned Department when user selects a Category
    var categoryAutoSelect = document.querySelector('[data-category-auto-route]');
    var routedDeptDisplay = document.querySelector('[data-routed-dept-display]');
    if (categoryAutoSelect && routedDeptDisplay) {
      categoryAutoSelect.addEventListener('change', function () {
        var cat = categoryAutoSelect.value;
        routedDeptDisplay.value = ResolveHubData.categoryRouting[cat] || 'Select a category to preview routing...';
      });
    }

    // File input filename preview
    var fileInput = document.querySelector('[data-file-input]');
    var fileHint = document.querySelector('[data-file-hint]');
    if (fileInput && fileHint) {
      fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files.length > 0) {
          fileHint.textContent = 'Selected file: ' + fileInput.files[0].name;
        }
      });
    }

    // Complaint Form Submit Handler
    var submitForms = document.querySelectorAll('[data-complaint-submit-form]');
    submitForms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();

        var subjectInput = form.querySelector('[name="subject"]');
        var categoryInput = form.querySelector('[name="category"]');
        var priorityInput = form.querySelector('[name="priority"]');
        var descInput = form.querySelector('[name="description"]');

        var subject = subjectInput ? subjectInput.value.trim() : '';
        var category = categoryInput ? categoryInput.value : '';
        var priority = priorityInput ? priorityInput.value : 'medium';
        var description = descInput ? descInput.value.trim() : '';

        if (!subject || subject.length < 5) {
          showToast('Validation Error', 'Please enter a descriptive complaint subject (at least 5 characters).', 'danger');
          if (subjectInput) subjectInput.focus();
          return;
        }
        if (!category) {
          showToast('Validation Error', 'Please select a complaint category.', 'danger');
          if (categoryInput) categoryInput.focus();
          return;
        }
        if (!description || description.length < 10) {
          showToast('Validation Error', 'Please provide a detailed description of your complaint.', 'danger');
          if (descInput) descInput.focus();
          return;
        }

        // Generate Automatic Dummy Case ID
        var newCaseId = generateDummyCaseId();
        var routedDept = ResolveHubData.categoryRouting[category] || 'Student Affairs & Hostels';
        var today = '2026-10-03';

        // Store in local frontend array
        ResolveHubData.userComplaints.unshift({
          caseId: newCaseId,
          subject: subject,
          category: category,
          department: routedDept,
          priority: priority,
          status: 'pending',
          date: today
        });

        // Prepend to any user complaints table on the current page
        var tbody = document.querySelector('[data-user-complaints-tbody]');
        if (tbody) {
          var prioClass = priority === 'high' ? 'priority-high' : (priority === 'low' ? 'priority-low' : 'priority-medium');
          var prioLabel = priority.charAt(0).toUpperCase() + priority.slice(1);

          var tr = document.createElement('tr');
          tr.setAttribute('data-user-case-row', '');
          tr.setAttribute('data-category', category);
          tr.setAttribute('data-priority', priority);
          tr.setAttribute('data-status', 'pending');
          tr.setAttribute('data-date', today);

          tr.innerHTML =
            '<td class="cell-id">' + newCaseId + '</td>' +
            '<td class="cell-primary">' + subject + '</td>' +
            '<td>' + category + '</td>' +
            '<td>' + routedDept + '</td>' +
            '<td><span class="priority-indicator ' + prioClass + '"><span class="priority-dot"></span>' + prioLabel + '</span></td>' +
            '<td><span class="badge badge-pending"><span class="badge-dot"></span>Pending</span></td>' +
            '<td class="text-mono">' + today + '</td>' +
            '<td class="text-right"><a href="case.html" class="btn btn-secondary btn-xs">View Case</a></td>';

          tbody.prepend(tr);
        }

        // Increment KPI counters if present on dashboard
        var totalEl = document.querySelector('[data-stat-user-total]');
        var pendingEl = document.querySelector('[data-stat-user-pending]');
        if (totalEl) totalEl.textContent = String((parseInt(totalEl.textContent, 10) || 6) + 1);
        if (pendingEl) pendingEl.textContent = String((parseInt(pendingEl.textContent, 10) || 1) + 1);

        // Close quick submit modal if open
        var parentModal = form.closest('.modal-backdrop');
        if (parentModal) parentModal.classList.remove('is-open');

        form.reset();

        // Populate and open the Generated Case ID Receipt Modal
        var receiptModal = document.getElementById('modal-case-generated');
        if (receiptModal) {
          var idEl = receiptModal.querySelector('[data-generated-case-id]');
          var subjEl = receiptModal.querySelector('[data-generated-subject]');
          var catEl = receiptModal.querySelector('[data-generated-category]');

          if (idEl) idEl.textContent = newCaseId;
          if (subjEl) subjEl.textContent = subject;
          if (catEl) catEl.textContent = category + ' → ' + routedDept;

          receiptModal.classList.add('is-open');
        }

        showToast('Case ID ' + newCaseId + ' Generated', 'Your complaint has been logged and routed to ' + routedDept + '.', 'success');
      });
    });
  }

  /**
   * 23. User Complaints Search, Category, Priority & Status Filtering (user/complaints.html)
   */
  function initUserComplaintsFilter() {
    var table = document.getElementById('user-complaints-table');
    if (!table) return;

    var searchInput = document.querySelector('[data-user-filter-search]');
    var catSelect = document.querySelector('[data-user-filter-category]');
    var prioSelect = document.querySelector('[data-user-filter-priority]');
    var statusSelect = document.querySelector('[data-user-filter-status]');
    var dateInput = document.querySelector('[data-user-filter-date]');
    var resetButtons = document.querySelectorAll('[data-user-filter-reset]');
    var tabButtons = document.querySelectorAll('[data-user-case-tab]');
    var countBadge = document.querySelector('[data-user-cases-count]');
    var emptyState = document.getElementById('user-cases-empty');

    function filterUserRows() {
      var rows = table.querySelectorAll('tbody tr[data-user-case-row]');
      var q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      var cat = catSelect ? catSelect.value : 'all';
      var prio = prioSelect ? prioSelect.value : 'all';
      var st = statusSelect ? statusSelect.value : 'all';
      var dt = dateInput ? dateInput.value : '';

      var shown = 0;

      rows.forEach(function (row) {
        var rText = row.textContent.toLowerCase();
        var rCat = row.getAttribute('data-category') || '';
        var rPrio = row.getAttribute('data-priority') || '';
        var rSt = row.getAttribute('data-status') || '';
        var rDt = row.getAttribute('data-date') || '';

        var matchSearch = !q || rText.indexOf(q) !== -1;
        var matchCat = cat === 'all' || rCat === cat;
        var matchPrio = prio === 'all' || rPrio === prio;
        var matchStatus = st === 'all' || rSt === st;
        var matchDate = !dt || rDt === dt;

        var visible = matchSearch && matchCat && matchPrio && matchStatus && matchDate;
        row.style.display = visible ? '' : 'none';
        if (visible) shown++;
      });

      if (countBadge) countBadge.textContent = 'Showing ' + shown + ' of ' + rows.length + ' cases';
      if (emptyState) emptyState.style.display = shown === 0 ? 'block' : 'none';
    }

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tabVal = btn.getAttribute('data-user-case-tab') || 'all';
        tabButtons.forEach(function (b) {
          var isAct = b === btn;
          b.classList.toggle('active', isAct);
          b.setAttribute('aria-selected', isAct ? 'true' : 'false');
        });
        if (statusSelect) statusSelect.value = tabVal;
        filterUserRows();
      });
    });

    if (statusSelect) {
      statusSelect.addEventListener('change', function () {
        var val = statusSelect.value;
        tabButtons.forEach(function (b) {
          var isAct = b.getAttribute('data-user-case-tab') === val;
          b.classList.toggle('active', isAct);
          b.setAttribute('aria-selected', isAct ? 'true' : 'false');
        });
        filterUserRows();
      });
    }

    if (searchInput) searchInput.addEventListener('input', filterUserRows);
    if (catSelect) catSelect.addEventListener('change', filterUserRows);
    if (prioSelect) prioSelect.addEventListener('change', filterUserRows);
    if (dateInput) dateInput.addEventListener('change', filterUserRows);

    resetButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        if (catSelect) catSelect.value = 'all';
        if (prioSelect) prioSelect.value = 'all';
        if (statusSelect) statusSelect.value = 'all';
        if (dateInput) dateInput.value = '';
        tabButtons.forEach(function (b) {
          var isAll = b.getAttribute('data-user-case-tab') === 'all';
          b.classList.toggle('active', isAll);
        });
        filterUserRows();
      });
    });
  }

  /**
   * 24. Notification Read / Unread Interaction (user/notifications.html)
   */
  function initNotifications() {
    var list = document.getElementById('user-notification-list');
    if (!list) return;

    var filterTabs = document.querySelectorAll('[data-notif-filter-tab]');
    var markAllButtons = document.querySelectorAll('[data-mark-all-read]');
    var currentFilter = 'all';

    function updateUnreadCounts() {
      var unreadItems = list.querySelectorAll('[data-notification-item][data-read="false"]');
      var count = unreadItems.length;

      document.querySelectorAll('[data-unread-notif-badge]').forEach(function (badge) {
        badge.textContent = String(count);
      });

      var summaryEl = document.querySelector('[data-unread-summary-text]');
      if (summaryEl) {
        summaryEl.textContent = count === 0 ? 'All Caught Up (0 Unread)' : count + ' Unread Notification' + (count === 1 ? '' : 's');
      }

      // Apply active tab filter
      list.querySelectorAll('[data-notification-item]').forEach(function (item) {
        var isRead = item.getAttribute('data-read') === 'true';
        if (currentFilter === 'unread' && isRead) {
          item.style.display = 'none';
        } else {
          item.style.display = '';
        }
      });
    }

    list.addEventListener('click', function (event) {
      var toggleBtn = event.target.closest('[data-toggle-notif-read]');
      if (!toggleBtn) return;

      var card = toggleBtn.closest('[data-notification-item]');
      if (!card) return;

      var isCurrentlyRead = card.getAttribute('data-read') === 'true';
      var nextRead = !isCurrentlyRead;

      card.setAttribute('data-read', nextRead ? 'true' : 'false');
      card.classList.toggle('is-unread', !nextRead);

      toggleBtn.textContent = nextRead ? 'Mark as Unread' : 'Mark as Read';
      toggleBtn.className = nextRead ? 'btn btn-ghost btn-xs' : 'btn btn-secondary btn-xs';

      updateUnreadCounts();
      showToast(
        nextRead ? 'Marked as Read' : 'Marked as Unread',
        'Notification status updated.',
        'info'
      );
    });

    markAllButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        list.querySelectorAll('[data-notification-item]').forEach(function (card) {
          card.setAttribute('data-read', 'true');
          card.classList.remove('is-unread');
          var tBtn = card.querySelector('[data-toggle-notif-read]');
          if (tBtn) {
            tBtn.textContent = 'Mark as Unread';
            tBtn.className = 'btn btn-ghost btn-xs';
          }
        });
        updateUnreadCounts();
        showToast('All Notifications Read', 'Every notification has been marked as read.', 'success');
      });
    });

    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        currentFilter = tab.getAttribute('data-notif-filter-tab') || 'all';
        filterTabs.forEach(function (t) {
          t.classList.toggle('active', t === tab);
        });
        updateUnreadCounts();
      });
    });
  }

  /**
   * 25. Interactive 5-Star Rating Selection & User Case Detail Actions (user/case.html)
   */
  function initStarRatingAndUserCase() {
    var starGroup = document.querySelector('[data-star-rating-group]');
    var ratingInput = document.querySelector('[data-star-rating-input]');
    var ratingLabel = document.querySelector('[data-star-rating-label]');
    var ratingBadge = document.querySelector('[data-rating-badge]');
    var ratingForm = document.querySelector('[data-user-rating-form]');

    if (starGroup) {
      var starButtons = starGroup.querySelectorAll('[data-star-value]');

      starButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var val = parseInt(btn.getAttribute('data-star-value'), 10) || 5;
          if (ratingInput) ratingInput.value = String(val);

          starButtons.forEach(function (sBtn) {
            var sVal = parseInt(sBtn.getAttribute('data-star-value'), 10);
            sBtn.classList.toggle('is-active', sVal <= val);
          });

          if (ratingLabel) {
            ratingLabel.textContent = ResolveHubData.starRatingDescriptions[val] || (val + ' Stars');
          }
          if (ratingBadge) {
            ratingBadge.textContent = val + ' / 5 Stars Selected';
          }
        });
      });
    }

    function markUserCaseClosed(summaryText) {
      var statusBadgeHolder = document.querySelector('[data-user-case-status-badge]');
      if (statusBadgeHolder) {
        statusBadgeHolder.innerHTML = '<span class="badge badge-resolved"><span class="badge-dot"></span>Resolved &amp; Closed</span>';
      }

      var timeline = document.querySelector('[data-user-case-timeline]');
      if (timeline) {
        var item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML =
          '<span class="timeline-dot resolved"></span>' +
          '<div class="timeline-header">' +
            '<span class="timeline-title">Resolution Confirmed by Complainant</span>' +
            '<span class="timeline-time">Just now</span>' +
          '</div>' +
          '<p class="timeline-body">' + summaryText + '</p>';
        timeline.prepend(item);
      }
    }

    if (ratingForm) {
      ratingForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var val = ratingInput ? parseInt(ratingInput.value, 10) : 0;
        if (!val || val < 1) {
          showToast('Select a Star Rating', 'Please click 1 to 5 stars before submitting your feedback.', 'warning');
          return;
        }
        var commentEl = document.getElementById('user-feedback-comment');
        var comment = (commentEl && commentEl.value.trim()) ? commentEl.value.trim() : 'Confirmed resolved.';

        markUserCaseClosed('Rated ' + val + '/5 stars — "' + comment + '"');
        showToast('Feedback Recorded', 'Thank you! Your ' + val + '-star rating has been saved and the case is closed.', 'success');
      });
    }

    // Confirm Case Closure Modal Button
    var confirmCloseBtn = document.querySelector('[data-confirm-user-case-close]');
    if (confirmCloseBtn) {
      confirmCloseBtn.addEventListener('click', function () {
        markUserCaseClosed('User confirmed resolution via confirmation dialog.');
        var modal = document.getElementById('modal-user-confirm-close');
        if (modal) modal.classList.remove('is-open');
        showToast('Case Closed', 'Case #RH-2026-8492 marked as Resolved & Closed.', 'success');
      });
    }

    // User Conversation Reply Form
    var replyForm = document.querySelector('[data-user-reply-form]');
    var thread = document.querySelector('[data-user-message-thread]');
    if (replyForm && thread) {
      replyForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var textarea = document.getElementById('user-reply-input');
        var msg = textarea ? textarea.value.trim() : '';
        if (!msg) {
          showToast('Message Required', 'Please enter a message before sending.', 'warning');
          return;
        }

        var card = document.createElement('div');
        card.className = 'message-card';
        card.innerHTML =
          '<div class="message-header">' +
            '<div><span class="message-author">Amina Yusuf</span><span class="message-role">Complainant</span></div>' +
            '<span class="message-time">Just now</span>' +
          '</div>' +
          '<p class="message-body"></p>';
        card.querySelector('.message-body').textContent = msg;
        thread.appendChild(card);

        textarea.value = '';
        showToast('Message Sent', 'Your reply has been sent to Engr. Tunde Bakare.', 'success');
      });
    }
  }

  /**
   * 26. User Profile & Password Validation (user/profile.html)
   */
  function initUserProfileForms() {
    var profileForm = document.querySelector('[data-user-profile-form]');
    if (profileForm) {
      profileForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var name = profileForm.querySelector('[name="fullName"]').value.trim();
        var email = profileForm.querySelector('[name="email"]').value.trim();
        if (!name || !email) {
          showToast('Validation Error', 'Full Name and Institutional Email cannot be empty.', 'danger');
          return;
        }
        showToast('Profile Saved', 'Your institutional contact details have been updated.', 'success');
      });
    }

    var passwordForm = document.querySelector('[data-user-password-form]');
    if (passwordForm) {
      passwordForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var curr = passwordForm.querySelector('[name="currentPassword"]').value;
        var next = passwordForm.querySelector('[name="newPassword"]').value;
        var conf = passwordForm.querySelector('[name="confirmPassword"]').value;

        if (!curr) {
          showToast('Current Password Required', 'Please enter your current password.', 'danger');
          return;
        }
        if (!next || next.length < 8) {
          showToast('Weak Password', 'New password must be at least 8 characters long.', 'warning');
          return;
        }
        if (next !== conf) {
          showToast('Password Mismatch', 'New password and confirmation do not match.', 'danger');
          return;
        }

        passwordForm.reset();
        showToast('Password Updated', 'Your account password has been changed successfully.', 'success');
      });
    }
  }

  window.ResolveHub = {
    showToast: showToast,
    data: ResolveHubData,
    generateDummyCaseId: generateDummyCaseId
  };

  document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initSidebar();
    initDropdowns();
    initModals();
    initAlerts();
    initPasswordToggles();
    initCollapsibleSections();
    initCaseTracker();
    initCategoryFilter();
    initFaqAccordion();
    initContactForm();
    initAuthPage();
    initComplaintSubmission();
    initUserComplaintsFilter();
    initNotifications();
    initStarRatingAndUserCase();
    initUserProfileForms();
    initStaffCasesFilter();
    initStaffCaseDetails();
    initWorkspaceTabs();
    initAdminCases();
    initAdminUsers();
    initAdminManagement();
    initAdminSettings();
  });
})();


