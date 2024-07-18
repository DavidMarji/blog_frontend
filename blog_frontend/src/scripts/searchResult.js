import { getBlogByTitle } from "../service/blogService";
import { getUsers } from "../service/userService";
import { loadBlogs, setUpBlogsDiv } from "../utilities/loadBlogs";
import { navigateToHome } from "../utilities/routerFunctions";
import { loadUsers } from "../utilities/loadUsers.js";

export default {
    async mounted() {
        const title = decodeURI(this.$route.params.title);
        const body = document.getElementById("body");
        const returnHomeButton = document.createElement("button");
        returnHomeButton.innerText = "home";
        
        returnHomeButton.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToHome();
        });

        body.appendChild(returnHomeButton);

        try {
            const blogsFound = await getBlogByTitle(title);
            const blogsDiv = document.createElement("div");
            setUpBlogsDiv(blogsDiv);

            if(blogsFound.length) {

                body.appendChild(blogsDiv);
                loadBlogs(blogsFound, blogsDiv);
            }
            else {
                const usersFound = await getUsers(title);
                loadUsers(usersFound, blogsDiv);
            }
        }  
        catch (error) {
            if(error.response) {
                switch(error.response.status){
                    case(404):
                        const p = document.getElementById("errorText");
                        const textNode = document.createTextNode("Blog with the given title does not exist");
                        p.appendChild(textNode);
                        break;
                    case(401):
                        navigateToHome();
                        break;
                    default:
                        console.log(error);
                        alert("an unknown error occured");
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
    },
}