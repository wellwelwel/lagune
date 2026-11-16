const list = document.querySelector('#notes');
const form = document.querySelector('#new-note');

const render = (notes) => {
  list.replaceChildren(
    ...notes.map((note) => {
      const item = document.createElement('li');

      item.textContent = note.text;

      return item;
    })
  );
};

const load = async () => {
  const response = await fetch('/api/notes');

  render(await response.json());
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = new FormData(form).get('text');

  await fetch('/api/notes', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  form.reset();
  await load();
});

load();
