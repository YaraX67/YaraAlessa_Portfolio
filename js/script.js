  function openModal(id){
    document.getElementById(id).classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeModal(id){
    document.getElementById(id).classList.remove('open');
    document.body.style.overflow='';
  }
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape'){
      document.querySelectorAll('.modal-overlay.open').forEach(function(m){ m.classList.remove('open'); });
      document.body.style.overflow='';
    }
  });

  // Filter bar
  var filterBtns = document.querySelectorAll('.filter-pill');
  var cards = document.querySelectorAll('.p-card');
  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterBtns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      cards.forEach(function(card){
        var show = filter === 'all' || card.getAttribute('data-status') === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  // Scroll reveal
  var revealTargets = document.querySelectorAll('.p-card, .stat-note, .collab-col, .think-card');
  if('IntersectionObserver' in window){
    revealTargets.forEach(function(el){ el.classList.add('reveal'); });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
    revealTargets.forEach(function(el){ io.observe(el); });
  }

  // Scroll progress bar
  var progressBar = document.getElementById('scrollProgress');
  function updateProgress(){
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (scrolled / max) * 100 : 0;
    if(progressBar){ progressBar.style.width = pct + '%'; }
  }
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  // Nav bar tint once the page has scrolled
  var navEl = document.querySelector('nav');
  function updateNavTint(){
    if(navEl){ navEl.classList.toggle('scrolled', window.scrollY > 10); }
  }
  window.addEventListener('scroll', updateNavTint, {passive:true});
  updateNavTint();

  // Active nav link: highlights the section currently in view, and
  // updates instantly on click instead of waiting for scroll to catch up
  var navLinks = document.querySelectorAll('.navlinks a');
  var navSections = [];
  navLinks.forEach(function(link){
    var id = link.getAttribute('href');
    if(id && id.charAt(0) === '#'){
      var section = document.querySelector(id);
      if(section){ navSections.push({ link: link, section: section }); }
    }
  });
  function setActiveLink(link){
    navLinks.forEach(function(l){ l.classList.remove('active'); });
    if(link){ link.classList.add('active'); }
  }
  navLinks.forEach(function(link){
    link.addEventListener('click', function(){ setActiveLink(link); });
  });
  if(navSections.length && 'IntersectionObserver' in window){
    var navHeight = navEl ? navEl.offsetHeight : 0;
    var sectionObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var match = navSections.filter(function(item){ return item.section === entry.target; })[0];
          if(match){ setActiveLink(match.link); }
        }
      });
    }, { rootMargin: '-' + (navHeight + 10) + 'px 0px -60% 0px', threshold: 0 });
    navSections.forEach(function(item){ sectionObserver.observe(item.section); });

    // The last section (footer) can be too short to ever cross the
    // rootMargin band above, so force it active once actually at the
    // bottom of the page rather than leaving the previous link lit.
    var lastLink = navSections[navSections.length - 1].link;
    function checkBottomOfPage(){
      var doc = document.documentElement;
      var atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 2;
      if(atBottom){
        setActiveLink(lastLink);
        requestAnimationFrame(function(){ setActiveLink(lastLink); });
      }
    }
    window.addEventListener('scroll', checkBottomOfPage, {passive:true});
    checkBottomOfPage();
  }

  // Rotating tagline (typewriter)
  var taglineEl = document.getElementById('taglineText');
  var taglinePhrases = [
    'Turning complex insurance problems into simple digital products.',
    'Turning ambiguity into decisions, and decisions into products.',
    'Bridging business needs and technical delivery.'
  ];
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(taglineEl && !reduceMotion){
    var phraseIdx = 0, charIdx = 0, deleting = false;
    function typeTick(){
      var current = taglinePhrases[phraseIdx];
      if(!deleting){
        charIdx++;
        taglineEl.textContent = current.slice(0, charIdx);
        if(charIdx === current.length){
          deleting = true;
          setTimeout(typeTick, 1800);
          return;
        }
        setTimeout(typeTick, 38);
      } else {
        charIdx--;
        taglineEl.textContent = current.slice(0, charIdx);
        if(charIdx === 0){
          deleting = false;
          phraseIdx = (phraseIdx + 1) % taglinePhrases.length;
          setTimeout(typeTick, 300);
          return;
        }
        setTimeout(typeTick, 18);
      }
    }
    typeTick();
  } else if(taglineEl){
    taglineEl.textContent = taglinePhrases[0];
  }

  // Card tilt on hover
  if(!reduceMotion && window.matchMedia && window.matchMedia('(hover: hover)').matches){
    document.querySelectorAll('.p-card').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var rect = card.getBoundingClientRect();
        var cx = rect.width / 2, cy = rect.height / 2;
        var rotateY = ((e.clientX - rect.left - cx) / cx) * 5;
        var rotateX = -((e.clientY - rect.top - cy) / cy) * 5;
        card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });
  }
