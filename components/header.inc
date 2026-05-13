<!-- ==========================================================
     header.inc — 共用 Header
     Injected by global.js fetch → #inject-header
     ========================================================== -->
<header class="site-header" id="siteHeader">
  <div class="site-header__inner">

    <!-- Mobile hamburger -->
    <button class="site-header__menu-btn" type="button" aria-label="Open menu" id="menuOpenBtn">
      <svg viewBox="0 0 28 24" aria-hidden="true">
        <rect y="2"  width="28" height="3" rx="1.5" fill="currentColor"/>
        <rect y="10" width="28" height="3" rx="1.5" fill="currentColor"/>
        <rect y="18" width="28" height="3" rx="1.5" fill="currentColor"/>
      </svg>
    </button>

    <!-- Logo + CA LIC -->
    <a class="site-header__logo" href="index.html" aria-label="LemonTree Plumbing — Home">
      <img class="site-header__logo-img site-header__logo-img--default" src="assets/img/lemontree-plumbing-logo.svg" alt="LemonTree Plumbing">
      <img class="site-header__logo-img site-header__logo-img--scrolled" src="assets/img/lemontree-plumbing-logo-h.svg" alt="LemonTree Plumbing">
      <p class="site-header__lic">CA LIC: 1116849</p>
    </a>

    <!-- Right cluster (desktop): Nav + CTA -->
    <div class="site-header__right">

      <!-- Desktop Navigation -->
      <nav class="site-nav" aria-label="Primary">
        <ul class="site-nav__list">
          <li class="site-nav__item">
            <a class="site-nav__link is-active" href="index.html">Home</a>
          </li>
          <li class="site-nav__item">
            <a class="site-nav__link" href="about.html">About Us</a>
          </li>

          <!-- Plumbing Service ▾ -->
          <li class="site-nav__item site-nav__item--has-dropdown">
            <a class="site-nav__link" href="services/">
              Plumbing Service
              <svg class="site-nav__caret" viewBox="0 0 12 6" aria-hidden="true">
                <path d="M0 0l6 6 6-6z" fill="currentColor"/>
              </svg>
            </a>
            <div class="site-dropdown">
              <ul class="site-dropdown__list site-dropdown__list--two-col">
                <li><a class="site-dropdown__link" href="services/drain-sewer.html">Drain &amp; Sewer<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
                <li><a class="site-dropdown__link" href="services/water-fixture-repair.html">Water Fixture Repair<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
                <li><a class="site-dropdown__link" href="services/gas-line.html">Gas Line Services<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
                <li><a class="site-dropdown__link" href="services/water-repipe.html">Water Repipe<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
                <li><a class="site-dropdown__link" href="services/hydronic-radiant-heating.html">Hydronic Radiant Heating<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
                <li><a class="site-dropdown__link" href="services/water-heater.html">Water Heater Services<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
              </ul>
            </div>
          </li>

          <!-- Service Areas ▾ -->
          <li class="site-nav__item site-nav__item--has-dropdown">
            <a class="site-nav__link" href="areas/">
              Service Areas
              <svg class="site-nav__caret" viewBox="0 0 12 6" aria-hidden="true">
                <path d="M0 0l6 6 6-6z" fill="currentColor"/>
              </svg>
            </a>
            <div class="site-dropdown">
              <ul class="site-dropdown__list site-dropdown__list--two-col">
                <li><a class="site-dropdown__link" href="areas/berkeley.html">Berkeley<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
                <li><a class="site-dropdown__link" href="areas/albany.html">Albany<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
                <li><a class="site-dropdown__link" href="areas/el-cerrito.html">El Cerrito<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
                <li><a class="site-dropdown__link" href="areas/kensington.html">Kensington<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
                <li><a class="site-dropdown__link" href="areas/north-oakland.html">North Oakland<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
                <li><a class="site-dropdown__link" href="areas/alameda.html">Alameda<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
                <li><a class="site-dropdown__link" href="areas/emeryville.html">Emeryville<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
                <li><a class="site-dropdown__link" href="areas/el-sobrante.html">El Sobrante<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
                <li><a class="site-dropdown__link" href="areas/pinole.html">Pinole<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
                <li><a class="site-dropdown__link" href="areas/orinda.html">Orinda<span class="site-dropdown__arrow" aria-hidden="true">→</span></a></li>
              </ul>
            </div>
          </li>

          <li class="site-nav__item"><a class="site-nav__link" href="gallery.html">Gallery</a></li>
          <li class="site-nav__item"><a class="site-nav__link" href="contact.html">Contact Us</a></li>
        </ul>
      </nav>

      <!-- CTA cluster -->
      <div class="site-header__cta">
        <a class="btn-call" href="tel:+15105027843" aria-label="Call (510) 502-7843">
          <span class="btn-call__icon">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M3.6 1.3a1.7 1.7 0 0 1 2-.9l3 .7a1.7 1.7 0 0 1 1.3 1.9l-.5 2.4a1.7 1.7 0 0 1-1 1.2l-1.7.7a12 12 0 0 0 5.9 5.9l.7-1.7a1.7 1.7 0 0 1 1.2-1l2.4-.5a1.7 1.7 0 0 1 1.9 1.3l.7 3a1.7 1.7 0 0 1-.9 2l-1.4.6a3.3 3.3 0 0 1-1.6.2A17.4 17.4 0 0 1 .9 5.1a3.3 3.3 0 0 1 .2-1.6l.6-1.4z"/>
            </svg>
          </span>
          <span class="btn-call__label">Call</span>
        </a>
        <a class="site-header__phone" href="tel:+15105027843">(510) 502-7843</a>
      </div>

    </div><!-- /.site-header__right -->
  </div>
