function digitPadding(n){
    return n > 9 ? "" + n: "0" + n;
}
function formateDate(millis) {
  let date = new Date(millis);
  return `${digitPadding(date.getHours())}:${digitPadding(date.getMinutes())}:${digitPadding(date.getSeconds())}`;
}