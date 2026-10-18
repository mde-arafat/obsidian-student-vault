const { Plugin, PluginSettingTab, Setting, MarkdownView, TFile, setTooltip, debounce } = require("obsidian");

// 1. Every time a note is opened (any tab, any route), show it in reading mode.
// 2. In reading mode the title is locked (editing it would rename the file).
// 3. A one-click bookmark button in every note header (outline = not bookmarked, filled = bookmarked).
// 4. Two-finger swipe on the trackpad, like Chrome: swipe right = back, swipe left = forward.
// 5. A calm New tab page: picture, greeting, today's date and the next deadline.
// The pencil (or Cmd+E) still switches the current note to editing, and unlocks the title.

// Drop one of these into Attachments/ to use your own photo on the New tab page.
const NEW_TAB_PHOTOS = ["new-tab.jpg", "new-tab.jpeg", "new-tab.png", "new-tab.webp"];
const DEFAULT_SETTINGS = { name: "" };

module.exports = class OpenInReadingMode extends Plugin {
  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.addSettingTab(new VaultEssentialsSettingTab(this.app, this));
    this.bookmarkButtons = new WeakMap();
    this.setupSwipe();

    // Pick up a new or removed New tab photo straight away.
    const onFileChange = (file) => {
      if (file && file.path.startsWith("Attachments/new-tab.")) this.setupNewTabImages();
    };
    this.registerEvent(this.app.vault.on("create", onFileChange));
    this.registerEvent(this.app.vault.on("delete", onFileChange));
    this.registerEvent(this.app.vault.on("rename", onFileChange));

    // Keep the New tab page live: greeting and date every minute,
    // the deadline line as soon as a note's due date or status changes.
    this.registerInterval(window.setInterval(() => this.renderNewTabs(), 60 * 1000));
    const redrawNewTabs = debounce(() => this.renderNewTabs(), 300, true);
    this.registerEvent(this.app.metadataCache.on("changed", redrawNewTabs));
    this.registerEvent(this.app.vault.on("delete", redrawNewTabs));
    this.registerEvent(this.app.vault.on("rename", redrawNewTabs));

    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        if (!file || file.extension !== "md") return;
        // Wait a moment so the note has finished loading in its tab.
        window.setTimeout(() => {
          const view = this.app.workspace.getActiveViewOfType(MarkdownView);
          if (view && view.file === file && view.getMode() !== "preview") {
            const state = view.leaf.getViewState();
            state.state = { ...state.state, mode: "preview" };
            view.leaf.setViewState(state);
          }
          this.refresh();
        }, 10);
      })
    );
    // Switching between reading and editing, or between tabs, changes the layout.
    this.registerEvent(this.app.workspace.on("layout-change", () => this.refresh()));
    this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.refresh()));
    this.app.workspace.onLayoutReady(() => {
      this.setupNewTabImages();
      this.refresh();
    });
  }

  refresh() {
    this.lockTitles();
    this.updateBookmarkButtons();
    this.renderNewTabs();
  }

  // Pictures for the New tab page: your own photo if there is one, otherwise the built-in illustrations.
  setupNewTabImages() {
    const dir = this.manifest.dir;
    let light = this.app.vault.adapter.getResourcePath(`${dir}/new-tab-light.svg`);
    let dark = this.app.vault.adapter.getResourcePath(`${dir}/new-tab-dark.svg`);
    const photo = NEW_TAB_PHOTOS
      .map((name) => this.app.vault.getAbstractFileByPath(`Attachments/${name}`))
      .find((file) => file instanceof TFile);
    if (photo) light = dark = this.app.vault.getResourcePath(photo);
    document.body.style.setProperty("--vault-newtab-light", `url("${light}")`);
    document.body.style.setProperty("--vault-newtab-dark", `url("${dark}")`);
  }

  renderNewTabs() {
    this.app.workspace.getLeavesOfType("empty").forEach((leaf) => {
      const container = leaf.view.containerEl.querySelector(".empty-state-container");
      if (!container) return;
      let hero = container.querySelector(".vault-newtab-hero");
      if (!hero) {
        hero = createDiv({ cls: "vault-newtab-hero" });
        container.prepend(hero);
      }
      this.fillNewTab(hero, leaf);
    });
  }

  fillNewTab(hero, leaf) {
    hero.empty();
    const now = new Date();
    const hour = now.getHours();
    const part = hour < 5 ? "night" : hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 22 ? "evening" : "night";
    const name = (this.settings.name || "").trim();
    hero.createDiv({ cls: "vault-newtab-greeting", text: name ? `Good ${part}, ${name}` : `Good ${part}` });
    hero.createDiv({
      cls: "vault-newtab-date",
      text: now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    });

    const line = hero.createDiv({ cls: "vault-newtab-next" });
    const next = this.findNextDeadline();
    if (!next) {
      line.addClass("is-empty");
      line.setText("Nothing due — enjoy the calm.");
      return;
    }
    const d = next.days;
    const when = d === 0 ? "today" : d === 1 ? "tomorrow" : d === -1 ? "yesterday" : d > 1 ? `in ${d} days` : `${-d} days ago`;
    line.toggleClass("is-overdue", d < 0);
    line.createSpan({ cls: "vault-newtab-label", text: d < 0 ? "Overdue" : "Next up" });
    line.createSpan({ cls: "vault-newtab-title", text: next.file.basename });
    line.createSpan({ cls: "vault-newtab-when", text: `· ${when}` });
    line.addEventListener("click", () => leaf.openFile(next.file));
  }

  // The earliest open deadline: notes with a `due` date whose status isn't done/closed/passed.
  findNextDeadline() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let best = null;
    for (const file of this.app.vault.getMarkdownFiles()) {
      if (file.path.startsWith("Templates/")) continue;
      const fm = this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (!fm || !fm.due) continue;
      if (["done", "closed", "passed"].includes(String(fm.status ?? "").toLowerCase())) continue;
      const m = String(fm.due).match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!m) continue;
      const due = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      if (!best || due < best.due) best = { file, due, days: Math.round((due - today) / 86400000) };
    }
    return best;
  }

  lockTitles() {
    this.app.workspace.getLeavesOfType("markdown").forEach((leaf) => {
      const view = leaf.view;
      if (!(view instanceof MarkdownView) || !view.inlineTitleEl) return;
      view.inlineTitleEl.contentEditable = view.getMode() === "preview" ? "false" : "true";
    });
  }

  // The bookmarks core plugin; null if it's turned off or its internals change.
  getBookmarks() {
    const bookmarks = this.app.internalPlugins?.getPluginById?.("bookmarks")?.instance;
    if (!bookmarks || typeof bookmarks.getBookmarks !== "function") return null;
    return bookmarks;
  }

  // Read the live bookmark list (updates instantly, unlike Obsidian's cached lookup).
  findFileBookmark(bookmarks, file) {
    if (!file) return null;
    return bookmarks.getBookmarks().find((item) => item.type === "file" && item.path === file.path && !item.subpath) || null;
  }

  updateBookmarkButtons() {
    const bookmarks = this.getBookmarks();
    if (!bookmarks) return;
    this.app.workspace.getLeavesOfType("markdown").forEach((leaf) => {
      const view = leaf.view;
      if (!(view instanceof MarkdownView)) return;
      let button = this.bookmarkButtons.get(view);
      if (!button) {
        button = view.addAction("bookmark", "Bookmark", () => {
          if (!view.file) return;
          const item = this.findFileBookmark(bookmarks, view.file);
          if (item) bookmarks.removeItem(item);
          else bookmarks.addItem({ type: "file", ctime: Date.now(), path: view.file.path });
          this.updateBookmarkButtons();
        });
        button.addClass("vault-bookmark-toggle");
        this.bookmarkButtons.set(view, button);
      }
      const isBookmarked = !!this.findFileBookmark(bookmarks, view.file);
      button.toggleClass(["mod-bookmarked", "mod-filled"], isBookmarked);
      setTooltip(button, isBookmarked ? "Remove bookmark" : "Bookmark");
    });
  }

  // A trackpad swipe reaches Obsidian as sideways scrolling, so add it up and
  // go back or forward once it passes a threshold. One swipe = one note.
  setupSwipe() {
    const THRESHOLD = 150; // pixels of sideways movement
    let total = 0;
    let fired = false;
    let idleTimer = null;

    this.registerDomEvent(
      document,
      "wheel",
      (evt) => {
        if (Math.abs(evt.deltaX) <= Math.abs(evt.deltaY)) return; // normal up/down scrolling
        const target = evt.target;
        if (!(target instanceof Element)) return;
        if (!target.closest('.workspace-leaf-content[data-type="markdown"]')) return; // notes only
        if (this.canScrollSideways(target, evt.deltaX)) return; // wide tables, code blocks

        total += evt.deltaX;
        window.clearTimeout(idleTimer);
        // The gesture is over once the scroll events stop (this also swallows trackpad momentum).
        idleTimer = window.setTimeout(() => {
          total = 0;
          fired = false;
        }, 250);

        if (fired) return;
        if (total <= -THRESHOLD) {
          fired = true;
          this.app.commands.executeCommandById("app:go-back");
        } else if (total >= THRESHOLD) {
          fired = true;
          this.app.commands.executeCommandById("app:go-forward");
        }
      },
      { passive: true }
    );
  }

  // True if something under the pointer can still scroll in that direction.
  canScrollSideways(el, deltaX) {
    for (let node = el; node && node instanceof Element; node = node.parentElement) {
      if (node.classList.contains("workspace-leaf-content")) break;
      const overflowX = getComputedStyle(node).overflowX;
      if ((overflowX === "auto" || overflowX === "scroll") && node.scrollWidth > node.clientWidth + 1) {
        if (deltaX < 0 && node.scrollLeft > 0) return true;
        if (deltaX > 0 && node.scrollLeft + node.clientWidth < node.scrollWidth - 1) return true;
      }
    }
    return false;
  }

  onunload() {
    // Give titles back their normal behaviour and remove our bookmark buttons and New tab extras.
    this.app.workspace.getLeavesOfType("markdown").forEach((leaf) => {
      const view = leaf.view;
      if (!(view instanceof MarkdownView)) return;
      if (view.inlineTitleEl) view.inlineTitleEl.contentEditable = "true";
      const button = this.bookmarkButtons.get(view);
      if (button) button.remove();
    });
    document.querySelectorAll(".vault-newtab-hero").forEach((el) => el.remove());
    document.body.style.removeProperty("--vault-newtab-light");
    document.body.style.removeProperty("--vault-newtab-dark");
  }
};

// Settings → Vault essentials: the name used in the New tab greeting.
class VaultEssentialsSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    new Setting(containerEl)
      .setName("Your name")
      .setDesc("Shown in the New tab greeting, e.g. \"Good morning, Sam\". Leave empty for just \"Good morning\".")
      .addText((text) =>
        text
          .setPlaceholder("Your name")
          .setValue(this.plugin.settings.name)
          .onChange(async (value) => {
            this.plugin.settings.name = value;
            await this.plugin.saveData(this.plugin.settings);
            this.plugin.renderNewTabs();
          })
      );
  }
}
