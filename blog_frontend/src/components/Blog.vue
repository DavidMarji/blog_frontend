<template>
    <div>
        <div id="blog">
            <div id="titleDiv">
                <p id="title"></p>
            </div>
            
            <div id="pageContentDiv">
                <p id="pageContent"></p>
            </div>

            <div id="pageNumberDiv">
                <p id="pageNumber"></p>
            </div>
        </div>
    </div>
</template>

<script src="../scripts/blog.js">
</script>

<style>
    html {
        background-color: WhiteSmoke;
    }

    #blog {
        background-color: white;
        border-style: solid;
        border-width: 1px;
        width: 80%;
        margin: 0 auto;
        padding: 10px;
        box-sizing: border-box;
        position: relative;
        min-height: 1000px;
    }

    #titleDiv {
        text-align: 'center';
    }
    
    #pageNumberDiv {
        position: relative;
        bottom: 0;
        left: 140%;
        -ms-transform: translate(-50%);
        transform: translate(-50%);
    }
</style>