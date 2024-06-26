<template>
    <div>
        <div class="all" id="container">
            <div class="inside">
                <label class="label">SignUp</label>
                <div>
                    <input type="text" name="username" id="username" placeholder="Username" required>
                </div>
                <div>
                    <input type="text" name="email" id="email" placeholder="Email" required>
                </div>
                <div>
                    <input type="password" name="password" id="password" placeholder="Password" required>
                </div>
                <div>
                    <button id="submitButton">Submit</button>
                    <router-link to="/login">Click here if you already have an account</router-link>
                </div>
                <div>
                    <p id="errorText"></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="../scripts/signUp.js">
</script>

<style>
div#container {
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    height: 220px;
    width: 390px;
    border: 1px solid black;
    background-color: White;
}

html {
    background-color: WhiteSmoke;
}

.inside {
    margin-top: 20px;
    margin-bottom: 10px;
    margin-right: 20px;
    margin-left: 20px;
}

input, button, router-link, p {
    margin-top: 5px;
    margin-bottom: 5px;
}

p {
    margin-left: 20px;
}

button, p {
    margin-right: 10px;
}

.label {
    max-width: fit-content;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
</style>