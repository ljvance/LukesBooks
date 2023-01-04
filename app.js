const booksList = document.getElementById('booksList');
const searchBar = document.getElementById('searchBar');
const cbtn = document.querySelector('#carts');
const pbtn = document.querySelector('#profile');
const cartItems = document.querySelector('.carti');
const proOverlay = document.querySelector('.profile-overlay');
const closecbtn = document.querySelector('.close-cart');
const closepbtn = document.querySelector('.close-profile');
const closeOrder = document.querySelector('.close-order');
const cartOverlay = document.querySelector('.cart-overlay');
const clearcbtn = document.querySelector('.clear-cart');
const placeobtn = document.querySelector('.place-order');
const orderOverlay = document.querySelector('.order-overlay');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const thisOrder = document.getElementById('place');
const hideTitles = document.querySelector('.allBookTitles');

let cart = [];
let allbooks = [];


class Products{
    async getProducts(){
        try {
            let result = await fetch('products.json');
            
            let data = await result.json();
            
            let products = data.items;
           
            products = products.map(item =>{
                const {title, price} = item.fields;
                //const id = item.sys.id;
                const id = item.sys.id;
                const image =item.fields.image.fields.file.url;
                return {title, price, id, image}

            })
            allbooks = products;
            return products;
        } catch (error) {
            console.log(error);
        }
    }

}

class UI{

   displayMain(){
       let products = JSON.parse(localStorage.getItem('products'));
       products.forEach(item =>{
           const article = document.createElement('article'); 
           article.classList.add('product');   
           article.innerHTML = `
            <li class="book">
                <h2>${item.title}</h2>
                <p>Price: $${item.price}</p>
                <img src="${item.image}">                
                <button class="bag-btn" data-id="${item.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
            </li>
        `;
           booksList.appendChild(article);

       });
   }

   showCart(){
     cartOverlay.classList.add('whatever');
   }

   showProfile(){
     proOverlay.classList.add('whatever');
   }

   hideCart(){
     cartOverlay.classList.remove('whatever');
   }

   hideProfile(){
     proOverlay.classList.remove('whatever');
   }

   showOrder(){
     orderOverlay.classList.add('whatever');
   }

   hideOrder() {
    orderOverlay.classList.remove('whatever');
  }

    //code for the functionality of the buttons
   getBagButtons(){
     const btns = document.querySelectorAll('.bag-btn');
     btns.forEach(element =>{  //element is a variable for EACH BUTTON
        //console.log(element)
        let id = element.dataset.id;
        let inCart = cart.find(item => item.id ===id);
        if(inCart){
          element.innerText ="In Cart";
          element.disabled = true;
        }
        element.addEventListener('click', (event)=>{
          event.target.innerText = "In Cart";
          event.target.disabled = true;
          let cartItem = {...Storage.getProduct(id), amount: 1};   
          cart = [...cart, cartItem]; //...cart means everything we had in cart
          Storage.saveCart(cart);
          this.setCartValues(cart);
          this.addCartItem(cartItem)
        })
     })
   }
   //Code for the addition of a book to the shopping cart overlay
   addCartItem(book){
     const div = document.createElement('div');
     div.classList.add('cartele');
     div.innerHTML = `
                    <img src=${book.image}>
                    <div>
                    <h4>${book.title}</h4>
                    <h5>$${book.price}</h5> 
                    <span class="remove-item" data-id =${book.id}>remove</span>
                    </div>
                    <div>
                    <i class="fas fa-chevron-up" data-id =${book.id}></i>
                    <p class="item-amount">${1}</p>
                    <i class="fas fa-chevron-down" data-id =${book.id}></i>
                    </div>
     `;
     cartContent.appendChild(div);
   }

   setCartValues(cart){
     let tempTotal = 0;
     let itemsTotal =0;
     cart.forEach(item =>{
       tempTotal += item.price* item.amount;
       itemsTotal += item.amount;
     })
     cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
     cartItems.innerText = itemsTotal;
   }

