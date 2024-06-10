const apiUrl = 'http://localhost:3000/api/items';
const name = 'material'; // 실제 재료명으로 변경
let currentQuantity = 100; // 초기값 설정

// 요소 가져오기
const currentQuantityDisplay = document.getElementById('current-quantity');
const inputQuantity = document.getElementById('input-quantity');
const changeQuantityDisplay = document.getElementById('change-quantity');
const historyContainer = document.getElementById('historyContainer');
const historyList = document.getElementById('historyList');

// 입력 수량 변경 시 실시간 업데이트
inputQuantity.addEventListener('input', () => {
  const inputValue = parseInt(inputQuantity.value) || 0; 
  changeQuantityDisplay.textContent = inputValue; 
  currentQuantityDisplay.textContent = currentQuantity + inputValue; 
});

// 감소 버튼 클릭 시
function decreaseQuantity() {
  const inputValue = parseInt(inputQuantity.value) || 0;
  if (inputValue > 0 && currentQuantity - inputValue >= 0) {
    currentQuantity -= inputValue;
    updateDisplays();
  } else {
    alert('감소할 수량이 부족하거나 입력값이 올바르지 않습니다.');
  }
}

// 증가 버튼 클릭 시
function increaseQuantity() {
  const inputValue = parseInt(inputQuantity.value) || 0;
  if (inputValue > 0) {
    currentQuantity += inputValue;
    updateDisplays();
  } else {
    alert('입력값이 올바르지 않습니다.');
  }
}

// 화면 업데이트 함수
function updateDisplays() {
  currentQuantityDisplay.textContent = currentQuantity;
  changeQuantityDisplay.textContent = inputQuantity.value; 
}

// 저장 버튼 클릭 시
document.getElementById('saveButton').addEventListener('click', () => {
  const inputValue = parseInt(inputQuantity.value) || 0;
  if (inputValue <= 0) {
    alert('입력값이 올바르지 않습니다.');
    return;
  }

  const updatedItem = {
    name: name,
    quantity: currentQuantity,
    previousQuantity: currentQuantity - inputValue 
  };

  // 데이터베이스에 저장 (PUT 요청)
  fetch(`${apiUrl}/${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedItem)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    alert('저장되었습니다.');
    inputQuantity.value = 0;
    changeQuantityDisplay.textContent = 0;
    currentQuantity = data.quantity; 
    currentQuantityDisplay.textContent = currentQuantity;
  })
  .catch(error => {
    console.error('저장 중 오류 발생:', error);
    alert('저장 중 오류가 발생했습니다.');
  });
});


// 히스토리 버튼 클릭 시
document.getElementById('history-button').addEventListener('click', () => {
  fetch(`${apiUrl}/${encodeURIComponent(name)}/history`)
    .then(res => res.json())
    .then(history => {
      historyList.innerHTML = ''; 
      history.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${new Date(entry.timestamp).toLocaleString()}: ${entry.changeQuantity} 변경 (현재 수량: ${entry.newQuantity})`;
        historyList.appendChild(listItem);
      });
      historyContainer.style.display = 'block'; 
    });
});
