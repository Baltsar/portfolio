import projectData from '../src/data/projects.json';

export const projects = projectData.projects;

export function renderProjectWindow(p) {
  const tagsHTML = p.tags.map(t => `<span class="tag ${t.class}">${t.label}</span>`).join('');
  const artStyle = p.art ? ` style="background-image: url('${p.art}')"` : '';
  const scanClass = p.scanClass ? ` ${p.scanClass}` : '';

  return `
    <div class="mac-window ${p.winClass}" id="${p.id.replace(/-/g, '')}" data-project="${p.id}">
      <div class="mac-titlebar">
        <div class="titlebar-grip"><span></span><span></span><span></span></div>
        <div class="mac-title">${p.windowTitle}</div>
      </div>
      <div class="mac-content">
        <div class="project-canvas">
          <div class="project-art ${p.artPlaceholder}"${artStyle}>
            <div class="scan${scanClass}"></div>
            <div class="project-overlay">
              <div class="overlay-text">
                <div class="overlay-title">${p.title}<br><span class="${p.accentClass}">${p.titleAccent}</span></div>
                <div class="overlay-sub">${p.overlaySub}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="project-bar">
          <div class="bar-tags">${tagsHTML}</div>
          <a class="open-btn" href="#" data-spinner="${p.spinnerSet}" data-resting="\u231F"><span class="open-glyph">\u231F</span> Open</a>
          <div class="bar-drag"></div>
        </div>
      </div>
    </div>
  `;
}

export function renderAllProjects(containerEl) {
  const html = projects.map(p => renderProjectWindow(p)).join('');
  containerEl.insertAdjacentHTML('afterbegin', html);
}
