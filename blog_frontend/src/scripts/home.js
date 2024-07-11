import { createBlog, getAllPublishedBlogs } from "../service/blogService.js";
import { loadBlogs, setUpBlogsDiv } from "../utilities/loadBlogs.js";

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
                sessionStorage.setItem(blogId, blogTitle);

                window.location.href = `/blogs/${blogId}/1`;
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

        const blogsDiv = document.createElement("div");
        setUpBlogsDiv(blogsDiv);
        const body = document.getElementsByTagName("div")[0];
        body.appendChild(blogsDiv);

        getAllPublishedBlogs()
        .then(publishedBlogs => {
            loadBlogs(publishedBlogs, blogsDiv);
        })
        .catch(error => {
            console.log(error);
        });
    },
}