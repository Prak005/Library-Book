const myLibrary = [];
class Book {
    constructor(title, author, genre, read = false){
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.read = Boolean(read);
    }
    toggleRead(){
        this.read = !this.read;
    }
}

const bookList = document.querySelector("#book-list");
const newBookBtn = document.querySelector("#new-book-btn");
const bookDialog = document.querySelector("#book-dialog");
const bookForm = document.querySelector("#book-form");
const cancelBtn = document.querySelector("#cancel-btn");

function renderBooks() {
    bookList.innerHTML = "";
    myLibrary.forEach(book => {
        const card = createCardForBook(book);
        bookList.appendChild(card);
    });
}

function createCardForBook(book) {
    const card = document.createElement("article");
    card.className = "book-card";
    card.dataset.bookId = book.id;

    const title = document.createElement("div");
    title.className = "book-title";
    title.textContent = book.title;
    
    const author = document.createElement("div");
    author.className = "book-author";
    author.textContent = book.author;

    const genre = document.createElement("div");
    genre.className = "book-genre";
    genre.textContent = book.genre;

    const controls = document.createElement("div");
    controls.className = "controls";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn btn-toggle";
    toggleBtn.type = "button";
    toggleBtn.textContent = book.read ? "Read" : "Not Read";
    if(book.read)
        toggleBtn.classList.add("btn-read");

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    controls.appendChild(toggleBtn);
    controls.appendChild(deleteBtn);

    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(genre);
    card.appendChild(controls);

    toggleBtn.addEventListener("click", () => {
        const b = myLibrary.find(x => x.id === book.id);
        if(!b) return;
        b.toggleRead();
        toggleBtn.textContent = b.read ? "Read" : "Not Read";
        toggleBtn.classList.toggle("btn-read", b.read);
    });
    deleteBtn.addEventListener("click", () => {
        const index = myLibrary.findIndex(x => x.id === book.id);
        if(index !== -1)
            myLibrary.splice(index, 1);
        card.remove();
    });
    return card;
}

function addBook({title, author, genre, read=false}) {
    const book = new Book(title, author, genre, read);
    myLibrary.push(book);
    const card = createCardForBook(book);
    bookList.appendChild(card);
}

newBookBtn.addEventListener("click", () => {
    if( typeof bookDialog.showModal === "function")
        bookDialog.showModal();
    else
        bookDialog.setAttribute("open", "");
});

cancelBtn.addEventListener("click", () => {
    if(typeof bookDialog.close === "function")
        bookDialog.close();
    else
        bookDialog.removeAttribute("open");
});

bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(bookForm);
    const title = formData.get("title")?.toString().trim();
    const author = formData.get("author")?.toString().trim();
    const genre = formData.get("genre")?.toString().trim();
    const read = formData.get("read") === "on" || formData.get("read") === "true";
    if(!title || !author || !genre){
        alert("Required");
        return;
    }
    addBook({title, author, genre, read});
    bookForm.reset();
    bookDialog.close();
});
function seedSampleBooks(){
    addBook({title: "A Study in Scarlet", author: "Authur Conan Doyle", genre: "Mystery, Thriller", read: true});
}
document.addEventListener("DOMContentLoaded", () => {
    seedSampleBooks();
});