</header>

<!-- ============================================================
     Mobile menu overlay (accordion-style)
     ============================================================ -->
<div class="mobile-menu" id="mobileMenu" aria-hidden="true">
  <button class="mobile-menu__close" type="button" aria-label="Close menu" id="menuCloseBtn">&times;</button>

  <a class="mobile-menu__link" href="index.html">Home</a>
  <a class="mobile-menu__link" href="about.html">About Us</a>

  <!-- Plumbing Service (accordion) -->
  <div class="mobile-menu__group">
    <button class="mobile-menu__toggle" type="button" aria-expanded="false">
      Plumbing Service
      <svg class="mobile-menu__caret" viewBox="0 0 12 6" aria-hidden="true">
        <path d="M0 0l6 6 6-6z" fill="currentColor"/>
      </svg>
    </button>
    <ul class="mobile-menu__sublist">
      <li><a class="mobile-menu__sublink" href="services/drain-sewer.html">Drain &amp; Sewer</a></li>
      <li><a class="mobile-menu__sublink" href="services/water-fixture-repair.html">Water Fixture Repair</a></li>
      <li><a class="mobile-menu__sublink" href="services/gas-line.html">Gas Line Services</a></li>
      <li><a class="mobile-menu__sublink" href="services/water-repipe.html">Water Repipe</a></li>
      <li><a class="mobile-menu__sublink" href="services/hydronic-radiant-heating.html">Hydronic Radiant Heating</a></li>
      <li><a class="mobile-menu__sublink" href="services/water-heater.html">Water Heater Services</a></li>
    </ul>
  </div>

  <!-- Service Areas (accordion) -->
  <div class="mobile-menu__group">
    <button class="mobile-menu__toggle" type="button" aria-expanded="false">
      Service Areas
      <svg class="mobile-menu__caret" viewBox="0 0 12 6" aria-hidden="true">
        <path d="M0 0l6 6 6-6z" fill="currentColor"/>
      </svg>
    </button>
    <ul class="mobile-menu__sublist">
      <li><a class="mobile-menu__sublink" href="areas/berkeley.html">Berkeley</a></li>
      <li><a class="mobile-menu__sublink" href="areas/albany.html">Albany</a></li>
      <li><a class="mobile-menu__sublink" href="areas/el-cerrito.html">El Cerrito</a></li>
      <li><a class="mobile-menu__sublink" href="areas/kensington.html">Kensington</a></li>
      <li><a class="mobile-menu__sublink" href="areas/north-oakland.html">North Oakland</a></li>
      <li><a class="mobile-menu__sublink" href="areas/alameda.html">Alameda</a></li>
      <li><a class="mobile-menu__sublink" href="areas/emeryville.html">Emeryville</a></li>
      <li><a class="mobile-menu__sublink" href="areas/el-sobrante.html">El Sobrante</a></li>
      <li><a class="mobile-menu__sublink" href="areas/pinole.html">Pinole</a></li>
      <li><a class="mobile-menu__sublink" href="areas/orinda.html">Orinda</a></li>
    </ul>
  </div>

  <a class="mobile-menu__link" href="gallery.html">Gallery</a>
  <a class="mobile-menu__link" href="contact.html">Contact Us</a>
</div>
