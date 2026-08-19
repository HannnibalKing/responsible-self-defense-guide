const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const scenarios = {
  home: {
    id: 'home', title: 'At home', subtitle: 'Make the home harder to enter and easier to leave.',
    priorities: ['Lock exterior doors and windows before relying on any response tool.', 'Keep a charged phone, flashlight, and first-aid kit accessible.', 'Use a family meeting point and a simple emergency call plan.', 'Avoid searching the home alone; retreat, secure, and call emergency services.'],
    kit: ['Charged phone and backup battery', 'High-lumen flashlight', 'Door/window reinforcement', 'First-aid kit', 'Smoke and carbon-monoxide alarms'],
    training: ['Home fire/medical evacuation drill', 'CPR and first-aid certification', 'De-escalation and emergency communication']
  },
  parking: {
    id: 'parking', title: 'Parking lot or garage', subtitle: 'Visibility, distance, and an exit route are your strongest tools.',
    priorities: ['Have keys ready before reaching the vehicle.', 'Park in a visible, well-lit area and scan the route before walking.', 'Move toward staffed businesses or groups rather than isolated corners.', 'If followed, do not drive home; call emergency services from a safe public location.'],
    kit: ['Charged phone and location sharing', 'Flashlight', 'Personal alarm', 'Reflective vest for roadside stops', 'Compact first-aid kit'],
    training: ['Situational awareness without confrontation', 'Emergency vehicle and roadside safety', 'First aid and bleeding control']
  },
  public: {
    id: 'public', title: 'Large public area', subtitle: 'Know exits, follow staff directions, and move away from danger early.',
    priorities: ['Identify two exits when entering a venue.', 'Create distance and leave at the first safe opportunity.', 'Follow venue staff and emergency instructions.', 'Do not approach, film, or investigate a suspected threat.'],
    kit: ['Charged phone', 'Small flashlight', 'Basic first-aid supplies', 'Hearing protection for events', 'Emergency contact card'],
    training: ['Venue emergency briefing', 'Stop-the-bleed or first-aid course', 'Family reunification planning']
  }
};

function json(response, status, value) { response.writeHead(status, {'Content-Type': 'application/json; charset=utf-8'}); response.end(JSON.stringify(value)); }
const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  if (request.method === 'GET' && url.pathname === '/api/health') return json(response, 200, {status: 'ok'});
  if (request.method === 'GET' && url.pathname === '/api/scenarios') return json(response, 200, Object.values(scenarios));
  if (request.method === 'GET' && url.pathname.startsWith('/api/scenarios/')) {
    const scenario = scenarios[url.pathname.split('/').pop()];
    return scenario ? json(response, 200, scenario) : json(response, 404, {error: 'scenario not found'});
  }
  const requested = url.pathname === '/' ? '/index.html' : url.pathname;
  const file = path.join(__dirname, requested);
  const relative = path.relative(__dirname, file);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return json(response, 403, {error: 'forbidden'});
  fs.readFile(file, (error, content) => {
    if (error) return json(response, 404, {error: 'not found'});
    const type = file.endsWith('.css') ? 'text/css; charset=utf-8' : file.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8';
    response.writeHead(200, {'Content-Type': type, 'Cache-Control': 'no-cache'}); response.end(content);
  });
});

module.exports = {scenarios};
if (require.main === module) server.listen(Number(process.env.PORT || 3000), () => console.log('Responsible Self-Defense Guide on http://localhost:' + (process.env.PORT || 3000)));
