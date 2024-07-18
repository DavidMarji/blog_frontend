import { getBlogByTitle } from "../service/blogService";
import { loadBlogs, setUpBlogsDiv } from "../utilities/loadBlogs";
import { navigateToHome } from "../utilities/routerFunctions";

export default {
    async mounted() {
        const title = decodeURI(this.$route.params.title);
        const body = document.getElementById("body");
        
        try {
            const blogsFound = await getBlogByTitle(title);
            const blogsDiv = document.createElement("div");
            setUpBlogsDiv(blogsDiv);
            body.appendChild(blogsDiv);
            loadBlogs(blogsFound, blogsDiv);
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