import { getBlogByTitle } from "../service/blogService";
import { getUsers } from "../service/userService";
import { loadBlogs, setUpBlogsDiv } from "../utilities/loadBlogs";
import { navigateToHome } from "../utilities/routerFunctions";
import { loadUsers } from "../utilities/loadUsers.js";

export default {
    async mounted() {
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
        setUpBlogsDiv(blogsDiv);

        try {
            const blogsFound = await getBlogByTitle(titleOrUsername);
            console.log(blogsFound);
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

        try {
            const usersFound = await getUsers(titleOrUsername);
            console.log(usersFound);
            loadUsers(usersFound, blogsDiv);
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
        body.appendChild(blogsDiv);
    },
}