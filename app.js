// Storage Controller
const StorageCtrl = (function() {
	// Public methods
	return {
		storeItem: function(item) {
			let items = [];
			// Check it items in ls is empty
			if (localStorage.getItem('items') === null) {
				// Push new item
				items.push(item);
				// Set ls
				localStorage.setItem('items', JSON.stringify(items));
				// Items in ls not empty
			} else {
				// Get items from ls
				items = JSON.parse(localStorage.getItem('items'));
				// Push new item
				items.push(item);
				// Save in ls
				localStorage.setItem('items', JSON.stringify(items));
			}
		},
		getItemsFromStorage: function() {
			let items = [];
			// Check if ls is empty
			if (localStorage.getItem('items') === null) {
				items = [];
				// If ls is not empty
			} else {
				items = JSON.parse(localStorage.getItem('items'));
			}

			return items;
		},
		updateItemStorage: function(updatedItem) {
			// Get items in ls
			let items = JSON.parse(localStorage.getItem('items'));
			// Loop through items
			items.forEach(function(item, index) {
				if (updatedItem.id === item.id) {
					items.splice(index, 1, updatedItem);
				}
			});
			// Set ls
			localStorage.setItem('items', JSON.stringify(items));
		},
		deleteItemStorage: function(id) {
			// Get items from ls
			let items = JSON.parse(localStorage.getItem('items'));

			// Loop through items
			items.forEach(function(item, index) {
				// Check for item
				if (id === item.id) {
					// Delete from items
					items.splice(index, 1);
				}
			});
			// Set ls
			localStorage.setItem('items', JSON.stringify(items));
		},
		clearItemStorage: function() {
			let items = [];
			// Clear ls
			localStorage.removeItem('items');
		}
	};
})();

// Item Controller
const ItemCtrl = (function() {
	const Item = function(id, name, calories) {
		this.id = id;
		this.name = name;
		this.calories = calories;
	};

	// Data structure / State
	const data = {
		// items: [
		// 	// { id: 0, name: 'Steak Dinner', calories: 1200 },
		// 	// { id: 1, name: 'Cookie', calories: 400 },
		// 	// { id: 2, name: 'Eggs', calories: 300 }
		// ],
		items: StorageCtrl.getItemsFromStorage(),
		currentItem: null,
		totalCalories: 0
	};
	// Public Methods
	return {
		getItems: function() {
			return data.items;
		},

		addItem: function(name, calories) {
			let ID;
			// Create ID
			if (data.items.length > 0) {
				ID = data.items[data.items.length - 1].id + 1;
			} else {
				ID = 0;
			}

			// convert calories to number
			calories = parseInt(calories);

			// Create new item
			newItem = new Item(ID, name, calories);

			// Add to items array
			data.items.push(newItem);

			return newItem;
		},

		getItemById: function(id) {
			let found = null;
			data.items.forEach(function(item) {
				if (item.id === id) {
					found = item;
				}
			});
			return found;
		},

		updateItem: function(name, calories) {
			// Calories to number
			calories = parseInt(calories);

			let found = null;
			// Loop through items
			data.items.forEach(function(item) {
				// Item found
				if (item.id === data.currentItem.id) {
					// Update item properties
					item.name = name;
					item.calories = calories;
					// Save the updated item
					found = item;
				}
			});

			return found;
		},

		deleteItem: function(id) {
			// Get list of ids
			const ids = data.items.map(function(item) {
				return item.id;
			});
			// Get index
			const index = ids.indexOf(id);
			// Remove item
			data.items.splice(index, 1);
		},

		clearAllItems: function() {
			data.items = [];
		},

		getCurrentItem: function() {
			return data.currentItem;
		},

		setCurrentItem: function(item) {
			data.currentItem = item;
		},

		getTotalCalories: function() {
			let total = 0;
			// Loop and add cals
			data.items.forEach(function(item) {
				total += item.calories;
			});
			// Set total cal in data structure
			data.totalCalories = total;

			return total;
		},

		logData: function() {
			return data;
		}
	};
})();

