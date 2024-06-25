<template>
    <div>
        <label>Log In</label>
        <div>
            <div>
                <input type="text" name="username" id="username" placeholder="Username or Email" required>
            </div>
            <div>
                <input type="password" name="password" id="password" placeholder="Password" required>
            </div>
            <div>
                <button id="submitButton">Submit</button>
                <router-link to="/signUp">Click here if you don't have an account</router-link>
            </div>
        </div>
    </div>
</template>

<script>
</script>

<style>
</style>