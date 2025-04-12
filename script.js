const itemList = document.getElementById('item-list');
const totalEl = document.getElementById('total');
let total = 0;
let items = [];

let toastBox = document.getElementById('toastBox');

window.onload = () => {
  const stored = JSON.parse(localStorage.getItem('expenseItems')) || [];
  items = stored;
  items.forEach(({ name, amount }) => {
    addItemToDOM(name, amount);
    total += amount;
  });
  totalEl.textContent = total.toFixed(2);
};

function showToast(msg, type) {
  let toast = document.createElement('div');
  toast.classList.add('toast');
  toast.classList.add(type);
  toast.innerHTML = msg;
  toastBox.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 5000);
}

function addItem() {
  const name = document.getElementById('item-name').value.trim();
  const amount = parseFloat(document.getElementById('item-amount').value);

  if (!name || isNaN(amount)) {
    showToast('<i class="fa-solid fa-circle-xmark"></i> Please enter a valid name and amount', 'error');

    return;
  }

  items.push({ name, amount });
  addItemToDOM(name, amount);
  total += amount;
  totalEl.textContent = total.toFixed(2);
  updateLocalStorage();

  document.getElementById('item-name').value = '';
  document.getElementById('item-amount').value = '';
}

function addItemToDOM(name, amount) {
  const item = document.createElement('div');
  item.className =
    'flex justify-between items-center bg-white p-4 rounded-xl shadow border border-gray-200';
  item.innerHTML = `
    <div>
      <p class="capitalize font-medium text-gray-800">${name}</p>
      <p class="text-sm text-gray-500">₹${amount.toFixed(2)}</p>
    </div>
    <img src="./Icon/Menu.svg" alt="Menu" class="menu-icon w-5 h-5 cursor-pointer opacity-70 hover:opacity-100 rounded-full hover:border border-gray-400 hover:border-gray-700 transition duration-200"/>
  `;
  itemList.appendChild(item);
}

document.addEventListener('click', function (e) {
  const existing = document.querySelector('.popup-menu');
  if (existing) existing.remove();

  if (e.target.classList.contains('menu-icon')) {
    const icon = e.target;
    const rect = icon.getBoundingClientRect();
    const itemDiv = icon.closest('div');
    const textSpan = itemDiv.querySelector('p').textContent;
    const amount = parseFloat(itemDiv.querySelectorAll('p')[1].textContent.replace('₹', ''));
    const name = textSpan.trim();

    const popup = document.createElement('div');
    popup.className =
      'popup-menu absolute bg-white shadow-lg border border-gray-300 rounded-md p-2 w-40 z-50';
    popup.style.position = 'fixed';
    popup.style.top = `${rect.bottom + 5}px`;
    popup.style.left = `${rect.left - 140}px`;

    popup.innerHTML = `
      <button onclick="detailsItem('${name}', ${amount})" class="flex items-center text-blue-600 gap-2 w-full text-left px-4 py-2 hover:bg-blue-100 hover:rounded">
        <i class="fa-solid fa-circle-info text-blue-500"></i> Details
      </button>
      <button onclick="renameItem('${name}')" class="flex items-center text-amber-600 gap-2 w-full text-left px-4 py-2 hover:bg-amber-100 hover:rounded">
        <i class="fa-solid fa-pen text-amber-500"></i> Edit
      </button>
      <button onclick="deleteItem('${name}')" class="flex items-center text-red-600 gap-2 w-full text-left px-4 py-2 hover:bg-red-100 hover:rounded">
        <i class="fa-solid fa-trash"></i> Delete
      </button>
    `;

    document.body.appendChild(popup);
  }
});

document.addEventListener(
  'click',
  function (e) {
    const popup = document.querySelector('.popup-menu');
    if (popup && !e.target.classList.contains('menu-icon') && !popup.contains(e.target)) {
      popup.remove();
    }
  },
  true
);

function detailsItem(name, amount) {
  alert(`Item Details:\n\nName: ${name}\nAmount: ₹${amount.toFixed(2)}`);
  document.querySelector('.popup-menu')?.remove();
}

function deleteItem(name) {
  items = items.filter((item) => item.name !== name);
  total = items.reduce((sum, item) => sum + item.amount, 0);
  updateLocalStorage();
  renderItems();
  document.querySelector('.popup-menu')?.remove();
}

function renameItem(oldName) {
  const newName = prompt('Enter new name:');
  if (newName) {
    items = items.map((item) => (item.name === oldName ? { ...item, name: newName } : item));
    updateLocalStorage();
    renderItems();
  }
  document.querySelector('.popup-menu')?.remove();
}

function renderItems() {
  itemList.innerHTML = '';
  items.forEach(({ name, amount }) => {
    addItemToDOM(name, amount);
  });
  totalEl.textContent = items.reduce((sum, item) => sum + item.amount, 0).toFixed(2);
}

function clearAll() {
  items = [];
  itemList.innerHTML = '';
  total = 0;
  totalEl.textContent = total.toFixed(2);
  localStorage.removeItem('expenseItems');
  showToast('<i class="fa-solid fa-check-circle"></i> All items cleared successfully!', 'success');
}

function updateLocalStorage() {
  localStorage.setItem('expenseItems', JSON.stringify(items));
}
