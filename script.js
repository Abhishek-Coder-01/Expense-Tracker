
    const itemList = document.getElementById('item-list');
    const totalEl = document.getElementById('total');
    let total = 0;
    let items = [];

    // ✅ Load from localStorage on page load
    window.onload = () => {
      const stored = JSON.parse(localStorage.getItem('expenseItems')) || [];
      items = stored;
      items.forEach(({ name, amount }) => {
        addItemToDOM(name, amount);
        total += amount;
      });
      totalEl.textContent = total.toFixed(2);
    };

    // ✅ Add item
    function addItem() {
      const name = document.getElementById('item-name').value.trim();
      const amount = parseFloat(document.getElementById('item-amount').value);

      if (!name || isNaN(amount)) {
        alert('Please enter a valid name and amount');
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

    // ✅ Show item in DOM
    function addItemToDOM(name, amount) {
      const item = document.createElement('div');
      item.className = 'flex justify-between font-semibold items-center bg-gray-100 p-4 rounded-md shadow-sm mb-2';
      item.innerHTML = `
            <span class="capitalize text-gray-800">${name}: ₹${amount.toFixed(2)}</span>
            <img src="./Icon/Menu.svg" alt="Menu" class="menu-icon w-5 h-5 cursor-pointer opacity-70 hover:opacity-100 rounded-full hover:border border-gray-400 hover:border-gray-700 transition duration-200"/>
          `;
      itemList.appendChild(item);
    }

    // ✅ Show popup menu on menu-icon click
    document.addEventListener('click', function (e) {
      const existing = document.querySelector('.popup-menu');
      if (existing) existing.remove();

      if (e.target.classList.contains('menu-icon')) {
        const icon = e.target;
        const rect = icon.getBoundingClientRect();

        // 🔍 Get item data
        const itemDiv = icon.closest('div');
        const textSpan = itemDiv.querySelector('span').textContent;
        const [nameRaw, amountRaw] = textSpan.split(': ₹');
        const name = nameRaw.trim();
        const amount = parseFloat(amountRaw.trim());

        // 📦 Create popup

        const popup = document.createElement('div'); // popup bana
        popup.id = 'my-popup-id'; // usko ID de di
        popup.className = 'popup-menu absolute bg-white shadow-lg border border-gray-300 rounded-md p-2 w-40 z-50'; // class bhi set

        popup.style.position = 'fixed';
        popup.style.top = `${rect.bottom + 5}px`;
        popup.style.left = `${rect.left + -140}px`;

        popup.innerHTML = `
              <button onclick="detailsItem('${name}', ${amount})" class="flex items-center text-blue-600 gap-2 w-full text-left px-4 py-2 hover:bg-blue-100 hover:rounded">
                <i class="fa-solid fa-circle-info text-blue-500"></i>
                Details
              </button>
              </button>
              <button onclick="renameItem('${name}')" class="block w-full text-left text-amber-600 px-4 py-2 hover:bg-amber-100 hover:rounded">
                <i class="fa-solid fa-pen pr-[5px] text-amber-500"></i> Edit
              </button>
              <button onclick="deleteItem('${name}')" class="block w-full text-left text-red-600 px-4 py-2 hover:bg-red-100 hover:rounded">
                <i class="fa-solid fa-trash pr-[5px]"></i> Delete
              </button>
            `;

        document.body.appendChild(popup);
      }
    });

    // ✅ Remove popup if clicked outside
    document.addEventListener('click', function (e) {
      const popup = document.querySelector('.popup-menu');
      if (popup && !e.target.classList.contains('menu-icon') && !popup.contains(e.target)) {
        popup.remove();
      }
    }, true);

    function detailsItem(name, amount) {
      // First letter capitalize
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

      alert(`Item Details:\n\nName: ${capitalizedName}\nAmount: ₹${amount.toFixed(2)}`);
      document.querySelector('.popup-menu')?.remove();
    }



    // ✅ Delete item
    function deleteItem(name) {
      items = items.filter(item => item.name !== name);
      total = items.reduce((sum, item) => sum + item.amount, 0);
      updateLocalStorage();
      renderItems();
      document.querySelector('.popup-menu')?.remove();
    }

    // ✅ Rename item
    function renameItem(oldName) {
      const newName = prompt("Enter new name:");
      if (newName) {
        items = items.map(item => {
          if (item.name === oldName) return { ...item, name: newName };
          return item;
        });
        updateLocalStorage();
        renderItems();
      }
      document.querySelector('.popup-menu')?.remove();
    }

    // ✅ Re-render items
    function renderItems() {
      itemList.innerHTML = '';
      items.forEach(({ name, amount }) => {
        addItemToDOM(name, amount);
      });
      totalEl.textContent = items.reduce((sum, item) => sum + item.amount, 0).toFixed(2);
    }

    // ✅ Clear all items
    function clearAll() {
      items = [];
      itemList.innerHTML = '';
      total = 0;
      totalEl.textContent = total.toFixed(2);
      localStorage.removeItem('expenseItems');
    }

    // ✅ Save to localStorage
    function updateLocalStorage() {
      localStorage.setItem('expenseItems', JSON.stringify(items));
    }

