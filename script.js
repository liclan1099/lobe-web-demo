let model;

async function loadModel() {
  model = await tf.loadLayersModel('./model/model.json');
  console.log('模型已載入');
}

loadModel();

document.getElementById('imageUpload').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 224, 224);

    const imageTensor = tf.browser.fromPixels(canvas)
      .toFloat()
      .expandDims(0)
      .div(255);

    const prediction = await model.predict(imageTensor).data();
    const maxIndex = prediction.indexOf(Math.max(...prediction));
    document.getElementById('result').innerText = `預測結果：第 ${maxIndex + 1} 類`;
  };
});