  //code for parts of the cart's contents.
  //Up/Down chevron for adding multiple books
   cartLogic(){
     const btns = document.querySelectorAll('.bag-btn');
     clearcbtn.addEventListener('click', ()=>{
       cart =[];
       Storage.saveCart(cart);
       this.setCartValues(cart);
       btns.forEach(element =>{
         element.innerHTML = `<i class="fas fa-shopping-cart"></i>
               Add to Cart`;
         element.disabled = false;
       });
       while(cartContent.children.length > 0){
         //console.log(cartContent.children[0])
         cartContent.removeChild(cartContent.children[0]);
       }
     });
     cartContent.addEventListener('click', (event)=>{
       if(event.target.classList.contains('remove-item')){
         let removeItem = event.target;
         let id = removeItem.dataset.id;
         this.removeItem(id);
         cartContent.removeChild(removeItem.parentElement.parentElement);
       }
       if(event.target.classList.contains('fa-chevron-up')){
         let addAmount = event.target;
         let id = addAmount.dataset.id;
         let tempItem = cart.find(item => item.id === id);
         tempItem.amount ++;
         Storage.saveCart(cart);
         this.setCartValues(cart);
         addAmount.nextElementSibling.innerText = tempItem.amount;
       }

       if(event.target.classList.contains('fa-chevron-down')){
         let subAmount = event.target;
         let id = subAmount.dataset.id;
         let tempItem = cart.find(item => item.id === id);
         tempItem.amount --;
         if(tempItem.amount > 0){
          Storage.saveCart(cart);
           this.setCartValues(cart);
           subAmount.previousElementSibling.innerText = tempItem.amount;
         }else{
           cartContent.removeChild(subAmount.parentElement.parentElement);
           this.removeItem(id);
         }
       }


     });
   }

   removeItem(id){
     cart = cart.filter(item => item.id !== id);
     this.setCartValues(cart);
     Storage.saveCart(cart);
     let button = this.getSingleBtn(id);
     button.disabled = false;
     button.innerHTML =`<i class="fas fa-shopping-cart"></i>
               Add to Cart`;
   }

   getSingleBtn(id){
     const btns = document.querySelectorAll('.bag-btn');
     let button;
     btns.forEach(element =>{
       if(element.dataset.id === id){
         button = element;
       }
     });
     return button;
   }

   setupApp(){
     cart = Storage.getCart();
     this.setCartValues(cart);
     cart.forEach(item => this.addCartItem(item));
     cbtn.addEventListener('click', this.showCart);
     closecbtn.addEventListener('click', this.hideCart);
     pbtn.addEventListener('click', this.showProfile);
     closepbtn.addEventListener('click', this.hideProfile);
     placeobtn.addEventListener('click', this.showOrder);
     closeOrder.addEventListener('click', this.hideOrder);
   }

}

class Storage{ 
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id){ 
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find( product=> product.id === id);
    }

    static saveCart(cart){
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getCart(){
      return localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')) : [];
    }

}

async function loadBooks (){
    try {
        const res = await fetch('products.json');
        bookProds = await res.json();
        let books = bookProds.items;
        displayBooks(books);
    } catch (err) {
        console.error(err);
    }
};

// Function for returning the results of the search bar
function searchres(filteredprods){
  console.log(filteredprods);
  const ui = new UI();  
  while(booksList.firstChild){
        booksList.removeChild(booksList.firstChild);
      }
  const htmlString = filteredprods.forEach(item =>{
           const article = document.createElement('article'); //in HTML, <article>  </article>
           article.innerHTML = `
            <li class="book">
                <h2>${item.title}</h2>
                <p>Price: $${item.price}</p>
                <img src="${item.image}">                
                <button class="bag-btn" data-id="${item.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
            </li>
        `;
           booksList.appendChild(article);

       });
      ui.getBagButtons();
       }
function displayBooks(books) {
    libooks.map((book) => {
            return `
            <li class="book">
                <h2>${book.title}</h2>
                <p>Price: $${book.price}</p>
                <img src="${book.image}">                
                <button class="bag-btn" data-id="1">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
            </li>
        `;
        }).join('');
    booksList.innerHTML = htmlString;
};

searchBar.addEventListener('keyup', (e)=>{
  if(e.keyCode === 13){
    var searchString = e.target.value;
    searchString = searchString.toLowerCase();
    //console.log(searchString)
    const filteredBooks = allbooks.filter((book)=>{
      return book.title.toLowerCase().includes(searchString) || (book.price <= parseInt(searchString))
    })
    searchres(filteredBooks);
  }
});

document.addEventListener("DOMContentLoaded", ()=>{ //everything starts here
    const ui = new UI();
    const products = new Products();
    //setup the APP
     
    products.getProducts().then(products => Storage.saveProducts(products)); 
    //console.log(localStorage.getItem('products'));
    ui.displayMain();
    ui.setupApp();
    ui.getBagButtons();
    ui.cartLogic();
    
});

thisOrder.addEventListener('click', () =>{
  let hideTotals = document.querySelector('.totalprice');
  var cart = Storage.getCart();
  var itemTitles = [];
  console.log(itemTitles);
  cart.forEach(item => {
    itemTitles.push(item.title);
  })

  

  hideTotals.value = cartTotal.innerHTML;
  hideTitles.value = itemTitles;
  console.log(hideTotals);
  
})


