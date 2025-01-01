let countdownTimer;
let selectedCells = [];

// 词语数组：每个单元格对应的词语
let words = [
    ["Apple", "Banana", "Cherry"],
    ["Dog", "Elephant", "Fish"],
    ["Guitar", "Hat", "Icecream"]
];
let correctAnswers = [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1]
];
let totalTime = 40;

document.addEventListener("DOMContentLoaded", function() {
    // 页面加载完成后显示图片，并准备好表格
    displayImage();
    
    // 监听按键事件，只有按下空格键时才开始倒计时并显示表格
    document.addEventListener("keydown", function(event) {
        if (event.key === " " || event.keyCode === 32) {
            hideImage();
            createTable();
            startCountdown();
        }
    });
});

// 显示图片（在按下空格前）
function displayImage() {
    let imageElement = document.createElement("img");
    imageElement.src = "image.jpg"; // 替换为你希望显示的图片路径
    imageElement.alt = "实验图片";
    imageElement.id = "experimentImage"; // 给图片一个ID以便以后隐藏
    document.body.appendChild(imageElement);

    // 为图片添加居中样式
    document.body.style.textAlign = "center"; // 水平居中
    imageElement.style.marginTop = "20px";     // 添加一些顶部空白，使图片不紧贴顶部
    imageElement.style.maxWidth = "100%";      // 确保图片不会超出屏幕宽度
}


// 隐藏图片
function hideImage() {
    let imageElement = document.getElementById("experimentImage");
    if (imageElement) {
        imageElement.style.display = "none"; // 隐藏图片
    }
}

function startCountdown() {
    let countdownElement = document.getElementById("countdown");
    countdownElement.textContent = totalTime;

    countdownTimer = setInterval(function() {
        totalTime--;
        countdownElement.textContent = totalTime;
        if (totalTime <= 0) {
            clearInterval(countdownTimer);
            calculateResults();
        }
    }, 1000);
}

function createTable() {
    let table = document.getElementById("gameTable");
    table.innerHTML = ""; // 清空之前的表格

    for (let i = 0; i < correctAnswers.length; i++) {
        let row = table.insertRow();
        for (let j = 0; j < correctAnswers[i].length; j++) {
            let cell = row.insertCell();
            cell.textContent = words[i][j];  // 用词语数组填充单元格
            cell.onclick = function() {
                toggleCellSelection(i, j);
            };
        }
    }
}

function toggleCellSelection(row, col) {
    let cell = document.getElementById("gameTable").rows[row].cells[col];
    
    if (selectedCells.includes(`${row},${col}`)) {
        // 取消选择
        selectedCells = selectedCells.filter(cellId => cellId !== `${row},${col}`);
        cell.classList.remove("selected");
    } else {
        // 选择
        selectedCells.push(`${row},${col}`);
        cell.classList.add("selected");
    }
}

function calculateResults() {
    let correctCount = 0;
    let incorrectCount = 0;
    let detailedResults = [];

    for (let i = 0; i < correctAnswers.length; i++) {
        for (let j = 0; j < correctAnswers[i].length; j++) {
            let isSelected = selectedCells.includes(`${i},${j}`);
            let isCorrect = correctAnswers[i][j] === 1;

            // 判断正确与否
            let result = {
                word: words[i][j],
                isSelected: isSelected,
                isCorrect: isCorrect,
                isAnswerCorrect: (isSelected === isCorrect)
            };

            if (result.isAnswerCorrect) {
                correctCount++;
            } else {
                incorrectCount++;
            }

            detailedResults.push(result);
        }
    }

    alert(`正确数量: ${correctCount}, 错误数量: ${incorrectCount}`);
    exportCSV(detailedResults, correctCount, incorrectCount);
}

function exportCSV(detailedResults, correctCount, incorrectCount) {
    // CSV 数据的表头
    const header = ["词语", "是否选中", "正确答案", "是否正确"];

    let data = [];
    // 添加详细结果
    detailedResults.forEach(result => {
        data.push([result.word, result.isSelected ? "是" : "否", result.isCorrect ? "是" : "否", result.isAnswerCorrect ? "是" : "否"]);
    });

    // 添加总结行
    data.push(["正确数量", correctCount, "错误数量", incorrectCount]);

    // 构建 CSV 内容
    let csvContent = "data:text/csv;charset=utf-8,";
    // 添加表头
    csvContent += header.join(",") + "\r\n";
    
    // 添加每一行数据
    data.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    // 创建并触发下载
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "results.csv");
    link.click();
}
