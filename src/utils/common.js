export function showToast(message, timeout = 5000) {
    let element = document.createElement('div');
    element.className = 'toast-box';
    element.innerHTML = message
    document.documentElement.appendChild(element)
    console.log("showToast", message);
    setTimeout(() => {
        document.documentElement.removeChild(element)
    }, timeout)
}