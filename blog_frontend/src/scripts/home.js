import { createBlog, getBlogByTitle } from "../service/blogService";
import { createNewPage } from "../service/pageService";
// import router from "../router.js";

export default {
    mounted() {
        const button = document.getElementById('createBlog');
        button.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById("blogForm").style.display = "block";
        });

        const closeButton = document.getElementById("closeButton");
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById("blogForm").style.display = "none";
        });

        const submitButton = document.getElementById("submitButton");
        submitButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const blogTitle = document.getElementById("title").value;
            try {
                
                const blogId = await createBlog(blogTitle);
                const page_content = await createNewPage(parseInt(blogId));
                sessionStorage.setItem("title", blogTitle);

                window.location.href = `/blogs/${blogId}/1`
            }
            catch(error){
                const p = document.getElementById('errorText');
                p.style.color = "red";
    
                if (!error.response) {
                    p.innerText = "An unknown error occured.";
                    console.log(error);
                    console.log(error.message);
                }
                else {
                    switch (error.response.status) {
                        case(409):
                            p.innerText = "Title is already in use.";
                            break;
                        case(401):
                            p.innerText = "Unauthorized access.";
                            break;
                        default:
                            p.innerText = "An unknown error occured.";
                            console.log(error.response.status);
                            break;
                    }
                }
            };
        });
    },
}