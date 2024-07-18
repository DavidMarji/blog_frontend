import { createBlog, getAllPublishedBlogs } from "../service/blogService.js";
import { loadBlogs, setUpBlogsDiv } from "../utilities/loadBlogs.js";
import { navigateToBlog, navigateToResult } from "../utilities/routerFunctions.js";

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
                sessionStorage.setItem(blogId, JSON.stringify({
                    'title' : blogTitle
                }));

                // next(`/blogs/${blogId}/1`);
                navigateToBlog(blogId, 1);
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

        const searchInput = document.getElementById("search-input");
        searchInput.addEventListener("keyup", (e) => {
            this.handleSearch(e);
        });
    },
    methods: {
        handleSearch(e) {
            if(e.keyCode === 13) {
                const searchTerm = document.getElementById("search-input").value;
                if (searchTerm) {
                    const encodedTitle = encodeURI(searchTerm);
                    // next(`/result/${encodedTitle}`);
                    navigateToResult(encodedTitle);
                }
            }
        },
      },
}