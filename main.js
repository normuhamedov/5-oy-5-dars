const input = document.getElementById("itemInput");
const addButton = document.getElementById("addButton");
const itemList = document.getElementById("itemList");
const filterButtons = document.querySelectorAll("button[data-filter]");

let items = JSON.parse(localStorage.getItem("items")) || [];
let editIndex = null;

function saveItems() {
    localStorage.setItem("items", JSON.stringify(items));   
}

function addItem() {
    const value = input.value.trim();
    if (value) {
        if (editIndex !== null) {
            items[editIndex].text = value;
            editIndex = null;
            addButton.textContent = "Create";
        } else {
            items.push({ text: value, completed: false });
        }
        input.value = "";
        saveItems();
        renderItems();
    }
}

function toggleCompletion(index) {
    items[index].completed = !items[index].completed;
    saveItems();
    renderItems();
}

function deleteItem(index) {
    items.splice(index, 1);
    saveItems();
    renderItems();
}

function editItem(index) {
    input.value = items[index].text;
    editIndex = index;
    addButton.textContent = "Update";
}

function renderItems(filter = "all") {
    itemList.innerHTML = "";
    items.forEach((item, index) => {
        if (filter === "completed" && !item.completed) return;
        if (filter === "uncompleted" && item.completed) return;

        const li = document.createElement("li");
        li.className = "flex justify-between items-center bg-gray-100 rounded px-4 py-2";

        li.innerHTML = `
            <span class="${item.completed ? 'line-through text-gray-400' : ''}">${index + 1}. ${item.text}</span>
            <div class="flex items-center gap-2">
                <input type="checkbox" ${item.completed ? 'checked' : ''} onclick="toggleCompletion(${index})"/>
                <button class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600" onclick="editItem(${index})">Edit</button>
                <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onclick="deleteItem(${index})">Delete</button>
            </div>
        `;
        itemList.appendChild(li);
    });
    updateFilterCounts();
}

function updateFilterCounts() {
    const allCount = items.length;
    const completedCount = items.filter(item => item.completed).length;
    const uncompletedCount = allCount - completedCount;

    document.querySelector("button[data-filter='all']").innerText = `All (${allCount})`;
    document.querySelector("button[data-filter='completed']").innerText = `Completed (${completedCount})`;
    document.querySelector("button[data-filter='uncompleted']").innerText = `UnCompleted (${uncompletedCount})`;
}

addButton.addEventListener("click", addItem);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addItem();
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");
        renderItems(filter);
    });
});

renderItems();
