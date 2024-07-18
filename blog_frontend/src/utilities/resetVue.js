export const restVue = function resetVue() {
    const bodies = document.getElementsByTagName("body");
    const body = bodies[0];
    const bodyParent = body.parentElement;
    bodyParent.removeChild(body);
    const newBody = document.createElement("body");
    bodyParent.appendChild(newBody);
}