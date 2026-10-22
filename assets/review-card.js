(function () {
  window.createClientReviewCard = function (review) {
    const card = document.createElement('article');
    card.className = 'client-review-card';
    const top = document.createElement('div');
    top.className = 'client-review-card__top';
    const name = document.createElement('strong');
    name.textContent = review.name || 'Anònim';
    const date = document.createElement('span');
    date.className = 'client-review-card__date';
    const parsedDate = new Date(review.date);
    date.textContent = Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toLocaleDateString('ca-ES', { year: 'numeric', month: 'short', day: 'numeric' });
    const message = document.createElement('p');
    message.className = 'client-review-card__message';
    message.textContent = review.message || '';
    top.append(name, date);
    card.appendChild(top);
    if (review.companyName) {
      const company = document.createElement('p');
      company.className = 'client-review-card__company';
      company.textContent = review.companyName;
      card.appendChild(company);
    }
    if (review.projectName) {
      const project = document.createElement('p');
      project.className = 'client-review-card__project';
      project.textContent = review.projectName;
      card.appendChild(project);
    }
    card.appendChild(message);
    return card;
  };
})();