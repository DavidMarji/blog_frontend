import { getBlogByTitle } from "../service/blogService";
import { loadBlogs, setUpBlogsDiv } from "../utilities/loadBlogs";

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
                        window.location.href = "/home";
                        break;
                    default:
                        console.log(error);
                        alert("an unknown error occured");
                        window.location.href = "/home";
                        break;
                }
            }
            else {
                alert("An unknown error occured");
                console.log(error);
                window.location.href = "/home";
            }

        }
    },
}