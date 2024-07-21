import { signUp } from '../service/userService.js';
import { navigateToHome } from '../utilities/routerFunctions.js';

export default {
    watch: {
        '$route'(to, from) {
            this.loadPageData();
        }
    },
    methods : {
        loadPageData() {

            const button = document.getElementById('submitButton');
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
        
                try {
                    const data = await signUp(username, email, password);
                    navigateToHome();
                }
                catch (error) {
                    const p = document.getElementById('errorText');
                    p.style.color = "red";
        
                    const container = document.getElementById('container');
                    container.style.height = '240px';
        
                    if(!error.response) {
                        p.innerText = "An unknown error occured";
                    }
                    else {
                        switch(error.response.status){
                            case(409):
                                p.innerText = "Invalid username or email or username/email already in use";
                                break;
                            default:
                                p.innerText = "unknown error";
                                break;
                        }
                    }
                }
            });
        },
    },
    mounted() {
        this.loadPageData();
    }
}