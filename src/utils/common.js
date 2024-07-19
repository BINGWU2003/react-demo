export function showToast(message, timeout = 1000) {
    let element = document.createElement('div');
    element.className = 'toast-box';
    element.innerHTML = message
    document.documentElement.appendChild(element)
    setTimeout(() => {
        document.documentElement.removeChild(element)
    }, timeout)
}