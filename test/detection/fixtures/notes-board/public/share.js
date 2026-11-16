const banner = document.querySelector('#banner');
const params = new URLSearchParams(location.search);
const sharedBy = params.get('from');

if (sharedBy)
  banner.innerHTML = `<p>${sharedBy} shared this board with you.</p>`;
