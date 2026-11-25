(function () {
  // 1. Two-state comfort theme toggle (checks divergence only at storage time)
  var themeBtn = document.getElementById('theme-toggle');
  var metaScheme = document.querySelector('meta[name="color-scheme"]');

  function syncToggleLabel() {
    if (!themeBtn || !metaScheme) return;
    var sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var content = metaScheme.getAttribute('content') || 'light dark';
    var isDark = content === 'dark' || (content === 'light dark' && sysDark);
    themeBtn.textContent = isDark ? 'Light Theme' : 'Dark Theme';
    themeBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  if (themeBtn && metaScheme) {
    themeBtn.addEventListener('click', function () {
      var sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      var stored = null;
      try {
        stored = window.localStorage.getItem('sb-site-scheme');
      } catch (e) {}
      var currentlyDark = stored ? stored === 'dark' : sysDark;
      var target = currentlyDark ? 'light' : 'dark';
      var matchesSys = (target === 'dark') === sysDark;
      try {
        if (matchesSys) {
          window.localStorage.removeItem('sb-site-scheme');
        } else {
          window.localStorage.setItem('sb-site-scheme', target);
        }
      } catch (e) {}
      metaScheme.setAttribute('content', matchesSys ? 'light dark' : target);
      syncToggleLabel();
    });

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncToggleLabel);
    }
    window.addEventListener('storage', function (ev) {
      if (ev.key === 'sb-site-scheme' && metaScheme) {
        metaScheme.setAttribute('content', ev.newValue || 'light dark');
        syncToggleLabel();
      }
    });
    syncToggleLabel();
  }

  // 1b. Click-to-play facade for 90s Walkthrough video (zero duplicate thumbnail text + instant LCP)
  var posterBtn = document.getElementById('play-walkthrough-btn');
  var videoFrame = document.getElementById('hero-video-frame');
  if (posterBtn && videoFrame) {
    posterBtn.addEventListener('click', function () {
      videoFrame.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/oSoXlrKdjEU?autoplay=1&rel=0" ' +
        'title="Spec Bridge for Jira Cloud 90-second founder walkthrough" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
        'allowfullscreen></iframe>';
    });
  }

  // 2. Interactive Zero-Login Spec Bridge Sandbox
  var SCENARIOS = {
    prd: {
      issueKey: 'DEM-25',
      issueType: 'Portfolio Epic',
      hierarchy: 'DEM-25 (Portfolio Epic) -> Capability -> Feature -> User Story',
      sourceLabel: 'Confluence PRD: Workspace Usage Quotas, Threshold Alerts & Self-Serve Plan Upgrades',
      rawScore: 44,
      targetScore: 96,
      parkingLot: [
        'Predictive ML usage-forecasting chart (deferred from PRD Phase 2 wishlist)',
        'Custom Slack /quota slash-command bot & PagerDuty routing'
      ],
      cards: [
        {
          id: 'c1',
          category: 'STATE_TRANSITIONS',
          title: 'Overage Enforcement Window at 100% Quota',
          pmPrompt: 'PM question: When a customer crosses 100% of monthly events, do we block traffic immediately or give Billing Owners a grace window to upgrade?',
          engPrompt: 'Engineering rule: Define state machine transition (ACTIVE -> GRACE_24H -> THROTTLED_429) and audit emission.',
          selected: 0,
          options: [
            {
              label: '(Recommended) 24-hour grace window before HTTP 429 throttling',
              pmImpact: 'Protects production customer workloads while driving urgent self-serve upgrades.',
              invariant: 'Transition to GRACE_24H at 100%, emit audit event, enforce HTTP 429 only after +24h.'
            },
            {
              label: 'Hard-block requests immediately with HTTP 429 at 100%',
              pmImpact: 'Zero unpaid overage cost, higher risk of breaking live customer integrations.',
              invariant: 'Reject ingest immediately when counter >= plan_quota.'
            }
          ]
        },
        {
          id: 'c2',
          category: 'FAILURE_RECOVERY',
          title: 'Stripe Upgrade Double-Click & Webhook Replay',
          pmPrompt: 'PM question: If a Billing Owner clicks Upgrade twice on slow Wi-Fi, how do we prevent double charges and lift limits immediately?',
          engPrompt: 'Engineering rule: Enforce client Idempotency-Key + atomic quota state lift on checkout.session.completed.',
          selected: null,
          options: [
            {
              label: '(Recommended) 24h Idempotency-Key replay + immediate quota lift on webhook',
              pmImpact: 'Zero duplicate charges and quota lifts within seconds of payment.',
              invariant: 'Persist checkout idempotency hash for 24h; deduplicate Stripe webhook event_id.'
            },
            {
              label: 'Lock upgrade button for 10 minutes with HTTP 409 on retry',
              pmImpact: 'Customer must wait if they close the checkout tab mid-flow.',
              invariant: 'Acquire 600s pessimistic row lock on workspace_billing.'
            }
          ]
        }
      ],
      stories: [
        {
          key: 'DEM-26',
          type: 'Capability',
          title: 'Usage Metering Materialized View & 60s Dashboard Bar',
          hash: '8f31c9a04e12',
          ears: 'WHEN the materialized view refresh job runs every 30s, THE SYSTEM SHALL update workspace API counters monotonically without double-counting.',
          gherkin: 'GIVEN workspace has 72,000 / 100,000 events WHEN Billing Owner opens Settings THEN usage bar renders within 60s of ingestion.',
          guardrails: '[DEM-25] 24h grace window before HTTP 429 | [SOC2] Cross-tenant lookups return 404, never 403'
        },
        {
          key: 'DEM-27',
          type: 'Capability',
          title: 'Deduplicated 80% & 100% Threshold Alert Engine',
          hash: '4d92e0b71c88',
          ears: 'WHEN workspace usage crosses 80% or 100% for a billing cycle, THE SYSTEM SHALL dispatch exactly one alert per threshold per cycle.',
          gherkin: 'GIVEN 80% alert already sent for cycle 2026-11 WHEN usage ticks from 80.1% to 80.2% THEN zero duplicate emails are sent.',
          guardrails: '[DEM-25] Deduplicate per (workspace_id, cycle_id, threshold) | [SOC2] Immutable audit log entry'
        }
      ],
      diff: {
        key: 'DEM-26',
        removed: [
          'Intent: Lift plan quota to unlimited on Growth tier upgrade',
          'REQ-02: Allow custom enterprise invoice net-60 checkout in MVP'
        ],
        added: [
          'Intent: Upgrade Starter (100k/mo) to Growth (1M/mo) via Stripe Checkout with 24h idempotency',
          'REQ-02: Enforce 24h GRACE_PERIOD state before returning HTTP 429 Too Many Requests',
          'Non-Goal: Custom Slack /quota slash-command quarantined to Phase 2 Parking Lot'
        ]
      }
    },
    epic: {
      issueKey: 'DEM1-22',
      issueType: 'Epic',
      hierarchy: 'DEM1-22 (2-Sentence Jira Epic) -> Vertically Sliced User Stories',
      sourceLabel: '2-Sentence Epic Description: "Customers on our Pro plan need a settings page where Workspace Admins can view security events and export to CSV. Regular members cannot access admin audit logs."',
      rawScore: 31,
      targetScore: 95,
      parkingLot: [
        'Real-time SIEM webhook streaming (Datadog / Splunk)',
        'Custom retention TTL per enterprise workspace'
      ],
      cards: [
        {
          id: 'e1',
          category: 'AUTH_AND_TENANCY',
          title: 'Admin Role Scope & Cross-Tenant Isolation',
          pmPrompt: 'PM question: Should all Workspace Admins see every team event in the workspace, and what happens if a regular Member hits the URL?',
          engPrompt: 'Engineering rule: Enforce WORKSPACE_ADMIN RBAC check and tenant_id query scoping.',
          selected: 0,
          options: [
            {
              label: '(Recommended) Flat Workspace Admin visibility; HTTP 403 for Members, 404 cross-tenant',
              pmImpact: 'Clean compliance audit trail for Pro workspaces without extra role setup.',
              invariant: 'Require WORKSPACE_ADMIN role; scope SQL WHERE tenant_id = ctx.tenantId.'
            },
            {
              label: 'Per-team scoped audit visibility only',
              pmImpact: 'Adds team-membership filtering complexity before MVP launch.',
              invariant: 'Join team_memberships on every audit query.'
            }
          ]
        },
        {
          id: 'e2',
          category: 'UNBOUNDED_SCOPE',
          title: 'CSV Export Row Limit & Delivery Mode',
          pmPrompt: 'PM question: Can synchronous CSV downloads cap at 10,000 rows for MVP so exports stay instant without background email jobs?',
          engPrompt: 'Engineering rule: Stream chunked CSV capped at 10,000 rows with cursor pagination.',
          selected: null,
          options: [
            {
              label: '(Recommended) Streamed synchronous CSV up to 10,000 rows + date-range filter',
              pmImpact: 'Instant download in browser; ships in 1 sprint instead of 3.',
              invariant: 'Stream response with LIMIT 10000 and mandatory 90-day max window.'
            },
            {
              label: 'Async S3 background export + signed email link for 1M+ rows',
              pmImpact: 'Handles massive enterprise dumps but adds worker + S3 lifecycle scope.',
              invariant: 'Queue async export job and issue 15-min pre-signed URL.'
            }
          ]
        }
      ],
      stories: [
        {
          key: 'DEM1-23',
          type: 'Story',
          title: 'Immutable Audit Events Schema, Write Hook & Composite Index',
          hash: '61fa92c03b14',
          ears: 'WHEN login, role_change, or api_key_update commits, THE SYSTEM SHALL append an immutable audit_events row within the same transaction.',
          gherkin: 'GIVEN a member role update commits WHEN querying audit_events THEN actor_id, tenant_id, and before/after metadata are recorded.',
          guardrails: 'Custom Jira "Acceptance Criteria" field populated automatically | Human notes preserved above divider'
        },
        {
          key: 'DEM1-24',
          type: 'Story',
          title: 'Tenant-Scoped Audit Viewer & 10,000-Row Streamed CSV Export',
          hash: '99c41be820d1',
          ears: 'IF a non-admin Member calls GET /api/audit-logs/export, THE SYSTEM SHALL reject the request with HTTP 403 before querying storage.',
          gherkin: 'GIVEN an authenticated WORKSPACE_ADMIN WHEN exporting last 30 days THEN a UTF-8 CSV streams up to 10,000 rows.',
          guardrails: 'Explicit Non-Goal: Do NOT build real-time WebSocket streaming or SIEM webhooks'
        }
      ],
      diff: {
        key: 'DEM1-24',
        removed: [
          'REQ-01: Retain Pro workspace audit events for 30 days',
          'Export cap: Up to 5,000 CSV rows per download'
        ],
        added: [
          'REQ-01: Retain Pro workspace audit events for 90 days (SOC 2 compliance update)',
          'Export cap: Streamed CSV up to 10,000 rows with formula-injection escaping'
        ]
      }
    }
  };

  var state = {
    scenarioKey: 'prd',
    lens: 'unified',
    drawerMode: false,
    compiled: false,
    drifted: false,
    showDiff: false,
    activeProjection: null
  };

  var root = document.getElementById('sandbox-app');
  var outer = document.getElementById('sandbox-outer');
  if (!root) return;

  function currentScenario() {
    return SCENARIOS[state.scenarioKey];
  }

  function formatProjection(story, fmt) {
    if (fmt === 'json') {
      return JSON.stringify(
        {
          schemaVersion: '1.0',
          issueKey: story.key,
          status: state.drifted ? 'DRIFTED' : 'LOCKED',
          specHash: story.hash,
          ears: [story.ears],
          gherkin: [story.gherkin],
          guardrails: story.guardrails
        },
        null,
        2
      );
    }
    if (fmt === 'speckit') {
      return (
        '# GitHub Spec Kit: ' + story.key + ' - ' + story.title + '\n' +
        'Spec-Hash: ' + story.hash + ' | Runs-on-Atlassian: true\n\n' +
        '## Inherited Guardrails\n- ' + story.guardrails + '\n\n' +
        '## Testable Requirement (EARS)\n- ' + story.ears + '\n\n' +
        '## Acceptance Scenario (Gherkin)\n' + story.gherkin
      );
    }
    return (
      '# [OPEN-SPEC / MCP] ' + story.key + ' - ' + story.title + '\n' +
      'Pull live in Cursor / Claude Code / Rovo: get_locked_spec(issueKey: "' + story.key + '")\n\n' +
      '- EARS: ' + story.ears + '\n' +
      '- AC: ' + story.gherkin + '\n' +
      '- Guardrails: ' + story.guardrails
    );
  }

  function render() {
    var sc = currentScenario();
    var resolvedCount = sc.cards.filter(function (c) {
      return c.selected !== null;
    }).length;
    var allResolved = resolvedCount === sc.cards.length;
    var score = state.compiled
      ? sc.targetScore
      : Math.round(sc.rawScore + ((sc.targetScore - sc.rawScore) * (resolvedCount / sc.cards.length)) * 0.9);

    var statusBadge = state.drifted
      ? '<span class="badge warn">DRIFTED (v2 Upstream Edit)</span>'
      : state.compiled
      ? '<span class="badge locked">V1 LOCKED</span>'
      : '<span class="badge info">AWAITING DECISIONS</span>';

    var html = '';
    html += '<div class="jp-topbar">';
    html += '  <div class="jp-badges">';
    html += '    <strong>Spec Bridge</strong>';
    html += '    ' + statusBadge;
    html += '    <span class="badge info">' + sc.issueType + ' (' + sc.issueKey + ')</span>';
    html += '  </div>';
    html += '  <div class="seg-group" role="group" aria-label="Role perspective view">';
    ['unified', 'pm', 'eng'].forEach(function (l) {
      var label = l === 'unified' ? 'Unified' : l === 'pm' ? 'PM View' : 'Engineer View';
      html +=
        '<button type="button" class="seg-btn" data-lens="' +
        l +
        '" aria-pressed="' +
        (state.lens === l) +
        '">' +
        label +
        '</button>';
    });
    html += '  </div>';
    html += '</div>';

    html += '<div class="jp-context">';
    html += '  <div><strong>Hierarchy:</strong> ' + sc.hierarchy + '</div>';
    html += '  <div style="margin-top:4px;color:var(--muted)">' + sc.sourceLabel + '</div>';
    html += '</div>';

    html += '<div class="jp-score-row">';
    html +=
      '  <div><strong>Spec Readiness Coach:</strong> <span class="badge ' +
      (score >= 85 ? 'locked' : 'warn') +
      '">' +
      score +
      '/100</span> <span style="font-size:0.8rem;color:var(--muted)">(Raw draft: ' +
      sc.rawScore +
      '/100)</span>' +
      (!allResolved
        ? ' <span class="jp-hint">&middot; Step 1: Resolve Card 2 or click Accept All Recommended</span>'
        : !state.compiled
        ? ' <span class="jp-hint">&middot; Step 2: Click Compile Child Items</span>'
        : '') +
      '</div>';
    html += '  <div style="display:flex;gap:8px;flex-wrap:wrap">';
    if (!allResolved) {
      html +=
        '<button type="button" class="btn sm primary" id="act-accept-all">1. Accept All Recommended</button>';
    }
    html +=
      '<button type="button" class="btn sm' +
      (allResolved && !state.compiled ? ' primary' : '') +
      '" id="act-compile" aria-disabled="' +
      String(!allResolved) +
      '">' +
      (state.compiled
        ? 'Re-Compile Locked Items'
        : '2. Compile Child Items (' + (sc.cards.length - resolvedCount) + ' open)') +
      '</button>';
    if (state.compiled) {
      html +=
        '<button type="button" class="btn sm' +
        (!state.drifted ? ' primary' : '') +
        '" id="act-drift">' +
        (state.drifted ? 'Re-Lock v2 Spec' : '3. Simulate Tuesday PRD Edit (Drift)') +
        '</button>';
    }
    html += '  </div>';
    html += '</div>';

    html +=
      '<div class="jp-track" role="progressbar" aria-label="Spec readiness score" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
      score +
      '"><div class="jp-fill" style="width:' +
      score +
      '%"></div></div>';

    if (state.drifted) {
      html +=
        '<div class="jp-context" style="border-color:var(--warn-border);background:var(--warn-bg);color:var(--warn-fg)" role="alert">' +
        '<strong>Workflow Gatekeeper Active:</strong> Linked Confluence PRD changed after lock. Affected stories are flagged <strong>DRIFTED</strong> and blocked from moving to <em>In Progress</em> until reviewed.' +
        '</div>';
    }

    // Compiled Stories Section
    if (state.compiled) {
      html += '<div style="margin-bottom:14px">';
      html +=
        '<div style="font-weight:700;font-size:0.9rem;margin-bottom:8px">Compiled Jira Items &middot; Ready for Sprint &amp; MCP Pull</div>';
      sc.stories.forEach(function (st, idx) {
        html += '<div class="jp-story-row">';
        html += '  <div>';
        html +=
          '    <strong>' +
          st.key +
          '</strong> <span class="badge ' +
          (state.drifted && idx === 0 ? 'warn' : 'locked') +
          '">' +
          (state.drifted && idx === 0 ? 'DRIFTED' : 'V1 LOCKED') +
          '</span> ';
        html += '<span>' + st.title + '</span>';
        html += '  </div>';
        html += '  <div class="jp-story-actions">';
        if (idx === 0) {
          html +=
            '<button type="button" class="btn sm" data-diff="toggle" aria-expanded="' +
            state.showDiff +
            '">Diff v1-&gt;v2</button>';
        }
        ['speckit', 'openspec', 'json'].forEach(function (fmt) {
          var isAct =
            state.activeProjection &&
            state.activeProjection.key === st.key &&
            state.activeProjection.fmt === fmt;
          html +=
            '<button type="button" class="btn sm' +
            (isAct ? ' primary' : '') +
            '" data-proj="' +
            st.key +
            ':' +
            fmt +
            '" aria-expanded="' +
            Boolean(isAct) +
            '">' +
            fmt +
            '</button>';
        });
        html += '  </div>';
        html += '</div>';
      });

      if (state.showDiff) {
        html += '<div class="diff-panel">';
        html +=
          '<div style="font-weight:700;margin-bottom:6px;font-family:sans-serif">Inline Spec Version Diff: ' +
          sc.diff.key +
          ' (v1 -&gt; v2)</div>';
        sc.diff.removed.forEach(function (line) {
          html += '<div class="diff-del">- ' + line + '</div>';
        });
        sc.diff.added.forEach(function (line) {
          html += '<div class="diff-add">+ ' + line + '</div>';
        });
        html += '</div>';
      }

      if (state.activeProjection) {
        var targetStory = sc.stories.find(function (s) {
          return s.key === state.activeProjection.key;
        });
        if (targetStory) {
          html +=
            '<pre class="code-preview">' +
            formatProjection(targetStory, state.activeProjection.fmt)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;') +
            '</pre>';
        }
      }
      html += '</div>';
    }

    // Decision Cards
    html +=
      '<div style="font-weight:700;font-size:0.9rem;margin-bottom:8px">Pre-Flight Decision Cards (' +
      resolvedCount +
      '/' +
      sc.cards.length +
      ' resolved)</div>';

    sc.cards.forEach(function (card) {
      var isRes = card.selected !== null;
      html += '<div class="jp-card ' + (isRes ? 'resolved' : '') + '">';
      html += '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">';
      html +=
        '  <strong>' +
        (state.lens === 'pm' ? card.title : '[' + card.category + '] ' + card.title) +
        '</strong>';
      html +=
        '  <span class="badge ' +
        (isRes ? 'locked' : 'info') +
        '">' +
        (isRes ? 'RESOLVED' : 'OPEN') +
        '</span>';
      html += '</div>';

      html += '<div class="jp-lenses ' + (state.lens !== 'unified' ? 'single' : '') + '">';
      if (state.lens !== 'eng') {
        html += '<div class="jp-lens-box">' + card.pmPrompt + '</div>';
      }
      if (state.lens !== 'pm') {
        html += '<div class="jp-lens-box">' + card.engPrompt + '</div>';
      }
      html += '</div>';

      card.options.forEach(function (opt, oIdx) {
        var sel = card.selected === oIdx;
        html +=
          '<button type="button" class="jp-opt" data-card="' +
          card.id +
          '" data-opt="' +
          oIdx +
          '" aria-pressed="' +
          sel +
          '">';
        html += '<div style="font-weight:600">' + opt.label + '</div>';
        html += '<div style="font-size:0.78rem;color:var(--muted);margin-top:2px">';
        if (state.lens !== 'eng') {
          html += '<strong>Product Impact:</strong> ' + opt.pmImpact;
        }
        if (state.lens === 'unified') {
          html += ' | ';
        }
        if (state.lens !== 'pm') {
          html += '<strong>System Rule:</strong> ' + opt.invariant;
        }
        html += '</div></button>';
      });
      html += '</div>';
    });

    // Parking Lot
    html += '<div class="jp-context" style="margin-top:10px;margin-bottom:0">';
    html += '<strong>Parking Lot &middot; Quarantined Non-Goals (' + sc.parkingLot.length + ')</strong>';
    html += '<ul style="margin:6px 0 0;padding-left:18px;color:var(--muted)">';
    sc.parkingLot.forEach(function (item) {
      html += '<li>' + item + '</li>';
    });
    html += '</ul></div>';

    root.innerHTML = html;
  }

  document.querySelectorAll('[data-scenario]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var nextKey = btn.getAttribute('data-scenario');
      state.scenarioKey = nextKey;
      state.compiled = false;
      state.drifted = false;
      state.showDiff = false;
      state.activeProjection = null;
      document.querySelectorAll('[data-scenario]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-scenario') === nextKey));
      });
      render();
    });
  });

  var drawerToggle = document.getElementById('drawer-mode-btn');
  if (drawerToggle && outer) {
    drawerToggle.addEventListener('click', function () {
      state.drawerMode = !state.drawerMode;
      outer.classList.toggle('drawer-mode', state.drawerMode);
      drawerToggle.setAttribute('aria-pressed', String(state.drawerMode));
      drawerToggle.textContent = state.drawerMode
        ? 'Full Issue Width'
        : 'Simulate 490px Kanban Drawer';
    });
  }

  root.addEventListener('click', function (ev) {
    var t = ev.target.closest('button');
    if (!t || t.getAttribute('aria-disabled') === 'true') return;

    if (t.hasAttribute('data-lens')) {
      state.lens = t.getAttribute('data-lens');
      render();
      return;
    }
    if (t.hasAttribute('data-card')) {
      var cid = t.getAttribute('data-card');
      var oidx = Number(t.getAttribute('data-opt'));
      var sc = currentScenario();
      sc.cards.forEach(function (c) {
        if (c.id === cid) c.selected = oidx;
      });
      render();
      return;
    }
    if (t.id === 'act-accept-all') {
      currentScenario().cards.forEach(function (c) {
        if (c.selected === null) c.selected = 0;
      });
      render();
      return;
    }
    if (t.id === 'act-compile') {
      state.compiled = true;
      state.drifted = false;
      state.activeProjection = { key: currentScenario().stories[0].key, fmt: 'speckit' };
      render();
      return;
    }
    if (t.id === 'act-drift') {
      if (!state.drifted) {
        state.drifted = true;
        state.showDiff = true;
        state.activeProjection = null;
      } else {
        state.drifted = false;
        state.showDiff = false;
      }
      render();
      return;
    }
    if (t.getAttribute('data-diff') === 'toggle') {
      state.showDiff = !state.showDiff;
      state.activeProjection = null;
      render();
      return;
    }
    if (t.hasAttribute('data-proj')) {
      var parts = t.getAttribute('data-proj').split(':');
      var same =
        state.activeProjection &&
        state.activeProjection.key === parts[0] &&
        state.activeProjection.fmt === parts[1];
      state.activeProjection = same ? null : { key: parts[0], fmt: parts[1] };
      state.showDiff = false;
      render();
    }
  });

  render();
})();
