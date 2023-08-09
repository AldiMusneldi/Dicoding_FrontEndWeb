const BELUMDIBACA_ID = 'BelumDibaca';
const SUDAHDIBACA_ID = 'SudahDibaca';
const BUKU_ID = "BukuId";

function addBook() {

    const inputJudulBuku = document.getElementById("inputJudulBuku").value;
    const inputPenulisBuku = document.getElementById("inputPenulisBuku").value;
    const inputTahunTerbit = document.getElementById("inputTahunTerbit").value;
    const inputDibaca = document.getElementById("SelesaiDibaca").checked;

    const book = inputBook(inputJudulBuku, inputPenulisBuku, inputTahunTerbit, inputDibaca);
    const bookObject = composeBookObject(inputJudulBuku, inputPenulisBuku, inputTahunTerbit, inputDibaca);
  
    book[BUKU_ID] = bookObject.id;
    books.push(bookObject);

    if(inputDibaca){
        document.getElementById(SUDAHDIBACA_ID).append(book);
    } else {
        document.getElementById(BELUMDIBACA_ID).append(book);
    }
    updateDataToStorage();
}

function inputBook(inputJudul, inputPenulis, inputTahun, inputDibaca){
 
    const judulBuku = document.createElement('h3');
    judulBuku.classList.add('book-title');
    judulBuku.innerText = inputJudul;
   
    const penulisBuku = document.createElement('p');
    penulisBuku.classList.add('book-details');
    penulisBuku.innerText = inputPenulis;

    const tahunBuku = document.createElement('p');
    tahunBuku.classList.add('book-details');
    tahunBuku.innerText = inputTahun;
  
    const buttons = document.createElement('div');
    buttons.classList.add('book-buttons');
    buttons.append(aquaButton(inputDibaca));
    buttons.append(toscaButton());
    buttons.append(redButton());

    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book-card');
    bookContainer.append(judulBuku, penulisBuku, tahunBuku, buttons);

    return bookContainer;
};

function createButton(buttonType, buttonText, eventListener){

    const button = document.createElement("button");
    button.innerText = buttonText;
    button.classList.add(buttonType);
    button.addEventListener("click", function (event) {
        eventListener(event); 
    });
    return button;
}

function aquaButton(status) {
    return createButton('aqua-button', (status ? 'Belum Selesai' : 'Selesai'), function(event) {
        if(status) {
            undoBookFromCompleted(event.target.parentElement.parentElement);
        } else {
            addBookToCompleted(event.target.parentElement.parentElement);
    }
    });
}

function toscaButton() {
    return createButton('tosca-button', 'Edit', function(event) {
        editBook(event.target.parentElement.parentElement);
    });
}

function redButton() {
    return createButton('red-button', 'Hapus', function(event) {
        removeBook(event.target.parentElement.parentElement);
    });
}

function addBookToCompleted(taskElement) {
    const book = findBook(taskElement[BUKU_ID]);
    book.isCompleted = true;

    const newBook = inputBook(book.judul, book.penulis, book.tahun, inputDibaca=true);
    newBook[BUKU_ID] = book.id;

    const bookCompleted = document.getElementById(SUDAHDIBACA_ID);
    bookCompleted.append(newBook);

    taskElement.remove();
    updateDataToStorage();
}

function editBook(taskElement) {
    const edit = document.querySelector('.edit-section');
    edit.removeAttribute("hidden");

    const book = findBook(taskElement[BUKU_ID]);

    const ubahJudulBuku = document.getElementById("ubahJudulBuku");
    ubahJudulBuku.value = book.judul;
    const ubahPenulisBuku = document.getElementById("ubahPenulisBuku");
    ubahPenulisBuku.value = book.penulis;
    const ubahTahunTerbit = document.getElementById("ubahTahunTerbit");
    ubahTahunTerbit.value = book.tahun;
    const ubahYangDibaca = document.getElementById("ubahYangDibaca");
    ubahYangDibaca.checked = book.isCompleted;

    const editDataSubmit = document.getElementById('editDataSubmit');
    editDataSubmit.addEventListener('click', function(event) {

        updateEditBook(ubahJudulBuku.value, ubahPenulisBuku.value, ubahTahunTerbit.value, ubahYangDibaca.checked, book.id);

        const edit = document.querySelector('.edit-section');
        edit.setAttribute("hidden", '');
    });
}

