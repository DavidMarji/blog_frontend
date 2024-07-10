import { createBlog, getBlogByTitle, getAllPublishedBlogs } from "../service/blogService";

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
        const body = document.getElementsByTagName("div")[0];
        body.appendChild(blogsDiv);

        getAllPublishedBlogs()
        .then(publishedBlogs => {
            const numCols = 5; // Number of columns per row
            const colWidth = 100 / numCols; // Width percentage of each column

            for (let i = 0; i < Math.ceil(publishedBlogs.length / numCols); i++) {
                const newRow = document.createElement("div");
                newRow.className = "row";
                newRow.style.position = "relative";
                newRow.style.top = `${15 + (i + 1) * 5}%`; // Adjust top position

                blogsDiv.appendChild(newRow);

                for (let k = 0; (i * numCols) + k < publishedBlogs.length && k < numCols; k++) {
                    const newCol = document.createElement("div");
                    newCol.className = "column";

                    const leftPos = k * colWidth;
                    newCol.style.left = `${leftPos}%`;
                    newCol.style.width = `${colWidth}%`;
                    newCol.style.border = 'solid';
                    newCol.style.borderWidth = '1px';
                    newCol.style.paddingTop = '5px';
                    newCol.style.paddingBottom = '5px';
                    newCol.style.paddingLeft = '10px';
                    newCol.style.paddingRight = '10px';
                    newCol.style.textAlign = 'center';

                    if (k < numCols - 1) {
                        newCol.style.marginRight = '1%';
                        newCol.style.marginTop = '1%';
                    }
                    
                    // give the newCol a blogId so that we can access it when clicked
                    newCol.blogId = publishedBlogs[(i * numCols) + k].id;

                    newRow.appendChild(newCol);
                    newCol.appendChild(document.createTextNode(publishedBlogs[(i * numCols) + k].title));

                    newCol.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = `/blogs/${newCol.blogId}/1`;
                    });

                    newCol.addEventListener('mouseenter', (e) => {
                        e.preventDefault();
                        newCol.style.borderColor = 'yellow';
                        newCol.style.borderWidth = '4px';
                    });

                    newCol.addEventListener('mouseleave', (e) => {
                        e.preventDefault();
                        newCol.style.borderColor = 'black';
                        newCol.style.borderWidth = '1px';
                    });
                }
            }
        })
        .catch(error => {
            console.log(error);
        });
    },
}