import { login } from '../service/userService.js';

export default {

    mounted() {
        const button = document.getElementById('submitButton');
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            login(username, password)
            .then(data => {
                window.location.href='/users/ayach';
            })
            .catch(error => {
                const p = document.getElementById('errorText');
                p.style.color = "red";
                console.log(error);
                
                if(!error.resposne) {
                    p.innerText = "An unknown error occured";
                    console.log(error);
                }
                else {
                    switch(error.response.status){
                        case(404):
                            p.innerText = "User with the given username/email not found";
                            break;
                        case(409):
                            p.innerText = "Invalid username or password";
                            break;
                        case(401):
                            p.innerText = "Invalid username or password";
                            break;
                        default:
                            p.innerText = "unknown error";
                            break;
                    }
                }
            }); 
        });
    
    }
}
