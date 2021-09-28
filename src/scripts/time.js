function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    var ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12;

    minutes = minutes < 10 ? '0'+minutes : minutes;

    var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;

    return strTime;
}

// Setando hora de 1 em 1 segundo
setInterval(() => {
    let momentNow = new Date();

    const hoursInfo = document.querySelector("#hours_info");

    hoursInfo.innerHTML = formatDate(momentNow);
}, 100);
