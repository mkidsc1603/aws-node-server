export default {
    Init() {
        Date.prototype.formate = function (str = '-') {
            str = str || "-";
            return new Date().toISOString().slice(0, 10).replace(/-/g, str);
        }
    }
}