function updateEditBook(judul, penulis, tahun, dibaca, id) {

    const bookStorage = JSON.parse(localStorage[KUNCI_PENYIMPANAN]);
    const bookIndex = findBookIndex(id);

    bookStorage[bookIndex] = {
        id: id,
        judul: judul,
        penulis: penulis,
        tahun: tahun,
        isCompleted: dibaca
    };

    const parsed = JSON.stringify(bookStorage);
    localStorage.setItem(KUNCI_PENYIMPANAN, parsed);

    location.reload(true);
}

function removeBook(taskElement) {
    const hapus = confirm('Apakah anda yakin menghapus riwayat ini?');
    if(hapus) {

        const bookPosition = findBookIndex(taskElement[BUKU_ID]);
        books.splice(bookPosition, 1);

        taskElement.remove();
        updateDataToStorage();
    }
}

function undoBookFromCompleted(taskElement){
    const book = findBook(taskElement[BUKU_ID]);
    book.isCompleted = false;

    const newBook = inputBook(book.judul, book.penulis, book.tahun, book.isCompleted);
    newBook[BUKU_ID] = book.id;

    const uncompletedRead = document.getElementById(BELUMDIBACA_ID);
    uncompletedRead.append(newBook);

    taskElement.remove();
    updateDataToStorage();
}

function searchBook(keyword) {
    const bookList = document.querySelectorAll('.book-card');
    for(let book of bookList){
        const judul = book.childNodes[0];
        if(!judul.innerText.toLowerCase().includes(keyword)){
            judul.parentElement.style.display = 'none';
        } else {
            judul.parentElement.style.display = '';
        }
    }
}

const KUNCI_PENYIMPANAN = "DataAplikasiBookshelf";
 
let books = [];

function isStorageExist() {
   if(typeof(Storage) === undefined){
       alert("Browser tidak mendukung local storage");
       return false;
   }
   return true;
}
 
function saveData() {
   const parsed = JSON.stringify(books);
   localStorage.setItem(KUNCI_PENYIMPANAN, parsed);
   document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
   const serializedData = localStorage.getItem(KUNCI_PENYIMPANAN);
   
   let data = JSON.parse(serializedData);
   
   if(data !== null)
       books = data;
 
   document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
   if(isStorageExist())
       saveData();
}

function composeBookObject(judul, penulis, tahun, isCompleted) {
   return {
       id: +new Date(),
       judul,
       penulis,
       tahun,
       isCompleted
   };
}

function findBook(bookId) {
   for(book of books){
       if(book.id === bookId)
           return book;
   }
   return null;
}
 
function findBookIndex(bookId) {
   let index = 0;
   for (book of books) {
       if(book.id === bookId)
           return index;
           
       index++;
   }
 
   return -1;
}

function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(BELUMDIBACA_ID);
    let listCompleted = document.getElementById(SUDAHDIBACA_ID);
  
    for(book of books){
        const newBook = inputBook(book.judul, book.penulis, book.tahun, book.isCompleted);
        newBook[BUKU_ID] = book.id;
  
        if(book.isCompleted){ listCompleted.append(newBook);} 
        else { listUncompleted.append(newBook); }
    }
 }

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('input-buku');
    submitForm.addEventListener('submit', function(){
        addBook();
    });

    const tutupForm = document.getElementById('tutupForm');
    tutupForm.addEventListener('click', function() {
        const edit = document.querySelector('.edit-section');
        edit.setAttribute("hidden", '');
    })

    const searchButton = document.getElementById('search');
    searchButton.addEventListener('click', function(){
        const keyword = document.getElementById('inputsearchBook').value;
        searchBook(keyword.toLowerCase());
    });

    if(isStorageExist()){ loadDataFromStorage() }
    
});

document.addEventListener("ondatasaved", () => {
    console.log("Data disimpan.");
});
document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});