
function init() {
    let textone = document.querySelector('h3');
    
    // 初始化样式
    textone.style.color = '#E8F9FD';
    textone.style.fontFamily = '楷体';
    textone.style.top = '90px';
    textone.style.fontSize = '50px';

    let texts = [
        '感谢天',
        '感谢地',
        '命运让我们相遇',
        '自从遇见你',
        '已许下一生誓言',
        '爱你今生到永远',
        '往后余生',
        '只与你',
        '牵手走下去',
        '老婆 我爱你'
    ];
    let index = 0;
    
    // 每隔3秒钟更新一次文本内容
    let intervalId = setInterval(function() {
        // 更新文本内容
        textone.innerHTML = texts[index];
        
        // 如果数组中有更多内容，继续显示
        index++;

        // 如果显示完所有文本，停止更新
        if (index >= texts.length) {
            clearInterval(intervalId); // 停止定时器
        }
    }, 3000);  // 3000ms = 3秒
}

window.addEventListener('load', init);

