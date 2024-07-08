import { getAllUserPublishedBlogs } from "../service/blogService";

export default {
    mounted() {
        const username = this.$route.params.username;
        getAllUserPublishedBlogs(username)
        .then(publishedBlogs => {
            const title = document.getElementById("title");
            const titleNode = document.createTextNode(`User: ${username}`);
            title.appendChild(titleNode);

            const body = document.getElementsByTagName("body")[0];
            const newDiv = document.createElement("div");
            const divP = document.createElement("p");
            const textNode = document.createTextNode("Blogs");
            const blogsDiv = document.createElement("div");

            newDiv.style.position = "absolute";
            newDiv.style.top = "15%";
            newDiv.style.left = "50%";
            newDiv.style.msTransform = 'translate(-50%, -50%)';
            newDiv.style.transform = 'translate(-50%, -50%)';
            divP.style.fontSize = "x-large";
            blogsDiv.style.position = "absolute";
            blogsDiv.style.top = '20%';
            blogsDiv.style.width = '70%';
            blogsDiv.style.marginLeft = '15%';
            blogsDiv.style.marginRight = '15%';
            blogsDiv.style.display = 'block';

            body.appendChild(newDiv);
            newDiv.appendChild(divP);
            divP.appendChild(textNode);
            body.appendChild(blogsDiv);

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
            const p = document.getElementById('title');
            p.style.color = "red";
            p.style.fontSize = "xx-large";
            if(!error.response) {
                console.log(error);
                p.innerText = "An unknown error occured.";
            }
            else {
                switch(error.response.status) {
                    case(401):
                        p.innerText = "You do not have access to this page."
                        break;
                    case(404):
                        p.innerText = "Sorry, the given user does not exist.";
                        break;
                    default:
                        console.log(error.response);
                        console.log(error.response.status);
                        p.innerText = "An unknown error occured.";
                }
            }
        });
    },
}