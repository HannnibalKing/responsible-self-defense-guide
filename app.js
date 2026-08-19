const scenarioTitle = document.querySelector('#scenario-title');
const scenarioSubtitle = document.querySelector('#scenario-subtitle');
const priorities = document.querySelector('#priorities');
const kit = document.querySelector('#kit');
const training = document.querySelector('#training-list');
const tabs = document.querySelectorAll('[data-scenario]');

async function loadScenario(id) {
  const response = await fetch(`/api/scenarios/${id}`);
  const scenario = await response.json();
  scenarioTitle.textContent = scenario.title;
  scenarioSubtitle.textContent = scenario.subtitle;
  priorities.innerHTML = scenario.priorities.map(item => `<li>${item}</li>`).join('');
  kit.innerHTML = scenario.kit.map(item => `<li>${item}</li>`).join('');
  training.innerHTML = scenario.training.map(item => `<li>${item}</li>`).join('');
  tabs.forEach(tab => tab.classList.toggle('selected', tab.dataset.scenario === id));
}

tabs.forEach(tab => tab.addEventListener('click', () => loadScenario(tab.dataset.scenario)));
document.querySelector('#print').addEventListener('click', () => window.print());
loadScenario('home');
