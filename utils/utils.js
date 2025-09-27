export function setField(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    if ("value" in el) {
        el.value = value ?? "0";
    }
    else {
        el.textContent = value ?? "0";
    }
}