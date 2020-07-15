const axios = require('axios').default;

class User{
    constructor() {
        this.name = document.getElementById('txtName');
        this.email = document.getElementById('txtEmail');
        this.age = document.getElementById('txtAge');
        this.phone = document.getElementById('txtPhone');
        this.btnRegisterUser = document.getElementById('btnRegister');

        this.getUsers();
        this.events();
    }

    events() {
        this.btnRegisterUser.onclick = (event) => this.userValidate(event);
    }

    getUsers(){
        axios.get(`http://localhost:4000/users`)
            .then((response) => {
               this.recoveryUser(response.data.users)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    recoveryUser(data) {
        for(user of data) {
            const html = this.layoutUser(user.name, user.email, user.age, user.phone, user.id);
            document.getElementById('usersBoard').innerHTML += html;
        }
        
        document.querySelectorAll('.deleteUser').forEach(button => {
            button.onclick = event => this.deleteUser(button.id);
        })

        document.querySelectorAll('.getUser').forEach(button => {
            button.onclick = event => this.getUserModal(button.id);
        }) 
    }

    layoutUser(name, email, age, phone,id) {
        return `
             <div class="col mt-5">
                 <div class="card">
                    <div class="userBody">
                         <h5 class="userName">${name}</h5>
                         <p class="userEmail">${email}</p>
                         <p class="userAge">${age}</p>
                         <p class="userPhone">${phone}</p>
                         <button type="button" class="btn btn-danger deleteUser" id="${id}">Excluir</button>
                         <button type="button" class="btn btn-outline-primary getUser" id="${id}" data-toggle="modal" data-target="#exampleModalEdit">Editar</button>
                    </div>
                    
                 </div>
             </div>
        `; 
    }

    userValidate(event) {
        event.preventDefault();
        if(this.name.value && this.email.value && this.age.value && this.phone.value){
            const user = {
                name: this.name.value,
                email: this.email.value,
                age: this.age.value,
                phone: this.phone.value
            }
            this.createUser(user);
        } else {
            alert('preencha todos os dados');
        }
    }

    insertHtml(html) {
        document.getElementById('usersBoard').innerHTML += html;
    }

    createUser(user) {
        axios.post(`http://localhost:4000/users`, user)
        .then((response) => {
            const html = this.layoutUser(user.name, user.email, user.age, user.phone);
            this.insertHtml(html);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    deleteUser(id) {
        axios.delete(`http://localhost:4000/users/${id}`)
        .then((result) => {
            alert(result.data.result)
        })
        .catch((error) => {
            console.log(error)
        })
    } 

    getUserModal(id) {
        axios.get(`http://localhost:4000/users/${id}`)
        .then((response) => {
            
            document.getElementById('txtNameModal').value = response.data.user[0].name;
            document.getElementById('txtAgeModal').value = response.data.user[0].age;
            document.getElementById('txtPhoneModal').value = response.data.user[0].phone;
            document.getElementById('txtEmailModal').value = response.data.user[0].email;
            console.log(response.data);          
        })
        .catch((error) => {
            console.log(error); 
        })
    }

}

new User(); 