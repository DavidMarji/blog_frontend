<template>
    <div id="body">
        <div class="topnav">
            <button id="createBlog" @click="toggleForm">Create new blog</button>
            
            <input type="text" placeholder="Search.." class="search-input" id="search-input" @keyup.enter="handleSearch">

        </div>
        <div class="form-popup" id="blogForm">
            <h1>Enter Your Blog Information</h1>

            <label for="title"><b>Title</b></label>
            <input type="text" placeholder="Enter Title" name="title" id="title" required>

            <button type="submit" id="submitButton">Submit</button>
            <button type="button" id="closeButton">Close</button>
        </div>
        <div>
            <p id="errorText"></p>
        </div>
    </div>
</template>

<script src="../scripts/home.js">
</script>

<style scoped>
.topnav {
    position: relative;
}

#createBlog {
    left: 100%;
    -ms-transform: translate(10%, 10%);
    transform: translate(10%, 10%);
}

.topnav .search-input {
    float: right;
    padding: 6px;
    margin-top: 8px;
    margin-right: 16px;
    border: none;
    font-size: 17px;
}

.form-popup {
    display: none;
    position: absolute;
    left: 0%;
    top: 90%;
    -ms-transform: translate(0%, -90%);
    transform: translate(0%, -90%);
    border: 1px solid #ccc;
    background-color: #f1f1f1;
    width: 300px;
    padding: 15px;
    z-index: 1;
}

.form-popup form {
    max-width: 100%;
}

.form-popup form input[type=text], 
.form-popup form button {
    width: 100%;
    margin: 5px 0;
}

.form-popup  {
    color: black;
    border: none;
    cursor: pointer;
}

</style>