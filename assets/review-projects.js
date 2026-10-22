(function (global) {
  const projects = {
    aesso: [{ id: 'projecte-aesso', name: 'Calculadora de protecció solar' }],
    'alta-medical-services': [{ id: 'projecte-odc', name: 'Open Data Capture' }],
    'configura-cat': [],
    'alianca-digital-cat': [],
    'prova-interna': []
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = projects;
  else global.REVIEW_PROJECTS = projects;
})(typeof window !== 'undefined' ? window : globalThis);