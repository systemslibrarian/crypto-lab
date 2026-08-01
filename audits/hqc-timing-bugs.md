# Bug Audit: crypto-lab-hqc-timing

> **PARTIAL SALVAGE.** The original 15-line file was deleted in error on 2026-08-01 and
> is not recoverable (untracked, absent from all session logs, file-history and
> paste-cache). Lines 1-12 are reproduced verbatim below from a transcript. **Roughly
> the last 3 lines are lost** — likely a third finding, or the tail of finding 2.
>
> Both findings below were checked against the current code on 2026-08-01 and are
> **already remediated**: `initThemeToggle` now guards persistence behind
> `hasExplicitChoice()` rather than coercing on load, and `announce()` tracks
> `announceTimer` so a pending timeout is cancelled. No action needed on either.

### 1. Theme Storage Hydration Overwrites OS Preference
* **Location:** [src/main.ts](src/main.ts#L37)
* **Evidence:** On load, `initThemeToggle()` extracts the `data-theme` attribute (placed by the inline head script) and unconditionally passes it to `apply(current)`. Since `apply()` invokes `localStorage.setItem` ([src/main.ts](src/main.ts#L25)), the site permanently coerces the user's implicit system preference into a hardcoded explicit override. If the user later changes their system-level dark mode, the site ignores it.
* **Impact:** Breaks media query scheme synchronization logic.

### 2. ARIA Live-Region Announcer Race
* **Location:** [src/ui.ts](src/ui.ts#L24-L26)
* **Evidence:** `announce(message)` wraps `live.textContent = message` inside a 50ms `setTimeout()` but fails to maintain or clear pending timeouts. When the UI fires `announce("Running…")` prior to a `setTimeout(..., 0)` block, the attack computation finishes in <5ms. `renderRecovery()` then immediately fires `announce("Attack complete…")`. The two unmanaged timers fire concurrently, causing assistive tools to drop announcements.
* **Impact:** Inconsistent or entirely dropped screen-reader event notifications.

<!-- END OF SALVAGED CONTENT — approximately 3 further lines were lost. -->
