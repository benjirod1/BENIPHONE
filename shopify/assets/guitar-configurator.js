/*
 * Guitar Configurator for Shopify
 * Reads its options from the JSON rendered by sections/guitar-configurator.liquid,
 * shows a live preview, and adds the build (plus any upcharge items) to the cart.
 */
(function () {
  'use strict';

  // Drawing order for preview layers (first = bottom).
  var SLOT_ORDER = ['body', 'pickguard', 'fretboard', 'headstock', 'pickups', 'hardware'];

  function slug(s) {
    return String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') node.textContent = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  // Placeholder guitar drawing. Every recolourable part has data-slot="...".
  // Replace with real photo layers by adding images to choices in the theme editor.
  function guitarSVG() {
    var frets = [192, 222, 250, 276, 300, 322, 343, 362, 380, 396, 411, 425, 438, 450];
    var fretLines = frets.map(function (y) {
      return '<line x1="135" x2="165" y1="' + y + '" y2="' + y + '" stroke="#cfcfcf" stroke-width="1.5"/>';
    }).join('');
    var inlays = [236, 288, 332, 371, 418].map(function (y) {
      return '<circle cx="150" cy="' + y + '" r="3" fill="#f3efe6" opacity=".85"/>';
    }).join('') + '<circle cx="144" cy="444" r="3" fill="#f3efe6" opacity=".85"/><circle cx="156" cy="444" r="3" fill="#f3efe6" opacity=".85"/>';
    var strings = [0, 1, 2, 3, 4, 5].map(function (i) {
      var x1 = 139 + i * 4.4, x2 = 129 + i * 8.4;
      return '<line x1="' + x1 + '" y1="160" x2="' + x2 + '" y2="688" stroke="#eceae6" stroke-width="' + (1.4 - i * 0.12) + '" opacity=".9"/>';
    }).join('');
    var body = 'M150,440 C120,440 105,420 95,400 C80,375 60,380 58,410 C55,450 75,480 70,520 C62,560 40,600 45,660 C50,740 100,785 150,785 C200,785 252,745 255,670 C258,610 238,570 232,530 C226,490 245,460 240,430 C236,400 215,395 205,415 C195,435 180,440 150,440 Z';

    return '' +
      '<svg class="gc-svg" viewBox="0 0 300 800" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Guitar preview">' +
      '<defs>' +
      '<radialGradient id="gc-sheen" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></radialGradient>' +
      '<linearGradient id="gc-neck-sheen" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".25"/><stop offset=".5" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>' +
      '</defs>' +
      // Body
      '<path data-slot="body" d="' + body + '" fill="#9e1b22"/>' +
      '<path d="' + body + '" fill="url(#gc-sheen)"/>' +
      '<path d="' + body + '" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2.5"/>' +
      // Pickguard
      '<path data-slot="pickguard" d="M112,470 C96,500 88,560 94,620 C100,690 140,735 170,722 L176,600 C188,570 196,520 186,470 Z" fill="#1a1a1a" stroke="#000" stroke-opacity=".25"/>' +
      // Headstock + tuners
      '<path data-slot="headstock" d="M128,162 L122,62 C121,40 140,26 160,28 C180,30 183,50 178,72 L172,162 Z" fill="#c9a46b" stroke="#000" stroke-opacity=".25"/>' +
      '<g data-slot="hardware" fill="#c7cbd0">' +
      '<circle cx="114" cy="62" r="7"/><circle cx="114" cy="96" r="7"/><circle cx="114" cy="130" r="7"/>' +
      '<circle cx="186" cy="62" r="7"/><circle cx="186" cy="96" r="7"/><circle cx="186" cy="130" r="7"/>' +
      '</g>' +
      // Neck / fretboard
      '<rect data-slot="fretboard" x="135" y="160" width="30" height="305" rx="3" fill="#4a2a1a"/>' +
      '<rect x="135" y="160" width="30" height="305" rx="3" fill="url(#gc-neck-sheen)"/>' +
      fretLines + inlays +
      '<rect x="133" y="157" width="34" height="5" rx="1" fill="#efe9dc"/>' +
      // Pickups
      '<rect data-slot="pickups" x="120" y="500" width="60" height="26" rx="4" fill="#161616"/>' +
      '<rect data-slot="pickups" x="120" y="590" width="60" height="26" rx="4" fill="#161616"/>' +
      '<g fill="#000" fill-opacity=".3">' +
      [0, 1, 2, 3, 4, 5].map(function (i) {
        var x = 130 + i * 8;
        return '<circle cx="' + x + '" cy="507" r="2"/><circle cx="' + x + '" cy="519" r="2"/><circle cx="' + x + '" cy="597" r="2"/><circle cx="' + x + '" cy="609" r="2"/>';
      }).join('') +
      '</g>' +
      // Bridge, tailpiece, knobs, switch
      '<g data-slot="hardware" fill="#c7cbd0">' +
      '<rect x="118" y="680" width="64" height="16" rx="3"/>' +
      '<rect x="122" y="712" width="56" height="10" rx="5"/>' +
      '<circle cx="212" cy="650" r="10"/><circle cx="226" cy="690" r="10"/><circle cx="206" cy="726" r="10"/>' +
      '<circle cx="212" cy="560" r="6"/>' +
      '</g>' +
      strings +
      '</svg>';
  }

  function Configurator(root) {
    this.root = root;
    this.cfg = JSON.parse(root.querySelector('[data-configurator-config]').textContent);
    this.groups = this.groupChoices(this.cfg.choices || []);
    this.selection = {};
    this.fmt = new Intl.NumberFormat(this.cfg.locale || undefined, {
      style: 'currency',
      currency: this.cfg.currency || 'USD'
    });
    this.build();
    this.applyInitialSelection();
    this.render();
  }

  Configurator.prototype.money = function (cents) {
    return this.fmt.format((cents || 0) / 100);
  };

  Configurator.prototype.groupChoices = function (choices) {
    var groups = [];
    var byKey = {};
    choices.forEach(function (c) {
      var gkey = slug(c.group) || 'options';
      if (!byKey[gkey]) {
        byKey[gkey] = { key: gkey, name: c.group || 'Options', choices: [] };
        groups.push(byKey[gkey]);
      }
      c.key = slug(c.label);
      c.groupKey = gkey;
      byKey[gkey].choices.push(c);
    });
    return groups;
  };

  Configurator.prototype.build = function () {
    var self = this;
    var root = this.root;
    var uid = this.cfg.sectionId || Math.random().toString(36).slice(2);

    // Preview
    this.stage = root.querySelector('[data-gc-stage]');
    if (!this.cfg.baseImage) {
      this.stage.insertAdjacentHTML('afterbegin', guitarSVG());
    }
    this.layers = root.querySelector('[data-gc-layers]');

    // Option groups
    var optionsEl = root.querySelector('[data-gc-options]');
    this.groups.forEach(function (g) {
      var current = el('span', { class: 'gc-group-current' });
      var list = el('div', { class: 'gc-choices' });
      g.choices.forEach(function (c) {
        var input = el('input', {
          type: 'radio',
          class: 'gc-visually-hidden',
          name: 'gc-' + uid + '-' + g.key,
          value: c.key
        });
        input.addEventListener('change', function () {
          self.selection[g.key] = c;
          self.render();
        });
        var swatch = el('span', { class: 'gc-swatch', 'aria-hidden': 'true' });
        if (c.thumb) swatch.style.backgroundImage = 'url("' + c.thumb + '")';
        else if (c.swatch) swatch.style.backgroundColor = c.swatch;
        else swatch.classList.add('gc-swatch--empty');
        var price = c.upchargePrice > 0 ? el('span', { class: 'gc-choice-price', text: '+' + self.money(c.upchargePrice) }) : null;
        list.appendChild(el('label', { class: 'gc-choice' }, [
          input, swatch, el('span', { class: 'gc-choice-label', text: c.label }), price
        ]));
      });
      g.currentEl = current;
      g.listEl = list;
      optionsEl.appendChild(el('fieldset', { class: 'gc-group' }, [
        el('legend', { class: 'gc-group-name' }, [document.createTextNode(g.name + ': '), current]),
        list
      ]));
    });

    this.summaryEl = root.querySelector('[data-gc-summary]');
    this.totalEl = root.querySelector('[data-gc-total]');
    this.messageEl = root.querySelector('[data-gc-message]');
    this.addBtn = root.querySelector('[data-gc-add]');
    this.shareBtn = root.querySelector('[data-gc-share]');

    if (!this.cfg.product || !this.cfg.product.variantId) {
      this.addBtn.disabled = true;
      this.showMessage('Choose a base product for this section in the theme editor.', true);
    }

    this.addBtn.addEventListener('click', function () { self.addToCart(); });
    if (this.shareBtn) this.shareBtn.addEventListener('click', function () { self.share(); });
  };

  Configurator.prototype.applyInitialSelection = function () {
    var params = new URLSearchParams(window.location.search);
    var self = this;
    this.groups.forEach(function (g) {
      var fromUrl = params.get(g.key);
      var pick = g.choices.filter(function (c) { return c.key === fromUrl; })[0] ||
        g.choices.filter(function (c) { return c.isDefault; })[0] ||
        g.choices[0];
      self.selection[g.key] = pick;
    });
  };

  Configurator.prototype.selected = function () {
    var self = this;
    return this.groups.map(function (g) { return { group: g, choice: self.selection[g.key] }; });
  };

  Configurator.prototype.total = function () {
    return this.selected().reduce(function (sum, s) {
      return sum + (s.choice.upchargePrice || 0);
    }, (this.cfg.product && this.cfg.product.price) || 0);
  };

  Configurator.prototype.render = function () {
    var self = this;
    var sel = this.selected();

    // Option UI
    sel.forEach(function (s) {
      s.group.currentEl.textContent = s.choice.label;
      var input = s.group.listEl.querySelector('input[value="' + s.choice.key + '"]');
      if (input) input.checked = true;
    });

    // Preview: recolour SVG parts, or stack photo layers
    var svg = this.stage.querySelector('.gc-svg');
    var imageLayers = [];
    sel.forEach(function (s) {
      var c = s.choice;
      if (svg && c.slot) {
        svg.querySelectorAll('[data-slot="' + c.slot + '"]').forEach(function (part) {
          if (c.swatch) part.setAttribute('fill', c.swatch);
          part.style.visibility = c.image ? 'hidden' : '';
        });
      }
      if (c.image) imageLayers.push(c);
    });
    imageLayers.sort(function (a, b) {
      return SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot);
    });
    this.layers.innerHTML = '';
    imageLayers.forEach(function (c) {
      self.layers.appendChild(el('img', { src: c.image, alt: '', loading: 'lazy' }));
    });

    // Summary + total
    this.summaryEl.innerHTML = '';
    var base = this.cfg.product || {};
    this.summaryEl.appendChild(el('li', {}, [
      el('span', { text: base.title || 'Base model' }),
      el('span', { text: this.money(base.price) })
    ]));
    sel.forEach(function (s) {
      self.summaryEl.appendChild(el('li', {}, [
        el('span', { text: s.group.name + ': ' + s.choice.label }),
        el('span', { text: s.choice.upchargePrice > 0 ? '+' + self.money(s.choice.upchargePrice) : '—' })
      ]));
    });
    this.totalEl.textContent = this.money(this.total());

    // Keep the URL shareable
    if (window.history && window.history.replaceState) {
      var params = new URLSearchParams(window.location.search);
      sel.forEach(function (s) { params.set(s.group.key, s.choice.key); });
      window.history.replaceState(null, '', window.location.pathname + '?' + params.toString() + window.location.hash);
    }
  };

  Configurator.prototype.showMessage = function (text, isError) {
    this.messageEl.textContent = text;
    this.messageEl.classList.toggle('gc-message--error', !!isError);
  };

  Configurator.prototype.addToCart = function () {
    var self = this;
    var buildId = Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
    var sel = this.selected();

    var properties = { 'Build ID': buildId };
    sel.forEach(function (s) { properties[s.group.name] = s.choice.label; });

    var items = [{ id: this.cfg.product.variantId, quantity: 1, properties: properties }];
    sel.forEach(function (s) {
      if (s.choice.upchargeVariantId) {
        items.push({
          id: s.choice.upchargeVariantId,
          quantity: 1,
          properties: { 'Build ID': buildId, 'Option': s.group.name + ': ' + s.choice.label }
        });
      }
    });

    if (this.root.hasAttribute('data-demo')) {
      console.log('Demo mode — would POST to /cart/add.js:', JSON.stringify({ items: items }, null, 2));
      this.showMessage('Demo: build ' + buildId + ' would be added to the cart (' + items.length + ' line items, ' + this.money(this.total()) + ').');
      return;
    }

    var routeRoot = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
    this.addBtn.disabled = true;
    this.showMessage('Adding your build…');

    fetch(routeRoot + 'cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ items: items })
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.description || data.message || 'Could not add to cart');
          return data;
        });
      })
      .then(function () {
        window.location.href = routeRoot + 'cart';
      })
      .catch(function (err) {
        self.addBtn.disabled = false;
        self.showMessage(err.message, true);
      });
  };

  Configurator.prototype.share = function () {
    var self = this;
    var url = window.location.href;
    var done = function () { self.showMessage('Link to this build copied.'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link:', url); });
    } else {
      window.prompt('Copy this link:', url);
    }
  };

  function init(scope) {
    (scope || document).querySelectorAll('[data-guitar-configurator]').forEach(function (root) {
      if (root.__gc) return;
      root.__gc = new Configurator(root);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();

  // Re-initialise when the section is edited in the Shopify theme editor
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