// UI Controller
const UICtrl = (function() {
	const UISelectors = {
		itemList: '#item-list',
		listItems: '#item-list li',
		addBtn: '.add-btn',
		updateBtn: '.update-btn',
		deleteBtn: '.delete-btn',
		backBtn: '.back-btn',
		clearBtn: '.clear-btn',
		itemNameInput: '#item-name',
		itemCaloriesInput: '#item-calories',
		totalCalories: '.total-calories'
	};

	// Public Methods
	return {
		populateItemList: function(items) {
			let html = '';

			items.forEach(function(item) {
				html += `<li class="collection-item" id="item-${item.id}">
				<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
				<a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
			  </li>`;
			});

			// Insert List items
			document.querySelector(UISelectors.itemList).innerHTML = html;
		},

		getItemInput: function() {
			return {
				name: document.querySelector(UISelectors.itemNameInput).value,
				calories: document.querySelector(UISelectors.itemCaloriesInput).value
			};
		},
		addListItem: function(item) {
			// Show the list
			document.querySelector(UISelectors.itemList).style.display = 'block';
			// Create li element
			const li = document.createElement('li');
			// Add class
			li.className = 'collection-item';
			// Add ID
			li.id = `item-${item.id}`;
			// Add html
			li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      		<a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
			// Insert item
			document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
		},

		updateListItem: function(updatedItem) {
			// Get all list items
			let itemList = document.querySelectorAll(UISelectors.listItems);
			// Convert Node list to Array
			Array.from(itemList);

			itemList.forEach(function(listItem) {
				// Get id of listItem
				const itemID = listItem.getAttribute('id');

				if (itemID === `item-${updatedItem.id}`) {
					document.querySelector(
						`#${itemID}`
					).innerHTML = `<strong>${updatedItem.name}: </strong> <em>${updatedItem.calories} Calories</em>
					<a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
				}
			});
		},

		deleteListItem: function(id) {
			const itemID = `#item-${id}`;
			const item = document.querySelector(itemID);
			item.remove();
		},

		clearInput: function() {
			document.querySelector(UISelectors.itemNameInput).value = '';
			document.querySelector(UISelectors.itemCaloriesInput).value = '';
		},
		addItemToForm: function() {
			document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
			document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
			UICtrl.showEditState();
		},

		removeItems: function() {
			// Get all list items
			let listItems = document.querySelectorAll(UISelectors.listItems);

			// Convert Node list items to array
			listItems = Array.from(listItems);

			// Loop through list items
			listItems.forEach(function(item) {
				item.remove();
			});
		},

		showEditState: function() {
			document.querySelector(UISelectors.updateBtn).style.display = 'inline';
			document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
			document.querySelector(UISelectors.backBtn).style.display = 'inline';
			document.querySelector(UISelectors.addBtn).style.display = 'none';
		},
		hideList: function() {
			document.querySelector(UISelectors.itemList).style.display = 'none';
		},
		showTotalCalories: function(totalCalories) {
			document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
		},
		clearEditState: function() {
			UICtrl.clearInput();
			document.querySelector(UISelectors.updateBtn).style.display = 'none';
			document.querySelector(UISelectors.deleteBtn).style.display = 'none';
			document.querySelector(UISelectors.backBtn).style.display = 'none';
			document.querySelector(UISelectors.addBtn).style.display = 'inline';
		},
		getSelectors: function() {
			return UISelectors;
		}
	};
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
	// UI selectors
	const loadEventListeners = function() {
		// Get UI selectors
		const UISelectors = UICtrl.getSelectors();

		// Add item event listener
		document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

		// Disable submit on enter
		document.addEventListener('keypress', function(e) {
			if (e.keyCode === 13 || e.which === 13) {
				e.preventDefault();
				return false;
			}
		});

		// Update item event listener
		document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

		// Back button event listener
		document.querySelector(UISelectors.backBtn).addEventListener('click', function(e) {
			UICtrl.clearEditState();
			e.preventDefault();
		});

		document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

		// Edit item event listener
		document.querySelector(UISelectors.itemList).addEventListener('click', editItemClick);

		// Clear items event listener
		document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
	};

	// Add item submit
	const itemAddSubmit = function(e) {
		// Get item input
		const input = UICtrl.getItemInput();

		// Check for name and calories input
		if (input.name !== '' && input.calories !== '') {
			// Add new item to data
			const newItem = ItemCtrl.addItem(input.name, input.calories);

			// Add new item to UI
			UICtrl.addListItem(newItem);

			// Get total calories
			const totalCalories = ItemCtrl.getTotalCalories();

			// Show total Calories
			UICtrl.showTotalCalories(totalCalories);

			// Store in ls
			StorageCtrl.storeItem(newItem);

			// Clear fields
			UICtrl.clearInput();
		}

		e.preventDefault();
	};

	// Click edit item
	const editItemClick = function(e) {
		if (e.target.classList.contains('edit-item')) {
			// Get html id
			const itemID = e.target.parentNode.parentNode.id;
			// Break into array
			const itemIDArray = itemID.split('-');
			// Get only the id number
			const itemIDNum = parseInt(itemIDArray[1]);
			// Get item
			const itemToEdit = ItemCtrl.getItemById(itemIDNum);

			// Set current Item
			ItemCtrl.setCurrentItem(itemToEdit);

			// Add item to form
			UICtrl.addItemToForm();
		}
		e.preventDefault();
	};

	// Update item submit
	const itemUpdateSubmit = function(e) {
		// Get item input
		const input = UICtrl.getItemInput();

		// Update item
		const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

		// Update in UI
		UICtrl.updateListItem(updatedItem);

		// Get total calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Show total Calories
		UICtrl.showTotalCalories(totalCalories);
		// Update ls
		StorageCtrl.updateItemStorage(updatedItem);

		UICtrl.clearEditState();

		e.preventDefault();
	};

	const itemDeleteSubmit = function(e) {
		// Get the current Item
		const currentItem = ItemCtrl.getCurrentItem();

		// Delete from data structure
		ItemCtrl.deleteItem(currentItem.id);

		// Delete from ls
		StorageCtrl.deleteItemStorage(currentItem.id);

		// Delete from UI
		UICtrl.deleteListItem(currentItem.id);

		// Get total calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Show total Calories
		UICtrl.showTotalCalories(totalCalories);

		// Clear update state
		UICtrl.clearEditState();

		e.preventDefault();
	};

	// Clear items event
	const clearAllItemsClick = function(e) {
		// Clear items from data structure
		ItemCtrl.clearAllItems();

		// Clear items from ls
		StorageCtrl.clearItemStorage();

		// Remove from UI
		UICtrl.removeItems();

		// Hide ul
		UICtrl.hideList();

		// Get total calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Show total Calories
		UICtrl.showTotalCalories(totalCalories);

		e.preventDefault();
	};

	// Public Methods
	return {
		init: function() {
			// Clear init state / set initial state
			UICtrl.clearEditState();

			// Fetch items from data structure
			const items = ItemCtrl.getItems();

			// Check number of items
			if (items.length === 0) {
				UICtrl.hideList();
			} else {
				// Populate Item List
				UICtrl.populateItemList(items);
			}

			// Get total calories
			const totalCalories = ItemCtrl.getTotalCalories();

			// Show total Calories
			UICtrl.showTotalCalories(totalCalories);

			// Load event listeners
			loadEventListeners();
		}
	};
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
