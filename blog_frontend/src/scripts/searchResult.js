import { getBlogByTitle } from "../service/blogService";
import { getUsers } from "../service/userService";
import { loadBlogs, setUpBlogsDiv } from "../utilities/loadBlogs";
import { navigateToHome } from "../utilities/routerFunctions.js";
import { loadUsers, setUpUsersDiv } from "../utilities/loadUsers.js";

export default {
    watch : {
        '$route'(to, from) {
            this.loadPageData();
        }
    },
    methods : {
        async loadPageData() {

            const titleOrUsername = decodeURI(this.$route.params.title);
            const body = document.getElementById("body");
            const returnHomeButton = document.createElement("button");
            returnHomeButton.innerText = "home";
            
            returnHomeButton.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToHome();
            });
        
            body.appendChild(returnHomeButton);
            const blogsDiv = document.createElement("div");
            blogsDiv.appendChild(document.createTextNode("Blogs"));
            setUpBlogsDiv(blogsDiv);
        
            try {
                const blogsFound = await getBlogByTitle(titleOrUsername);
                loadBlogs(blogsFound, blogsDiv);
            }  
            catch (error) {
                if(error.response) {
                    switch(error.response.status){
                        case(401):
                            navigateToHome();
                            break;
                    }
                }
                else {
                    alert("An unknown error occured");
                    console.log(error);
                    navigateToHome();
                }
        
            }

            const usersDiv = document.createElement("div");
            usersDiv.appendChild(document.createTextNode("Users"));
            setUpUsersDiv(usersDiv);
        
            try {
                const usersFound = await getUsers(titleOrUsername);
                loadUsers(usersFound, usersDiv);
            }
            catch (error) {
                if(error.response) {
                    switch(error.response.status){
                        case(401):
                            navigateToHome();
                            break;
                    }
                }
                else {
                    alert("An unknown error occured");
                    console.log(error);
                    navigateToHome();
                }
            }

            body.appendChild(usersDiv);
            body.appendChild(blogsDiv);
        }
    },
    async mounted() {
        await this.loadPageData();
    },
}