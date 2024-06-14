let username;
let password;

// Kontzertuak ez badaude kargatuta LocalStorage-n
if(localStorage.getItem("concerts") == null){
        concerts = [];
            localStorage.setItem("concerts", JSON.stringify(concerts_json));
    }


// Login-a egin, erabiltzailearen arabera Admin edo panel normalera joan
async function login(){
    username = document.querySelector("#username").value;
    password = document.querySelector("#password").value;
    
    await fetch('accounts/accounts.json').then(response => response.json()).then(json_response => accounts_json = json_response);
    
    if(localStorage.getItem("concerts").length == 0 ){
        await fetch('concerts/concerts.json').then(response => response.json()).then(json_response => concerts_json = json_response);
        localStorage.setItem("concerts", JSON.stringify(concerts_json));
    }
    
    
    let sartu = 0;
    for(i = 0; i < accounts_json.length; i++){
        let obj = accounts_json[i];
        if(username == obj.username && password == obj.password){
            sartu = 1;
            console.log('Erabiltzailea eta pasahitza zuzenak dira');
            if (username == "admin"){
                window.location.href = 'prod_taula_admin.html';
                localStorage.setItem("username", "admin");
            }else{
                window.location.href = 'prod_taula.html';
                localStorage.setItem("username", username);
            }
        }
    }
    
    if(sartu == 0){
        alert("Erabiltzailea edo pasahitza ez dira zuzenak!!");
    }
}

// Begiratu Entre tekla sakatu den
function check_enter(event){
    if(event.keyCode == 13){
        login();
    }
}


// LocalStorage-n dagoen informazio guztia borratu
function bukatuSaioa(){
    //signOut();
    localStorage.removeItem("username");
    localStorage.removeItem("buying");
    localStorage.removeItem("account");
    localStorage.removeItem("info");
    window.location.href = 'index.html';
    
}


// Produktua kargatu eta taula sortu
function create_events_list(){
    let concerts = JSON.parse(localStorage.getItem("concerts"));
    
    let head_concerts = "<thead><th>Artist</th><th>City</th><th>Location</th><th>Date</th><td colspan='5'><hr/></td></thead>";
    
    let table_contents = "";
    
    for(i = 0; i < concerts.length; i++){
        table_contents = table_contents + "<tr><td>" + concerts[i].artist + "</td><td>" + concerts[i].city + "</td><td>"+ concerts[i].location + "</td><td>" + concerts[i].date + "</td><td><button class='btn btn-info' onclick='buy_tickets("+concerts[i].id+")'><i class='bi bi-bag-fill'></i> Info</button></td></tr>";
    }
    
    document.querySelector("#events_list").innerHTML = head_concerts + table_contents;
    
}


// Produktuak kargatu eta taula sortu ADMIN
function create_events_list_admin(){
    let concerts = JSON.parse(localStorage.getItem("concerts"));
    
    let head_concerts = "<thead><th>Artist</th><th>City</th><th>Location</th><th>Date</th><td colspan='5'><hr/></td></thead>";
    
    let table_contents = "";
    
    for(i = 0; i < concerts.length; i++){
        table_contents = table_contents + "<tr><td>" + concerts[i].artist + "</td><td>" + concerts[i].city + "</td><td>"+ concerts[i].location + "</td><td>" + concerts[i].date + "</td><td><button class='btn btn-success' onclick='buy_tickets("+concerts[i].id+")'><i class='bi bi-eye'></i> Info</button></td><td><button class='btn btn-info' onclick='update("+concerts[i].id+")'><i class='bi bi-pencil-square'></i></i> Edit</button></td><td><button class='btn btn-danger' onclick='borratu("+concerts[i].id+")'><i class='bi bi-trash'></i> Delete</button></td></tr>";
    }
    
    document.querySelector("#events_list").innerHTML = head_concerts + table_contents;
    
}


// Gehitu produktu bat LocalStorage-era
function gehitu(){
    let productname, manufacturername, tokia, data, productdesc, irudia, prezioa = "";
    
    
    let products = JSON.parse(localStorage.getItem("concerts"));
    
    productname = document.querySelector("#productname").value;
    manufacturername = document.querySelector("#manufacturername").value;
    data = document.querySelector("#data").value;
    prezioa = document.querySelector("#price").value;
    productdesc = document.querySelector("#productdesc").value;
    file = document.querySelector("#files").files[0].name;
    
    
    let product = {
        "artist" : productname,
        "city" : manufacturername,
        "location" : "tokia",
        "data" : data,
        "description" : productdesc,
        "image_url" : file,
        "price" : prezioa
    }
    
    products.push(product);
    
    localStorage.setItem("concerts", JSON.stringify(products));
    
    window.location.href = "prod_taula_admin.html";
}

