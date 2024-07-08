<template>
    <div class="blog-container">
        <div id="blog">
            <div id="titleDiv">
                <p id="title">Title</p>
            </div>

            <div id="pageContentDiv">
                <p id="pageContent">Content</p>
            </div>

            <div id="pageNumberDiv">
                <p id="pageNumber">1</p>
            </div>
        </div>

        <div id="topButtons">
        </div>

        <div id="bottomButtons">
            <div id="back"></div>
            <div id="next"></div>
        </div>
    </div>

<!-- .blog-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: WhiteSmoke;
    padding: 20px;
    box-sizing: border-box;
} 

.blog-container #blog {
    background-color: white;
    border: 1px solid #ddd;
    width: 45vw;
    height: 95vh;
    padding: 40px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    position: relative;
    overflow: auto;
}

#topButtons {
    position: absolute;
    top: 20px;
    left: 20px;
    display: flex;
    gap: 10px;
} -->
</template>

<script src="../scripts/blog.js">
</script>

<style scoped>
.blog-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: WhiteSmoke;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
}

.blog-container #blog {
    background-color: white;
    border: 1px solid #ddd;
    width: 45vw;
    height: 95vh;
    padding: 40px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    position: relative;
    overflow: auto;
}

#topButtons {
    position: absolute;
    top: 20px;
    left: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    z-index: 1;
    max-width: 20vw;
}
.blog-container #titleDiv {
    text-align: center;
    margin-bottom: 20px;
}

.blog-container #pageContentDiv {
    margin-bottom: 20px;
}

.blog-container #pageNumberDiv {
    position: absolute;
    bottom: 10px;
    right: 10px;
    text-align: right;
}

</style>