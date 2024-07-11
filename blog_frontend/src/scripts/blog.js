import { getSpecificPage, createNewPage, updatePage, deletePage } from "../service/pageService";
import { getBlogById, updateBlogTitle, publishBlog, deleteBlog, unpublishBlog } from '../service/blogService.js'
import { saveImage, getPageImages, deleteImage } from "../service/imageService.js";
import JSZip from 'jszip';

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

        getPageImages(id, number)
        .then(async imagesZip => {
            const zip = await JSZip.loadAsync(imagesZip);
            const files = [];
            let metadata = {};

            if (zip.files['metadata.json']) {
                const metadataContent = await zip.files['metadata.json'].async('string');
                metadata = JSON.parse(metadataContent);
            }

            for (const relativePath of Object.keys(zip.files)) {
                if (relativePath !== 'metadata.json') {
                    const fileData = await zip.files[relativePath].async("blob");
                    const file = new File([fileData], relativePath);
                    const fileMetadata = metadata.find(m => m.fileName === relativePath);
                    files.push({ file, metadata: fileMetadata });
                }
            }

            for(const file of files) {
                const formData = new FormData();
                formData.append('image', file);
                const reader = new FileReader();
                reader.onload = function(image) {
                    const img = document.createElement('img');
                    img.src = image.target.result;
                    img.alt = 'Uploaded Image';
                    img.style.width = '100%';
                    img.style.height = 'auto';
                    img.imageId = file.metadata.imageId; 

                    img.addEventListener('click', () => {
                        sessionStorage.setItem("imageToDelete", img.imageId);
                    }); 

                    img.addEventListener('mouseenter', (e) => {
                        e.preventDefault();
                        img.style.border = "1px solid yellow";
                    });
        
                    img.addEventListener('mouseleave', (e) => {
                        e.preventDefault();
                        img.style.border = 'none';
                    });

                    pageContentDiv.appendChild(img);
                }
                reader.readAsDataURL(file.file);
            }
        })
        .catch(error => {
            console.log(error);
        });

        if(!publishStatus) {
            const deleteBlogButton = document.createElement("button");
            deleteBlogButton.innerText = "Delete Blog";
            
            const deleteImageButton = document.createElement("button");
            deleteImageButton.innerText = "Delete image";

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
            topDiv.appendChild(deleteImageButton);
            topDiv.appendChild(deleteBlogButton);

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
                    'pageNumber' : page.page_number,
                    "blogId" : id
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
                        let newList = [];
                        for(const i of realList) {
                            if(JSON.parse(sessionStorage.getItem(i)).blogId === id) sessionStorage.removeItem(i);
                            else newList.push(i);
                        }
                        sessionStorage.setItem('numberList', JSON.stringify(newList));
                    }
                    location.reload();
                }
                catch (error) {
                    if(error.response) {
                        switch(error.response.status){
                            case(401):
                                window.location.href = "/home";
                                break;
                            case(404):
                                alert("failed to update blog title because it was not found in the database");
                                window.location.href = "/home";
                                break;
                            case(409):
                                alert("blog already published");
                                break;
                            default:
                                alert("unknown error occured with response code", error.response.status);
                                console.log(error);
                                break;
                        }
                    }
                    else {
                        alert("an unknown error occured");
                        console.log(error);
                    }
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
                        if(pageJson.blogId === id) await updatePage(id, pageJson.pageNumber, pageJson.pageContent);
                    }
                    alert("successfuly saved the blog's changes");
                }
                catch (error) {
                    if(error.response) {
                        switch(error.response.status){
                            case(401):
                                window.location.href = "/home";
                                break;
                            case(404):
                                alert("failed to save blog changes because the blog and/or pages were not found in the database");
                                // window.location.href = "/home";
                                break;
                            case(400):
                                alert("failed to save because an invalid page number (< 1) was sent");
                                break;
                            default:
                                alert("unknown error occured with response code", error.response.status);
                                console.log(error);
                                break;
                        }
                    }
                    else {
                        alert("an unknown error occured");
                        console.log(error);
                    }
                }
            });

            createButton.addEventListener('click', async (e) => {
                e.preventDefault();


                try {
                    const createdPage = await createNewPage(id);
                    window.location.href = `/blogs/${id}/${pageLength + 1}`;
                }
                catch (error) {
                    if(error.response) {
                        switch(error.response.status){
                            case(401):
                                window.location.href = "/home";
                                break;
                            case(404):
                                alert("failed to create a new page because it was not found");
                                window.location.href = "/home";
                                break;
                            case(409):
                                alert("blog has already been published, can't create a new page");
                                break;
                            default:
                                alert("unknown error occured with response code", error.response.status);
                                console.log(error);
                                break;
                        }
                    }
                    else {
                        alert("an unknown error occured");
                        console.log(error);
                    }
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
                    if(error.response) {
                        switch(error.response.status){
                            case(401):
                                window.location.href = "/home";
                                break;
                            case(404):
                                alert("failed to delete page because it was not found");
                                window.location.href = "/home";
                                break;
                            case(400):
                                alert("failed to delete page because an invalid page number ( < 1) was given");
                                break;
                            case(403):
                                alert("failed to delete because it is the only page, you can not delete a blog's page if it is the only one");
                                break;
                            default:
                                alert("unknown error occured with response code", error.response.status);
                                console.log(error);
                                break;
                        }
                    }
                    else {
                        alert("an unknown error occured");
                        console.log(error);
                    }
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
                            const imageDAO = await saveImage(id, number, formData);

                            const reader = new FileReader();
                            reader.onload = function(image) {
                                const img = document.createElement('img');
                                img.src = image.target.result;
                                img.alt = 'Uploaded Image';
                                img.style.width = '100%';
                                img.style.height = 'auto';
                                img.imageId = imageDAO.id; 

                                img.addEventListener('click', () => {
                                    sessionStorage.setItem("imageToDelete", img.imageId);
                                }); 

                                img.addEventListener('mouseenter', (e) => {
                                    e.preventDefault();
                                    img.style.border = "1px solid yellow";
                                });
                    
                                img.addEventListener('mouseleave', (e) => {
                                    e.preventDefault();
                                    img.style.border = 'none';
                                });

                                pageContentDiv.appendChild(img);
                            }
                            reader.readAsDataURL(file);
                        } 
                        catch (error) {
                            if(error.response) {
                                switch(error.response.status){
                                    case(401):
                                        window.location.href = "/home";
                                        break;
                                    case(404):
                                        alert("failed to save image because the page number used was not found");
                                        window.location.href = "/home";
                                        break;
                                    case(400):
                                        alert("failed to save image because the page number used was invalid (< 1)");
                                        break;
                                    default:
                                        alert("unknown error occured with response code", error.response.status);
                                        console.log(error);
                                        break;
                                }
                            }
                            else {
                                alert("an unknown error occured");
                                console.log(error);
                            }
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

            deleteImageButton.addEventListener("click", async () => {
                try {
                    const imageToDelete = sessionStorage.getItem("imageToDelete");
                    const images = document.getElementsByTagName('img');

                    if(imageToDelete || imageToDelete === 0) {
                        for(const image of images) {
                            if(parseInt(image.imageId) === parseInt(imageToDelete)) {
                                const deleted = await deleteImage(id, number, imageToDelete);
                                image.parentElement.removeChild(image);
                                sessionStorage.removeItem("imageToDelete");
                                break;
                            }
                        }
                    }  
                    else {
                        alert("Please select an image first by clicking on it!");
                    }
                }
                catch (error) {
                    if(error.response) {
                        switch(error.response.status){
                            case(401):
                                window.location.href = "/home";
                                break;
                            case(404):
                                alert("failed to delete image because it was not found in the database");
                                window.location.href = "/home";
                                break;
                            case(400):
                                alert("failed to delete image because an invalid page number ( < 1) was given");
                                break;
                            default:
                                alert("unknown error occured with response code", error.response.status);
                                console.log(error);
                                break;
                        }
                    }
                    else {
                        alert("an unknown error occured");
                        console.log(error);
                    }
                }
            });

            deleteBlogButton.addEventListener('click', async (e) => {
                e.preventDefault();

                try {
                    const deleted = await deleteBlog(id);
                    window.location.href = "/home";
                }
                catch (error) {
                    if(error.response) {
                        switch(error.response.status){
                            case(401):
                                window.location.href = "/home";
                                break;
                            case(404):
                                alert("failed to delete blog because it was not found in the database");
                                window.location.href = "/home";
                                break;
                            default:
                                alert("unknown error occured with response code", error.response.status);
                                console.log(error);
                                break;
                        }
                    }
                    else {
                        alert("an unknown error occured");
                        console.log(error);
                    }
                }
            });
        }
        else {
            try {
                const rows = await unpublishBlog(id);
                const rowsPublished = await publishBlog(id);

                const topDiv = document.getElementById("topButtons");
                const unpublishButton = document.createElement("button");
                unpublishButton.innerText = "Unpublish the blog";
                topDiv.appendChild(unpublishButton);

                unpublishButton.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        const a = await unpublishBlog(id);
                        location.reload();
                    }
                    catch (error) {
                        if(error.response.status === 401) window.location.href = "/home";
                        else if (error.response.status === 404){
                            alert("blog or user was not found");
                            window.location.href = "/home";
                        }
                        else if(error.response.status === 409) {
                            alert("can not unpublish an already private blog");
                            location.reload();
                        }
                        else {
                            alert("an unknown error occured");
                            window.location.href = "/home";
                        }
                    }
                });
            }
            catch(error) {
            };
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