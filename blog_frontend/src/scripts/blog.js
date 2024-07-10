import { getSpecificPage, createNewPage, updatePage, deletePage } from "../service/pageService";
import { getBlogById, updateBlogTitle, publishBlog } from '../service/blogService.js'
import { saveImage } from "../service/imageService.js";

export default {
    async mounted() {
        const id = this.$route.params.id;
        const number = this.$route.params.pageNumber;

        const title = document.getElementById("title");
        const pageNumber = document.getElementById("pageNumber");
        const pageContent = document.getElementById("pageContent");
        const pageContentDiv = document.getElementById("pageContentDiv");

        let publishStatus;
        let pageLength;
        try {
            const blog = await getBlogById(id);
            pageLength = parseInt(blog.number_of_pages, 10);
            publishStatus = blog.published;
            title.innerText = sessionStorage.getItem(id) ? sessionStorage.getItem(id) : blog.title;
        }
        catch(error) {
            title.style.color = 'red';
            if(error.response !== undefined) {
                switch(error.response.status) {
                    case(404):
                        title.innerText = "The blog does not exist";
                        break;
                    case(401):
                        window.location.href = '/home';
                        break;
                    case(409):
                        title.innerText = "Blog Id must be a number";
                        break;
                    default:
                        title.innerText = "An unknown error occured";
                        break;
                }
            }
            else {
                title.innerText = "An unknown error occured";
                console.log(error);
            }

            throw error;
        }
        let page;
        try {
            page = await getSpecificPage(id, number);
            pageNumber.innerText = page.page_number;
            pageContent.innerText = sessionStorage.getItem(page.id) ? JSON.parse(sessionStorage.getItem(page.id)).pageContent : page.page_content;
        }
        catch(error) {
            title.style.color = 'red';
            if(error.response !== undefined) {
                switch(error.response.status) {
                    case(404):
                        title.innerText = "The page does not exist";
                        break;
                    case(401):
                        window.location.href = '/home';
                        break;
                    case(400):
                        title.innerText = 'Page number must be greater than 0';
                        break;
                    case(409):
                        title.innerText = "Page number must be a number";
                        break;
                    default:
                        title.innerText = "An unknown error occured";
                        break;
                    }
                }
                else {
                    title.innerText = "An unknown error occured";
                    console.log(error);
                }
                throw error;
        };

        if(!publishStatus) {
            const saveButton = document.createElement("button");
            saveButton.innerText = "Save";

            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete Page";

            const createButton = document.createElement("button");
            createButton.innerText = "Create Page";

            const publishButton = document.createElement("button");
            publishButton.innerText = "Publish Blog";

            const uploadImage = document.createElement("button");
            uploadImage.innerText = "Upload Image";

            const topDiv = document.getElementById("topButtons");
            topDiv.appendChild(saveButton);
            topDiv.appendChild(deleteButton);
            topDiv.appendChild(createButton);
            topDiv.appendChild(publishButton);
            topDiv.appendChild(uploadImage);

            title.addEventListener('click', function() {
                title.setAttribute("contenteditable", true);
            });

            title.addEventListener('input', function() {
                sessionStorage.setItem(id, title.innerText);
            });

            pageContent.addEventListener('click', function() {
                this.setAttribute("contenteditable", "true");
            });

            pageContent.addEventListener('input', function() {
                sessionStorage.setItem(page.id, JSON.stringify({
                    'pageContent' : pageContent.innerText,
                    'pageNumber' : page.page_number
                }));

                const numberList = sessionStorage.getItem('numberList');
                const realList = numberList ? JSON.parse(numberList) : [];
                if(!numberList) {
                    sessionStorage.setItem('numberList', JSON.stringify([page.id]));
                }
                else if(!realList.includes(page.id)) {

                    realList.push(page.id);
                    sessionStorage.setItem('numberList', JSON.stringify(realList));
                }
            });

            publishButton.addEventListener('click', async (e) => {
                e.preventDefault();

                try {
                    const published = await publishBlog(id);


                    const numberList = sessionStorage.getItem('numberList');
                    const realList = numberList ? JSON.parse(numberList) : [];
                    
                    if(numberList) {
                        for(const i of realList) {
                            sessionStorage.removeItem(i);
                        }
                        sessionStorage.removeItem('numberList');
                    }
                    location.reload();
                }
                catch (error) {
                    console.log(error);
                }
            });

            saveButton.addEventListener('click', async (e) => {
                e.preventDefault();

                try {
                    if(title.innerText.length < 5) throw new Error("Title can't be empty");
                    const updatedBlog = await updateBlogTitle(id, title.innerText);


                    const numberList = sessionStorage.getItem('numberList');
                    const realList = numberList ? JSON.parse(numberList) : [];
                    for(const i of realList) {
                        const pageJson = JSON.parse(sessionStorage.getItem(i));
                        await updatePage(id, pageJson.pageNumber, pageJson.pageContent);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });

            createButton.addEventListener('click', async (e) => {
                e.preventDefault();


                try {
                    const createdPage = await createNewPage(id);
                    window.location.href = `/blogs/${id}/${pageLength + 1}`;
                }
                catch (error) {
                    console.log(error);
                }
            });

            deleteButton.addEventListener('click', async (e) => {
                try {
                    const deletedRows = await deletePage(id, number);
                    const toRedirectTo = (pageLength === 1
                        ? 1
                        : (parseInt(number, 10) === pageLength
                            ? parseInt(number, 10) - 1
                            : parseInt(number, 10)));

                    sessionStorage.removeItem(page.id);

                    const numberList = sessionStorage.getItem('numberList');
                    const realList = numberList ? JSON.parse(numberList) : [];

                    let list = [];
                    for(const id of realList) {
                        const pageJson = JSON.parse(sessionStorage.getItem(id));
                        console.log(pageJson)

                        if(pageJson && parseInt(pageJson.pageNumber, 10) > parseInt(number, 10)) {

                            sessionStorage.setItem(id, JSON.stringify({
                                'pageContent' : pageJson.pageContent,
                                'pageNumber' : pageJson.pageNumber - 1
                            }));
                            list.push(id);
                        }
                        else if(pageJson && parseInt(pageJson.pageNumber, 10) !== parseInt(number, 10)) {
                            list.push(id);
                        }
                    }

                    sessionStorage.setItem('numberList', JSON.stringify(list));
    
                    window.location.href = `/blogs/${id}/${toRedirectTo}`;
                }
                catch (error) {
                    console.log(error);
                }

            });

            uploadImage.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById("blogForm").style.display = "block";
            });

            const closeButton = document.getElementById("closeButton");
            closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById("blogForm").style.display = "none";
            });
            
            const imageUpload = document.getElementById('imageUpload');

            const submitButton = document.getElementById('submitButton');
            submitButton.addEventListener('click', async (e) => {
                e.preventDefault();
            
                const file = document.getElementById('imageUpload').files[0];
                if (file) {
                    const fileType = file.type;
                    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            
                    if (validImageTypes.includes(fileType)) {
                        const formData = new FormData();
                        formData.append('image', file);
            
                        try {
                            await saveImage(id, number, formData);
            
                            const reader = new FileReader();
                            reader.onload = function(image) {
                                const img = document.createElement('img');
                                img.src = image.target.result;
                                img.alt = 'Uploaded Image';
                                img.style.width = '100%';
                                img.style.height = 'auto';
            
                                pageContentDiv.appendChild(img);
                            }
                            reader.readAsDataURL(file);
                        } 
                        catch (error) {
                            console.error('Error:', error);
                        }
                    } 
                    else {
                        alert('Please upload a valid image file (JPEG, PNG, GIF).');
                    }
                } 
                else {
                    alert('No file uploaded.');
                }
            });
        }
        else {
            
        }

        const nextButton = document.getElementById('next');
        const backButton = document.getElementById('back');

        if(parseInt(number, 10) === pageLength) {
            nextButton.style.display = "none";
        }
        else {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `/blogs/${id}/${parseInt(number) + 1}`;
            });
        }

        if(parseInt(number, 10) === 1) {
            backButton.style.display = "none";
        }
        else {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `/blogs/${id}/${parseInt(number) - 1}`;
            });
        }

    },
}