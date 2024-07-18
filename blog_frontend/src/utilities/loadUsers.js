import { navigateToUserProfile } from './routerFunctions.js';

export const loadUsers = function(users, usersDiv){
    const numCols = 5; // Number of columns per row
    const colWidth = 100 / numCols; // Width percentage of each column

    for (let i = 0; i < Math.ceil(users.length / numCols); i++) {
        const newRow = document.createElement("div");
        newRow.className = "row";
        newRow.style.position = "relative";
        newRow.style.top = `${15 + (i + 1) * 5}%`; // Adjust top position

        usersDiv.appendChild(newRow);

        for (let k = 0; (i * numCols) + k < users.length && k < numCols; k++) {
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
            
            
            newCol.username = users[(i * numCols) + k].username;

            newRow.appendChild(newCol);
            newCol.appendChild(document.createTextNode(users[(i * numCols) + k].title));

            newCol.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToUserProfile(newCol.username);
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