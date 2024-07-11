export const loadBlogs = function(blogs, blogsDiv){
    const numCols = 5; // Number of columns per row
    const colWidth = 100 / numCols; // Width percentage of each column

    for (let i = 0; i < Math.ceil(blogs.length / numCols); i++) {
        const newRow = document.createElement("div");
        newRow.className = "row";
        newRow.style.position = "relative";
        newRow.style.top = `${15 + (i + 1) * 5}%`; // Adjust top position

        blogsDiv.appendChild(newRow);

        for (let k = 0; (i * numCols) + k < blogs.length && k < numCols; k++) {
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
            newCol.blogId = blogs[(i * numCols) + k].id;

            newRow.appendChild(newCol);
            newCol.appendChild(document.createTextNode(blogs[(i * numCols) + k].title));

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
};

export const setUpBlogsDiv = function(blogsDiv){
    blogsDiv.style.position = "absolute";
    blogsDiv.style.top = '20%';
    blogsDiv.style.width = '70%';
    blogsDiv.style.marginLeft = '15%';
    blogsDiv.style.marginRight = '15%';
    blogsDiv.style.display = 'block';
};