// Borratu produktu bat LocalStorage-etik
function borratu(id){
    let found = 0;
    let products = JSON.parse(localStorage.getItem("concerts"));
    for (i = 0; i < products.length; i++){
        if (products[i].id == id){
            found = 1
            if (i == products.length -1){
                products.pop();
            } else if (found == 1){
                products[i] = products[i+1];
            }
        }else{
            if (found == 1){
                 if (i == products.length -1){
                    products.pop();
                 } else {
                     products[i] = products[i+1];
                 }
            }
        }
       
        
    }
    localStorage.setItem("concerts", JSON.stringify(products));
    toastr.success('Produktua borratu da.');
    create_events_list_admin();
}


// Erosketa orrialdera joan
function buy_tickets(id){
    localStorage.setItem("info", id);
    window.location.href = "prod_eza.html";
}


// Erosi nahi den produktuaren deskripzio orria kargatu
function fill_event_info(){
    let event = JSON.parse(localStorage.getItem("concerts"));
    let id = localStorage.getItem("info");
    let artist = event[id].artist;
    let city = event[id].city;
    let location = event[id].location;
    let date = event[id].date;    
    let description = event[id].description;

    
    document.querySelector("#info").innerHTML = " <h3>Product information</h3><ul><li><strong>Category</strong>: "+ artist+"</li><li><strong>Client</strong>: "+ city +" </li><li><strong>Project date</strong>:" + date + "</li> <li><strong>Project URL</strong>:" + location+"</li</ul>";

     document.querySelector("#description").innerHTML = "<h3>Product description</h3><p class='pt-2'>"+ description+"</p>";
    
    document.querySelector("#buy_product").innerHTML = "<button onclick=add2Cart("+id+") type='button' class='btn btn-light m-1'><span class='glyphicon glyphicon-shopping-cart'></span> Add to Cart </button><button class='btn btn-warning m-1' onclick='buy("+id+")'><i class='bi bi-cart'></i></button>";
}


// Gehitu produktua Saskira
function add2Cart(id){
   let canti =  parseInt(document.querySelector("#canti").value);
    
     if(localStorage.getItem("buying") == null){
         
            let buying = []
            localStorage.setItem("buying", JSON.stringify(buying));
    }
    
    let found = 0;
    buying = JSON.parse(localStorage.getItem("buying"));
    for(i = 0; i < buying.length; i++){
        if(buying[i].id == id){
            buying[i].cant += canti;
            found = 1;
        }
    }
    if(found == 0){
       let product = { "id" : id,
                "cant": canti};
        buying.push(product);
    }
    localStorage.setItem("buying", JSON.stringify(buying));
    toastr.success('Produktua sakira sartu da.');

    //alert("The Product has been added to cart");
    
}

// Ordainketa atalera joan
function buy(id){
    window.location.href = "payment.html";
}

// Inprimatu tiketa, borratu erosketa informazioa
function go2print(){
    localStorage.removeItem("cant");
    localStorage.removeItem("info");
    localStorage.removeItem("buying");
    window.location.href = "print.html";
}

// Inprimatu pantaila kargatu
function bete_print(){
    let username = localStorage.getItem("username");
        document.querySelector("#user").innerHTML = username;

}

// Orainketa orrialdea bete
function fill_payment_cards1(){
    let buying = JSON.parse(localStorage.getItem("buying"));
    let concerts = JSON.parse(localStorage.getItem("concerts"));
    
    let html_zatia = "";
    
    if(buying == null){
        document.querySelector("#items").innerHTML = "0 Produktu";
    }else{
        document.querySelector("#items").innerHTML = buying.length + " Produktu";


        
        let total = 0;
        for(i= 0; i < buying.length; i++){
            for (j = 0; j < concerts.length; j++){
                if (buying[i].id == concerts[j].id){
                     html_zatia += "<div class='row border-top border-bottom'><div class='row main align-items-center'><div class='col-2'><img class='img-fluid' src='" + concerts[j].img_URL + "'></div><div class='col'><div class='row text-muted'>"+concerts[j].city+"</div><div class='row'>"+concerts[j].artist+"</div></div><div class='col'><a href='#'>-</a><a href='#' class='border'>"+buying[i].cant+"</a><a href='#'>+</a></div><div class='col'> "+ buying[i].cant * concerts[j].price+" &euro; <span class='close'> &#10005;</span></div></div></div>";
                    
                    total += buying[i].cant * concerts[j].price;
                }
            }
        }

        document.querySelector("#fill_cards").innerHTML = document.querySelector("#fill_cards").innerHTML + html_zatia + "<div class='back-to-shop'><a href='prod_taula.html'>&leftarrow;</a><span class='text-muted'>Back to shop</span></div>";
        document.querySelector("#price").innerHTML = total +  "&euro;";
        document.querySelector("#totalPrice").innerHTML = total + 5 + "&euro;";
    }
     
    
    
    
}



